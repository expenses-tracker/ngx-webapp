import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Contacts, RecentUsers, UserData, UserDetails } from '../data/users';
import { AbstractHttpService } from '../services/http/abstract-http.service';
import { environment } from 'environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { NbAuthService, NbAuthToken } from '@nebular/auth';

@Injectable()
export class UserService extends UserData {

  private time: Date = new Date;
  public userDetails: UserDetails;

  currentUser() {
    return this.userDetails;
  }

  constructor(private _http: AbstractHttpService,
    private _authService: NbAuthService) {
    super();
  }

  private users = {
    nick: { name: 'Nick Jones', picture: 'assets/images/nick.png' },
    eva: { name: 'Eva Moor', picture: 'assets/images/eva.png' },
    jack: { name: 'Jack Williams', picture: 'assets/images/jack.png' },
    lee: { name: 'Lee Wong', picture: 'assets/images/lee.png' },
    alan: { name: 'Alan Thompson', picture: 'assets/images/alan.png' },
    kate: { name: 'Kate Martinez', picture: 'assets/images/kate.png' },
  };
  private types = {
    mobile: 'mobile',
    home: 'home',
    work: 'work',
  };
  private contacts: Contacts[] = [
    { user: this.users.nick, type: this.types.mobile },
    { user: this.users.eva, type: this.types.home },
    { user: this.users.jack, type: this.types.mobile },
    { user: this.users.lee, type: this.types.mobile },
    { user: this.users.alan, type: this.types.home },
    { user: this.users.kate, type: this.types.work },
  ];
  private recentUsers: RecentUsers[]  = [
    { user: this.users.alan, type: this.types.home, time: this.time.setHours(21, 12)},
    { user: this.users.eva, type: this.types.home, time: this.time.setHours(17, 45)},
    { user: this.users.nick, type: this.types.mobile, time: this.time.setHours(5, 29)},
    { user: this.users.lee, type: this.types.mobile, time: this.time.setHours(11, 24)},
    { user: this.users.jack, type: this.types.mobile, time: this.time.setHours(10, 45)},
    { user: this.users.kate, type: this.types.work, time: this.time.setHours(9, 42)},
    { user: this.users.kate, type: this.types.work, time: this.time.setHours(9, 31)},
    { user: this.users.jack, type: this.types.mobile, time: this.time.setHours(8, 0)},
  ];

  getUserDetails(email: string): Observable<UserDetails> {
    const url = `${environment.service.domain}${environment.service.endpoints.user}email/${email}`;
    return this._http.get(url).pipe(map((resp: UserDetails) => {
      this.userDetails = resp[0];
      return this.userDetails;
    }));
  }

  logout() {
    const url = `${environment.service.domain}${environment.service.endpoints.logout}`;
    return this._http.post(url, {
      // tslint:disable-next-line: trailing-comma
      email: this.userDetails.email
    }).pipe(tap(() => localStorage.removeItem('auth_app_token')));
  }

  getUsers(): Observable<any> {
    return this._authService.getToken().pipe(switchMap((token: NbAuthToken) => {
      const email = token.getPayload().email;
      return this.getUserDetails(email);
    }));
    // return observableOf(this.users);
  }

  getContacts(): Observable<Contacts[]> {
    return observableOf(this.contacts);
  }

  getRecentUsers(): Observable<RecentUsers[]> {
    return observableOf(this.recentUsers);
  }
}
