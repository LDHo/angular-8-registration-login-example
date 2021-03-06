import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {


        if (this.authenticationService.isUserSessionExpired()) {
            console.log('test');
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        } else {
            return true;
        }
    }
}