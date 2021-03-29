import { Injectable } from '@angular/core';
import { UserData, UserDetails } from '../data/users';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  private user: UserDetails;

  constructor(private _userService: UserData) { }

  currentUser() {
    return this.user;
  }

  fetchUserDetail() {
    return this._userService.getUsers().pipe(map((user) => {
      this.user = user;
      return user;
    }));
  }

  logout() {
    return this._userService.logout();
  }
}
