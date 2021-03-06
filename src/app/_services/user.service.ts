import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserRegisterRequestPayload } from '@/_models';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }


    register(user: UserRegisterRequestPayload) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    sendContactForm(contactInfo) {
        return this.http.patch(`${environment.apiUrl}/users/update`, contactInfo);
    }

    getProfile() {
        return this.http.get(`${environment.apiUrl}/users/profile`);
    }
}