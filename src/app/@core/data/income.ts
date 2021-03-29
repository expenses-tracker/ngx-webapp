import { Observable } from 'rxjs';

export interface Income {
  _id?: string;
  description: string;
  amount: number;
  dated: Date;
  paymentType: string;
  tag: string;
  subDescription: string;
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
}

export interface IncomeChart {
  _id: {
    month: number;
    year: number;
  };
  amount: number;
  paymentTypes: string[];
}

export abstract class IncomeData {
  abstract getIncomes(): Observable<Income[]>;
  abstract addIncome(income: Income): Observable<any>;
  abstract deleteIncome(income: Income): Observable<any>;
  abstract updateIncome(income: Income): Observable<any>;
  abstract fetchIncomeForDateRange(from: Date, to: Date): Observable<any>;
}
