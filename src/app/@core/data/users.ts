import { Observable } from 'rxjs';

export interface User {
  name: string;
  picture: string;
}

export interface UserDetails {
  _id: string;
  permissions: string[];
  email: string;
  fullName: string;
  preferences: any;
  lastLoggedOn: Date;
  isLoggedIn: boolean;
}

export interface Contacts {
  user: User;
  type: string;
}

export interface RecentUsers extends Contacts {
  time: number;
}

export abstract class UserData {
  abstract getUserDetails(email: string): Observable<UserDetails>;
  abstract getUsers(): Observable<any>;
  abstract getContacts(): Observable<Contacts[]>;
  abstract getRecentUsers(): Observable<RecentUsers[]>;
  abstract logout(): Observable<Object>;
}
