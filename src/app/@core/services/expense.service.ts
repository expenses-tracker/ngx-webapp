import { Injectable } from '@angular/core';
import { ExpenseData, Expense } from '../data/expense';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AbstractHttpService } from './http/abstract-http.service';
import { UserDetailService } from './user-detail.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService extends ExpenseData {

  private updated$ = new BehaviorSubject<boolean>(false);

  listenToUpdates$() {
    return this.updated$.asObservable();
  }

  notifyUpdates$(notify?: boolean) {
    notify = notify ? notify : false;
    this.updated$.next(notify);
  }

  get url() {
    return `${environment.service.domain}${environment.service.endpoints.expenseService}`;
  }

  constructor(private _http: AbstractHttpService, private _userService: UserDetailService) {
    super();
  }

  getExpenses(): Observable<any[]> {
    return this._http.get(this.url).pipe(map(res => res as any[]));
  }

  addExpense(expense: Expense): Observable<any> {
    const reqBody = {
      description: expense.description,
      createdBy: this._userService.currentUser().fullName,
      updatedOn: '',
      dated: expense.dated.toISOString(),
      amount: expense.amount,
      paymentType: expense.paymentType,
      category: expense.category,
      tag: expense.tag,
      subDescription: expense.subDescription
    };
    return this._http.post(this.url, reqBody);
  }

  updateExpense(expense: Expense): Observable<any> {
    const reqBody = {
      _id: expense._id,
      description: expense.description,
      amount: expense.amount,
      paymentType: expense.paymentType,
      category: expense.category,
      tag: expense.tag,
      subDescription: expense.subDescription,
      dated: expense.dated.toISOString(),
      createdBy: expense.createdBy,
      createdOn: expense.createdOn,
      updatedBy: this._userService.currentUser().fullName
    };
    return this._http.put(`${this.url}${expense._id}`, reqBody);
  }

  deleteExpense(expense: Expense): Observable<any> {
    return this._http.delete(`${this.url}${expense._id}`);
  }

  fetchExpenseForDateRange(from: Date, to: Date): Observable<any> {
    const reqBody = {
      from: from,
      to: to
    };
    return this._http.post(`${this.url}${environment.service.endpoints.dateRange}`, reqBody);
  }
}
