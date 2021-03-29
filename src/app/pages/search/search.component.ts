import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { SmartTableService } from 'app/@core/mock/smart-table.service';
import { Category } from 'app/@core/models/category.model';
import { PaymentType } from 'app/@core/models/payment-type.model';
import { SearchMetadata } from 'app/@core/models/searchMetadata.model';
import { SearchService } from 'app/@core/services/search.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  filterForm: FormGroup;
  paymentType$: Observable<PaymentType[]>;
  category$: Observable<Category[]>;
  filterData: SearchMetadata;

  constructor(protected ref: NbDialogRef<SearchComponent>,
    private fb: FormBuilder,
    private smartTableService: SmartTableService,
    private searchService: SearchService) { }

  ngOnInit(): void {
    this.filterData = this.searchService.getFilter();
    this.paymentType$ = this.smartTableService.getAllPaymentTypes();
    this.category$ = this.smartTableService.getAllCategories();
    this.filterForm = this.fb.group({
      from: this.filterData ? this.filterData.from ? new Date(this.filterData.from) : '' : '',
      to: this.filterData ? this.filterData.to ? new Date(this.filterData.to) : '' : '',
      paymentType: this.filterData ? this.filterData.paymentType : '',
      category: this.filterData ? this.filterData.category : '',
      type: this.filterData ? this.filterData.type : ''
    });
  }

  onSubmit(filterData) {
    const filters = filterData;
    if (this.filterData.searchString && this.filterData.searchString.length > 0) {
      filters.searchString = this.filterData.searchString;
    }
    this.searchService.setFilter(filters);
    this.dismiss();
  }

  dismiss() {
    this.ref.close();
  }

}
