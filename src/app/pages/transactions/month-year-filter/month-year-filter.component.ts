import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpenseUtilService } from 'app/@core/utils/expense-util.service';

@Component({
  selector: 'ngx-month-year-filter',
  templateUrl: './month-year-filter.component.html',
  styleUrls: ['./month-year-filter.component.scss']
})
export class MonthYearFilterComponent implements OnInit {

  selectedMonth: string = this.util.currentMonth();
  selectedYear: number = this.util.currentYear();

  @Input() isDashboard: boolean;
  @Input() onlyYear?: boolean = false;
  @Input() filters?: string[] = [];

  @Output() onApply = new EventEmitter<{ from: Date, to: Date }>();
  @Output() onFilterChange = new EventEmitter<any>();

  constructor(private util: ExpenseUtilService) { }

  ngOnInit(): void {
    this.applyFilter();
  }

  months() {
    return this.util.monthNames();
  }

  years() {
    return this.util.years();
  }

  applyFilter() {
    let currentRange: { from: Date, to: Date };
    if (this.isDashboard) {
      currentRange = this.util.dashboardDateRange(String(this.selectedYear));
    } else {
      currentRange = this.util.monthDateRange(this.selectedMonth, String(this.selectedYear));
    }
    this.onApply.emit(currentRange);
  }

  filterSelect($event: any) {
    this.onFilterChange.emit($event);
  }

}
