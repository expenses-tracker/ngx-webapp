import { NgModule } from '@angular/core';
import {
  NbMenuModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbButtonModule,
  NbDialogModule,
  NbWindowModule,
  NbSpinnerModule, NbSelectModule, NbDatepickerModule, NbProgressBarModule, NbAlertModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { PaymentTypesComponent } from './payment-types/payment-types.component';
import { SmartTableComponent } from './tables/smart-table/smart-table.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { SmartTableData } from 'app/@core/data/smart-table';
import { SmartTableService } from 'app/@core/mock/smart-table.service';
import { ExportComponent } from './export/export.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogNamePromptComponent } from './modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TransactionsModule } from './transactions/transactions.module';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    NbButtonModule,
    NbDialogModule,
    NbWindowModule,
    NbSpinnerModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    ThemeModule,
    NbMenuModule,
    NbSelectModule,
    NbDatepickerModule,
    NbProgressBarModule,
    NbAlertModule,
    DashboardModule,
    TransactionsModule,
  ],
  declarations: [
    SmartTableComponent,
    PagesComponent,
    CategoriesComponent,
    PaymentTypesComponent,
    ProfileComponent,
    NotFoundComponent,
    ExportComponent,
    DialogNamePromptComponent,
    SearchComponent,
    SearchResultsComponent,
    LogoutComponent
  ],
  providers: [
    { provide: SmartTableData, useClass: SmartTableService },
  ],
})
export class PagesModule {
}
