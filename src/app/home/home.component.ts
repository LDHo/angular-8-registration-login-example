import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService, AlertService } from '@/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidator } from '@/_helpers/validator';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    contactForm: FormGroup;
    completedForm = false;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.contactForm = this.formBuilder.group({
            lastName: [{ value: '', disabled: this.completedForm }, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50)
            ]],
            firstName: [{ value: '', disabled: this.completedForm }, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50)
            ]],
            birthday: [{ value: '', disabled: this.completedForm }, [
                Validators.required,
                CustomValidator.birthdayValidator({ invalidDate: true })
            ]],
            ssn: [{ value: '', disabled: this.completedForm }, [
                Validators.required,
                Validators.pattern('^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$')
            ]]
        });
        this.userService.getProfile().subscribe((user: User) => {
            if (user.lastName && user.firstName && user.birthday && user.ssn) {
                this.completedForm = true;
            }
            const { lastName, firstName, birthday, ssn } = user;
            this.contactForm.setValue({
                lastName,
                firstName,
                birthday: birthday.match((/\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4}/))[0],
                ssn
            })
        })
    }

    // convenience getter for easy access to form fields
    get f() { return this.contactForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.contactForm.invalid) {
            console.log('invalid contact form')
            console.log(this.contactForm.controls);
            console.log(this.contactForm);
            return;
        }

        this.loading = true;
        const { lastName, firstName, birthday, ssn } = this.contactForm.value;
        const contactFormPayload = {
            lastName,
            firstName,
            ssn,
            birthday: new Date(birthday)
        }
        this.userService.sendContactForm(contactFormPayload)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Form Data Submitted');
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    logout() {
        this.authenticationService.logout();
    }
}