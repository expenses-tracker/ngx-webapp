import { Component, OnInit } from '@angular/core';
import { AggregateService } from 'app/@core/services/aggregate.service';
import { DashboardData } from 'app/@core/models/dashboard.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-expenses-dashboard',
  templateUrl: './expenses-dashboard.component.html',
  styleUrls: ['./expenses-dashboard.component.scss']
})
export class ExpensesDashboardComponent implements OnInit {

  dashboardData$: Observable<DashboardData>;
  chartXAxisLabels: string[];
  expensesChartDataSource: number[];
  incomesChartDataSource: number[];
  totalExpenses: number = 0;
  totalIncomes: number = 0;
  totalSavings: number = 0;
  currentRange: { from: Date, to: Date };

  constructor(private aggregateService: AggregateService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.totalExpenses = 0;
    this.totalIncomes = 0;
    this.totalSavings = 0;
    this.dashboardData$ = this.aggregateService.getDashboardData(this.currentRange).pipe(map((data: DashboardData) => {
      if (data) {
        data.expenses.chart = _.orderBy(data.expenses.chart, ['_id.month'], ['desc']);
        data.incomes.chart = _.orderBy(data.incomes.chart, ['_id.month'], ['desc']);
        return data;
      }
      return data;
    }), tap(data => this.formulateChartData(data))) as Observable<DashboardData>;
  }

  formulateChartData(data: DashboardData) {
    this.chartXAxisLabels = [];
    this.expensesChartDataSource = [];
    this.incomesChartDataSource = [];
    data.expenses.chart.forEach(expenseChart => {
      this.chartXAxisLabels.push(`${expenseChart._id.month}/${expenseChart._id.year}`);
      this.expensesChartDataSource.push(expenseChart.amount);
      this.totalExpenses += expenseChart.amount;
    });
    data.incomes.chart.forEach(incomeChart => {
      this.incomesChartDataSource.push(incomeChart.amount);
      this.totalIncomes += incomeChart.amount;
    });
    this.totalSavings = this.totalIncomes - this.totalExpenses;
  }

  onApplyFilter(filter: { from: Date, to: Date }) {
    this.currentRange = filter;
    this.loadData();
  }

}
