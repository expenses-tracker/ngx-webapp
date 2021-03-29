import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ExpensesDashboardComponent } from './dashboard/expenses-dashboard/expenses-dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { PaymentTypesComponent } from './payment-types/payment-types.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ExpensesDashboardComponent,
    },
    {
      path: 'search/results',
      component: SearchResultsComponent,
    },
    {
      path: 'transactions',
      loadChildren: () => import('./transactions/transactions.module')
        .then(m => m.TransactionsModule),
    },
    {
      path: 'categories',
      component: CategoriesComponent,
    },
    {
      path: 'payment-types',
      component: PaymentTypesComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
