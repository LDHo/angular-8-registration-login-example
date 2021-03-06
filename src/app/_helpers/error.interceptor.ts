import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (this.authenticationService.isUserSessionExpired() && this.authenticationService.getUserSessionToken()) {
                // has session token but it was already expired
                this.authenticationService.logout();
                location.reload(true);
            }
            let error;
            switch (err.status) {
                case 0: {
                    error = 'Unknown Error Occured. Please Check your Internet';
                    break;
                }
                case 400:
                case 401: {
                    error = err.error.error.message;
                    console.log(err);
                    break;
                }

            }
            // const error = err.error.message || err.statusText || err.error.error.message;
            return throwError(error);
        }))
    }
}