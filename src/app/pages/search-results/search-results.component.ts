import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchMetadata } from 'app/@core/models/searchMetadata.model';
import { SearchService } from 'app/@core/services/search.service';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ngx-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  filters: SearchMetadata;
  searchData$: Observable<any[]>;
  searchResultLength: number;
  private filterChangeSubscription: Subscription;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.filters = this.searchService.getFilter();
    this.onFilterChange();
  }

  onFilterChange() {
    this.filterChangeSubscription = this.searchService.listenToFilterUpdates$()
    .subscribe(
      (filter) => {
        if (!filter) {
          return;
        }
        this.filters = filter;
        if (this.filters.searchString && this.filters.searchString.length > 0) {
          this.searchData$ = this.searchService.search(this.filters).pipe(
            tap((result: any[]) => this.searchResultLength = result.length)
          );
        }
      });
  }

  getFiltersKeys() {
    return Object.keys(this.filters);
  }

  getFiltersValues(param: string) {
    return this.filters[param];
  }

  ngOnDestroy() {
    if (this.filterChangeSubscription) {
      this.filterChangeSubscription.unsubscribe();
    }
  }
}
