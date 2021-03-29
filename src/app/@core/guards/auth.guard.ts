import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';

@Injectable({
  // tslint:disable-next-line: trailing-comma
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private jwtToken: string;
  constructor(private authToken: NbAuthService, private router: Router) {}
  canActivate(): boolean {
    let tokenValid = false;
    this.authToken.getToken().subscribe((token) => {
      this.jwtToken = token.getValue();
      // sessionStorage.setItem('token', this.jwtToken);
      if (token.isValid()) {
        tokenValid = true;
      }
    });
    if (tokenValid) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  }

  getToken() {
    return this.jwtToken;
  }
}
