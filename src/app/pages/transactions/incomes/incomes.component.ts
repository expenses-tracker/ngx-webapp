import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { IncomeFormComponent } from '../income-form/income-form.component';
import { IncomeService } from 'app/@core/services/income.service';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { Income, IncomeChart } from 'app/@core/data/income';
import { ToasterService, ToastType } from 'app/@core/services/toaster.service';
import { AggregateService } from 'app/@core/services/aggregate.service';

@Component({
  selector: 'ngx-incomes',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.scss']
})
export class IncomesComponent implements OnInit, AfterViewInit {

  @Input() isDashboard?: boolean;
  @Input() data?: Income[];
  @Input() chartData?: IncomeChart[];

  incomes$: Subject<Income[]> = new Subject();
  incomeChartData$: Subject<IncomeChart[]> = new Subject();
  chartXAxisLabels: string[];
  chartYAxisLabels: string = 'Income';
  chartDataSource: number[];
  currentRange: { from: Date, to: Date };
  currentRangeYear: number;
  paymentTypes: string[] = [];
  incomes: Income[] = [];
  incomesData: Income[] = [];

  constructor(private dialogService: NbDialogService, private incomeService: IncomeService,
    private toasterService: ToasterService,
    private aggregateService: AggregateService) { }

  ngOnInit(): void {
    this.listenForUpdates$();
  }

  ngAfterViewInit() {
    if (this.isDashboard) {
      this.loadData();
    }
  }

  onApplyFilter(filter: { from: Date, to: Date }) {
    this.currentRange = filter;
    this.loadData();
  }

  loadData() {
    if (!this.isDashboard) {
      this.incomeService.fetchIncomeForDateRange(this.currentRange.from, this.currentRange.to).subscribe((data) => {
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
      this.formulateChartData(this.chartData as IncomeChart[]);
      this.incomeChartData$.next(this.chartData as IncomeChart[]);
      return;
    }
    this.aggregateService.getMonthlyIncome(this.currentRange).subscribe(data => {
      this.formulateChartData(data as IncomeChart[]);
      this.incomeChartData$.next(data as IncomeChart[]);
    });
  }

  getData(incomes: Income[]) {
    this.paymentTypes = this.getDistinctPaymentTypes(incomes);
    this.incomes = incomes;
    this.incomesData = this.incomes;
    this.incomes$.next(incomes);
  }

  addIncome() {
    this.dialogService.open(IncomeFormComponent);
  }

  onEdit(income: Income) {
    this.dialogService.open(IncomeFormComponent, {
      context: {
        incomeData: income
      }
    });
  }

  onDelete(income: Income) {
    this.incomeService.deleteIncome(income).subscribe(res => {
      this.loadData();
      this.loadCharts();
      this.toasterService.showToast(ToastType.SUCCESS, `Success`, `Income deleted successfully.`);
    }, (err: any) => {
      this.toasterService.showToast(ToastType.DANGER, `Error`, JSON.stringify(err));
    });
  }

  listenForUpdates$() {
    this.incomeService.listenToUpdates$().subscribe((updated: boolean) => {
      if (updated && !this.isDashboard) {
        this.loadData();
        this.loadCharts();
        this.incomeService.notifyUpdates$(false);
      }
    });
  }

  formulateChartData(data: IncomeChart[]) {
    this.chartXAxisLabels = [];
    this.chartDataSource = [];
    data = _.orderBy(data, ['_id.month'], ['desc']);
    data.forEach(incomeChart => {
      this.chartXAxisLabels.push(`${incomeChart._id.month}/${incomeChart._id.year}`);
      this.chartDataSource.push(incomeChart.amount);
    });
  }

  getDistinctPaymentTypes(incomes: Income[]) {
    const distinctPaymentTypes = _.uniq((_.map(incomes, 'paymentType')));
    distinctPaymentTypes.splice(0, 0, 'All');
    return distinctPaymentTypes;
  }

  onFilterChange($event) {
    if ($event === 'All') {
      this.incomesData = this.incomes;
      return;
    }
    const tempIncomes = _.filter(Object.assign([], this.incomes), (obj) => obj.paymentType === $event);
    this.incomesData = tempIncomes;
  }

}
