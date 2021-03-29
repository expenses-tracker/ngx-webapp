import { Injectable } from '@angular/core';
import { IncomeData, Income } from '../data/income';
import { Observable, BehaviorSubject } from 'rxjs';
import { AbstractHttpService } from './http/abstract-http.service';
import { UserDetailService } from './user-detail.service';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IncomeService extends IncomeData {

  private updated$ = new BehaviorSubject<boolean>(false);

  listenToUpdates$() {
    return this.updated$.asObservable();
  }

  notifyUpdates$(notify?: boolean) {
    notify = notify ? notify : false;
    this.updated$.next(notify);
  }

  get url() {
    return `${environment.service.domain}${environment.service.endpoints.incomeService}`;
  }

  constructor(private _http: AbstractHttpService, private _userService: UserDetailService) {
    super();
  }

  getIncomes(): Observable<any[]> {
    return this._http.get(this.url).pipe(map(res => res as any[]));
  }

  addIncome(income: Income): Observable<any> {
    const reqBody = {
      description: income.description,
      createdBy: this._userService.currentUser().fullName,
      updatedOn: '',
      dated: income.dated.toISOString(),
      amount: income.amount,
      paymentType: income.paymentType,
      tag: income.tag,
      subDescription: income.subDescription
    };
    return this._http.post(this.url, reqBody);
  }

  updateIncome(income: Income): Observable<any> {
    const reqBody = {
      _id: income._id,
      description: income.description,
      amount: income.amount,
      paymentType: income.paymentType,
      tag: income.tag,
      subDescription: income.subDescription,
      dated: income.dated.toISOString(),
      createdBy: income.createdBy,
      createdOn: income.createdOn,
      updatedBy: this._userService.currentUser().fullName
    };
    return this._http.put(`${this.url}${income._id}`, reqBody);
  }

  deleteIncome(income: Income): Observable<any> {
    return this._http.delete(`${this.url}${income._id}`);
  }

  fetchIncomeForDateRange(from: Date, to: Date): Observable<any> {
    const reqBody = {
      from: from,
      to: to
    };
    return this._http.post(`${this.url}${environment.service.endpoints.dateRange}`, reqBody);
  }
}
