import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Expense } from 'app/@core/data/expense';
import { Income } from 'app/@core/data/income';
import { ExportExpense, ExportService } from 'app/@core/services/export.service';

export enum ExportProgressMessage {
  FETCH_EXPENSE = 'Fetching expenses',
  FETCH_INCOME = 'Fetching incomes',
  PREPARE_DATA = 'Preparing data for export',
  EXPORTING = 'Exporting',
  FINISHED = 'Export Successful'
}

@Component({
  selector: 'ngx-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  exportForm: FormGroup;
  totalProgress: number = 0;
  progressMessage: ExportProgressMessage = ExportProgressMessage.FETCH_INCOME;
  incomes: Income[];
  expenses: Expense[];
  exportError: string;
  progressType = 'success';

  constructor(
    protected ref: NbDialogRef<ExportComponent>,
    private fb: FormBuilder,
    private exportService: ExportService) { }

  ngOnInit(): void {
    this.exportForm = this.fb.group({
      fromDate: '',
      toDate: ''
    });
  }

  dismiss() {
    this.ref.close();
  }

  export() {
    const from = this.exportForm.value.fromDate;
    const to = this.exportForm.value.toDate;
    this.exportService.fetchIncome(from, to).subscribe(incomes => {
      this.incomes = incomes as Income[];
      this.totalProgress = 25;
      this.progressMessage = ExportProgressMessage.FETCH_EXPENSE;
      this.exportService.fetchExpense(from, to).subscribe(expenses => {
        this.expenses = expenses as Expense[];
        this.totalProgress = 50;
        this.progressMessage = ExportProgressMessage.PREPARE_DATA;
        setTimeout(() => {
          const exportExpense: ExportExpense = {
            from: from,
            to: to,
            incomes: this.incomes,
            expenses: this.expenses
          };
          this.totalProgress = 75;
          this.progressMessage = ExportProgressMessage.EXPORTING;
          this.exportService.exportToXLS(exportExpense).then((value) => {
            this.totalProgress = 100;
            this.progressMessage = ExportProgressMessage.FINISHED;
            this.exportFinished();
          }).catch(err => {
            this.totalProgress = -1;
            this.progressType = 'error';
            console.error(JSON.stringify(err));
            this.exportError = JSON.stringify(err);
            this.exportFinished();
          });
        }, 500);
      });
    });
  }

  exportFinished() {
    setTimeout(() => {
      this.totalProgress = 0;
      this.exportError = '';
      this.exportForm.reset();
      this.exportService.reset();
    }, 1000);
  }

}
