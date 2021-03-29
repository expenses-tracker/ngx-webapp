import { Injectable } from '@angular/core';
import { AbstractHttpService } from './http/abstract-http.service';
import { environment } from 'environments/environment';
import { ExpenseUtilService } from '../utils/expense-util.service';

@Injectable({
  providedIn: 'root'
})
export class AggregateService {

  constructor(private _http: AbstractHttpService, private _util: ExpenseUtilService) { }

  getDashboardData(dateRange: { from: Date, to: Date }) {
    const url = `${environment.service.domain}${environment.service.endpoints.dashboard}`;
    return this._http.post(url, dateRange);
  }

  getMonthlyExpense(dateRange: { from: Date, to: Date }) {
    const payload = this.getDateRange(dateRange);
    const url = `${environment.service.domain}${environment.service.endpoints.monthlyExpense}`;
    return this._http.post(url, payload);
  }

  getMonthlyCategoryExpense() {
    const url = `${environment.service.domain}${environment.service.endpoints.monthlyCategoryExpense}`;
    return this._http.get(url);
  }

  getMonthlyPaymentTypeExpense() {
    const url = `${environment.service.domain}${environment.service.endpoints.monthlyPaymentTypeExpense}`;
    return this._http.get(url);
  }

  getMonthlyIncome(dateRange: { from: Date, to: Date }) {
    const payload = this.getDateRange(dateRange);
    const url = `${environment.service.domain}${environment.service.endpoints.monthlyIncome}`;
    return this._http.post(url, payload);
  }

  private getDateRange(dateRange: { from: Date, to: Date }) {
    const year = dateRange.from.getFullYear();
    const range = this._util.dashboardDateRange(String(year));
    return range;
  }
}
