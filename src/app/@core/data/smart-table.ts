import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { PaymentType } from '../models/payment-type.model';

export enum SmartDataType {
  CATEGORIES = 'categories',
  PAYMENT_TYPES = 'payment-types',
  INCOMES = 'incomes',
  EXPENSES = 'expenses',
  SAMPLE = 'sample',
}

export abstract class SmartTableData {
  abstract getData(type: SmartDataType): Observable<any[]>;
  abstract addCategory(category: Category): Observable<any>;
  abstract editCategory(category: Category): Observable<any>;
  abstract deleteCategory(category: Category): Observable<any>;
  abstract addPaymentType(paymentType: PaymentType): Observable<any>;
  abstract editPaymentType(paymentType: PaymentType): Observable<any>;
  abstract deletePaymentType(paymentType: PaymentType): Observable<any>;
}
