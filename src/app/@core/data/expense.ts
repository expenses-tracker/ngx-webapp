import { Observable } from 'rxjs';

export interface Expense {
  _id?: string;
  description: string;
  amount: number;
  dated: Date;
  paymentType: string;
  tag: string;
  subDescription: string;
  category: string;
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
}

export interface ExpenseChart {
  _id: {
    month: number;
    year: number;
  };
  amount: number;
  paymentTypes: string[];
  categories: string[];
}

export abstract class ExpenseData {
  abstract getExpenses(): Observable<Expense[]>;
  abstract addExpense(expense: Expense): Observable<any>;
  abstract deleteExpense(expense: Expense): Observable<any>;
  abstract updateExpense(expense: Expense): Observable<any>;
  abstract fetchExpenseForDateRange(from: Date, to: Date): Observable<any>;
}
