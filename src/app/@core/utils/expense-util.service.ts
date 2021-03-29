import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpenseUtilService {

  constructor() { }

  private defaultMonths = ['January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'];

  monthNames() {
    return this.defaultMonths;
  }

  currentMonth() {
    const now = new Date();
    const currentMonth = now.getMonth();
    return this.defaultMonths[currentMonth];
  }

  years() {
    const startYear = 2017;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let index = startYear; index <= currentYear; index++) {
      years.push(index);
    }
    return years;
  }

  currentYear() {
    return new Date().getFullYear();
  }

  monthDateRange(month: string, year: string): { from: Date, to: Date } {
    const monthIdx = this.defaultMonths.indexOf(month);
    if (monthIdx === -1) {
      return;
    }
    const daysInMonth = new Date(Number(year), monthIdx + 1, 0).getDate();
    return {
      from: new Date(`${year}-${monthIdx + 1}-1`),
      to: new Date(`${year}-${monthIdx + 1}-${daysInMonth}`)
    };
  }

  dashboardDateRange(year: string): { from: Date, to: Date } {
    if (!year) {
      year = String(new Date().getFullYear());
    }
    return {
      from: new Date(`${year}-01-01`),
      to: new Date(`${year}-12-31`)
    };
  }
}
