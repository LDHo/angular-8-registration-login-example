import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';


@Injectable({ providedIn: 'root' })
export class JWTTokenService {

  constructor() {
  }

  getDecodeToken<T>(jwtToken: string): T {
    return jwt_decode(jwtToken);
  }

  getExpiryTime(jwtToken: string) {
    const decodedToken: any = this.getDecodeToken(jwtToken);
    return decodedToken ? decodedToken.exp : null;
  }

  isTokenExpired(jwtToken: string): boolean {
    const expiryTime: number = Number(this.getExpiryTime(jwtToken));
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }
}