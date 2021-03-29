import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionsComponent } from './transactions.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomesComponent } from './incomes/incomes.component';

const routes: Routes = [{
  path: '',
  component: TransactionsComponent,
  children: [
    {
      path: 'expenses',
      component: ExpensesComponent,
    },
    {
      path: 'incomes',
      component: IncomesComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {
}
