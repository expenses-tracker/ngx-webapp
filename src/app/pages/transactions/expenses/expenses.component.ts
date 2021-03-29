import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { Expense, ExpenseChart } from 'app/@core/data/expense';
import { ToasterService, ToastType } from 'app/@core/services/toaster.service';
import { ExpenseService } from 'app/@core/services/expense.service';
import { AggregateService } from 'app/@core/services/aggregate.service';

@Component({
  selector: 'ngx-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, AfterViewInit {

  @Input() isDashboard?: boolean;
  @Input() data?: Expense[];
  @Input() chartData?: ExpenseChart[];

  expenses$: Subject<Expense[]> = new Subject();
  expenseChartData$: Subject<ExpenseChart[]> = new Subject();
  chartXAxisLabels: string[];
  chartYAxisLabels: string = 'Expense';
  chartDataSource: number[];
  currentRange: { from: Date, to: Date };
  currentRangeYear: number;
  categories: string[];
  expenses: Expense[] = [];
  expensesData: Expense[] = [];

  constructor(private dialogService: NbDialogService, private expenseService: ExpenseService,
    private toasterService: ToasterService,
    private aggregateService: AggregateService) { }

  ngOnInit(): void {
    this.listenForUpdates$();
  }

  ngAfterViewInit() {
    if (this.isDashboard && this.data) {
      this.loadData();
    }
  }

  onApplyFilter(filter: { from: Date, to: Date }) {
    this.currentRange = filter;
    this.loadData();
  }

  loadData() {
    if (!this.isDashboard) {
      this.expenseService.fetchExpenseForDateRange(this.currentRange.from, this.currentRange.to).subscribe((data) => {
        this.getData(data);
      });
      this.loadCharts();
    } else {
      this.getData(this.data);
    }
  }

  loadCharts() {
    if (this.currentRange.from.getFullYear() === this.currentRangeYear) {
      return;
    }
    this.currentRangeYear = this.currentRange.from.getFullYear();
    this.chartDataSource = undefined;
    if (this.isDashboard) {
      this.formulateChartData(this.chartData as ExpenseChart[]);
      this.expenseChartData$.next(this.chartData as ExpenseChart[]);
      return;
    }
    this.aggregateService.getMonthlyExpense(this.currentRange).subscribe(data => {
      this.formulateChartData(data as ExpenseChart[]);
      this.expenseChartData$.next(data as ExpenseChart[]);
    });
  }

  getData(expenses: Expense[]) {
    this.categories = this.getDistinctCategories(expenses);
    this.expenses = expenses;
    this.expensesData = this.expenses;
    this.expenses$.next(expenses);
  }

  addExpense() {
    this.dialogService.open(ExpenseFormComponent);
  }

  onEdit(expense: Expense) {
    this.dialogService.open(ExpenseFormComponent, {
      context: {
        expenseData: expense
      }
    });
  }

  onDelete(expense: Expense) {
    this.expenseService.deleteExpense(expense).subscribe(res => {
      this.loadData();
      this.loadCharts();
      this.toasterService.showToast(ToastType.SUCCESS, `Success`, `Expense deleted successfully.`);
    }, (err: any) => {
      this.toasterService.showToast(ToastType.DANGER, `Error`, JSON.stringify(err));
    });
  }

  listenForUpdates$() {
    this.expenseService.listenToUpdates$().subscribe((updated: boolean) => {
      if (updated && !this.isDashboard) {
        this.loadData();
        this.loadCharts();
        this.expenseService.notifyUpdates$(false);
      }
    });
  }

  formulateChartData(data: ExpenseChart[]) {
    this.chartXAxisLabels = [];
    this.chartDataSource = [];
    data = _.orderBy(data, ['_id.month'], ['desc']);
    data.forEach(expenseChart => {
      this.chartXAxisLabels.push(`${expenseChart._id.month}/${expenseChart._id.year}`);
      this.chartDataSource.push(expenseChart.amount);
    });
  }

  getDistinctCategories(expenses: Expense[]) {
    const distinctCategories = _.uniq((_.map(expenses, 'category')));
    distinctCategories.splice(0, 0, 'All');
    return distinctCategories;
  }

  onFilterChange($event) {
    if ($event === 'All') {
      this.expensesData = this.expenses;
      return;
    }
    const tempExpenses = _.filter(Object.assign([], this.expenses), (obj) => obj.category === $event);
    this.expensesData = tempExpenses;
  }
}
