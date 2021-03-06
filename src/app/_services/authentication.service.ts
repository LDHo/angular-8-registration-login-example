import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginResponse, User } from '@/_models';
import { environment } from '@/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { StorageKey } from '@/_models/storage';
import { JWTTokenService } from './jwt.service';
import { JWTTokenPayload } from '@/_models/jwt-token';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient,
        private storageService: LocalStorageService,
        private jwtService: JWTTokenService,
        private userService: UserService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/users/login`, { email, password }).pipe(map((user: LoginResponse) => {
            const decodedToken: JWTTokenPayload = this.jwtService.getDecodeToken(user.token);
            this.storageService.set(StorageKey.CURRENT_USER_SESSION_TOKEN, user.token);
            this.storageService.set(StorageKey.CURRENT_USER_ID, decodedToken.id);
            this.storageService.set(StorageKey.EMAIL, email);
        }));
    }

    isUserSessionExpired() {
        const token = this.storageService.get(StorageKey.CURRENT_USER_SESSION_TOKEN);
        if (token) {
            return this.jwtService.isTokenExpired(token);
        }
        return true;
    }

    getUserSessionToken(): string {
        return this.storageService.get(StorageKey.CURRENT_USER_SESSION_TOKEN);
    }

    logout() {
        // remove user from local storage and set current user to null
        this.storageService.remove(StorageKey.CURRENT_USER_SESSION_TOKEN);
        this.storageService.remove(StorageKey.CURRENT_USER_ID);
        this.storageService.remove(StorageKey.EMAIL);
        location.reload(true);
    }
}