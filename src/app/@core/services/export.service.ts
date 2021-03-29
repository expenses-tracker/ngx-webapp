import { Injectable } from '@angular/core';
import { Expense } from '../data/expense';
import { Income } from '../data/income';
import { ExpenseService } from './expense.service';
import { IncomeService } from './income.service';
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { UserDetailService } from './user-detail.service';
import { DatePipe } from '@angular/common';

export interface ExportExpense {
  from: Date;
  to: Date;
  incomes: Income[];
  expenses: Expense[];
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  _workBook: Workbook;
  _exportData: ExportExpense;

  workbook() {
    this._workBook = new Workbook();
  }

  setExportData(exportData: ExportExpense) {
    this._exportData = exportData;
  }

  constructor(
    private _expense: ExpenseService,
    private _income: IncomeService,
    private _user: UserDetailService,
    private _datePipe: DatePipe) { }

  fetchIncome(from: Date, to: Date) {
    return this._income.fetchIncomeForDateRange(from, to);
  }

  fetchExpense(from: Date, to: Date) {
    return this._expense.fetchExpenseForDateRange(from, to);
  }

  exportToXLS(exportModel: ExportExpense): Promise<any> {
    try {
      this.setExportData(exportModel);
      this.workbook();
      this.setWorkBookProperties();
    } catch (error) {
      return Promise.reject(`Unable to initialize workbook`);
    }
    return this.downloadWorkBook();
  }

  setWorkBookProperties() {
    this._workBook.creator = this._user.currentUser().fullName;
    this._workBook.lastModifiedBy = this._user.currentUser().fullName;
    this._workBook.created = new Date();
    this._workBook.modified = new Date();
    this._workBook.lastPrinted = new Date();
    const worksheet = this._workBook.addWorksheet('Transactions');
    // Add column headers and define column keys and widths
    // Note: these column structures are a workbook-building convenience only,
    // apart from the column width, they will not be fully persisted.
    worksheet.columns = [
      { header: 'Date', key: 'dated', width: 20 },
      { header: 'Description', key: 'description', width: 60 },
      { header: 'Payment Type', key: 'paymentType', width: 30 },
      { header: 'Income', key: 'income', width: 20 },
      { header: 'Amount', key: 'amount', width: 20 },
      { header: 'Household', key: 'household', width: 20 },
      { header: 'Travel', key: 'travel', width: 20 },
      { header: 'Bills', key: 'bills', width: 20 },
      { header: 'Outside Food', key: 'outsideFood', width: 20 },
      { header: 'Shopping', key: 'shopping', width: 20 },
      { header: 'Others', key: 'others', width: 20 },
    ];
  }

  addRowsToWorkSheet(worksheet: Worksheet) {
    this._exportData.incomes.forEach(income => {
      worksheet.addRow({
        dated: this._datePipe.transform(income.dated, 'yyyy-MM-dd'),
        description: income.description,
        paymentType: income.paymentType,
        income: income.amount
      });
    });
    this._exportData.expenses.forEach(expense => {
      worksheet.addRow(this.getExpenseWithCategoryForExcel(expense));
    });
  }

  getExpenseWithCategoryForExcel(expense: Expense) {
    const expenseObj = {
      dated: this._datePipe.transform(expense.dated, 'yyyy-MM-dd'),
      description: expense.description,
      paymentType: expense.paymentType,
      amount: expense.amount
    };
    switch (expense.category) {
      case 'Bills':
        expenseObj['bills'] = expense.amount;
        break;
      case 'Food/Snacks':
        expenseObj['outsideFood'] = expense.amount;
        break;
      case 'Household':
        expenseObj['household'] = expense.amount;
        break;
      case 'Travel':
        expenseObj['travel'] = expense.amount;
        break;
      case 'Shopping':
        expenseObj['shopping'] = expense.amount;
        break;
      default:
        expenseObj['others'] = expense.amount;
        break;
    }
    return expenseObj;
  }

  downloadWorkBook() {
    const fromDate = this._datePipe.transform(this._exportData.from, 'yyyy-MM-dd');
    const toDate = this._datePipe.transform(this._exportData.to, 'yyyy-MM-dd');
    this.addRowsToWorkSheet(this._workBook.getWorksheet('Transactions'));
    return new Promise((resolve, reject) => {
      this._workBook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, `Expenses_${fromDate}_${toDate}`);
        resolve();
      }).catch(err => reject(err));
    });
  }

  reset() {
    this._workBook = undefined;
    this._exportData = undefined;
  }
}
