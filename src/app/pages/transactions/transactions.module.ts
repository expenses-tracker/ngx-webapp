import { NgModule } from '@angular/core';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomesComponent } from './incomes/incomes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from 'app/@theme/theme.module';
import {
  NbUserModule,
  NbStepperModule,
  NbCardModule,
  NbButtonModule,
  NbListModule,
  NbInputModule,
  NbSelectModule,
  NbOptionModule,
  NbDatepickerModule,
  NbIconModule, NbAlertModule, NbActionsModule
} from '@nebular/theme';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { IncomeFormComponent } from './income-form/income-form.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ChartsModule } from '../charts/charts.module';
import { MonthYearFilterComponent } from './month-year-filter/month-year-filter.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbAlertModule,
    NbActionsModule,
    NbInputModule,
    NbIconModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbSelectModule,
    NbOptionModule,
    NbUserModule,
    NbDatepickerModule,
    ChartsModule,
    TransactionsRoutingModule,
  ],
  declarations: [
    TransactionsComponent,
    ExpensesComponent,
    IncomesComponent,
    IncomeFormComponent,
    ExpenseFormComponent,
    MonthYearFilterComponent,
    TransactionsListComponent,
  ],
  exports: [
    IncomesComponent,
    ExpensesComponent,
    MonthYearFilterComponent
  ],
})
export class TransactionsModule {}
