import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available

        if (!this.authenticationService.isUserSessionExpired()) {
            if (this.authenticationService.getUserSessionToken()) {
                console.log(this.authenticationService.getUserSessionToken());
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${this.authenticationService.getUserSessionToken()}`
                    }
                });
            }
        }
        return next.handle(request);
    }
}