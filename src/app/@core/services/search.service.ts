import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import { SearchMetadata } from '../models/searchMetadata.model';
import { AbstractHttpService } from './http/abstract-http.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private filterApplied: SearchMetadata;
  private filterUpdates$ = new BehaviorSubject<SearchMetadata>(undefined);

  constructor(private _http: AbstractHttpService) { }

  get url() {
    return `${environment.service.domain}${environment.service.endpoints.search}`;
  }

  listenToFilterUpdates$() {
    return this.filterUpdates$.asObservable();
  }

  setFilter(filter: SearchMetadata) {
    this.filterApplied = filter;
    this.filterUpdates$.next(filter);
  }

  getFilter() {
    return this.filterApplied;
  }

  search(filter: SearchMetadata) {
    const reqBody = {
      searchString: filter.searchString,
      type: filter.type ? filter.type : 'expenses'
    };
    if (filter.from && filter.to) {
      reqBody['timeFrame'] = {
        from: filter.from,
        to: filter.to
      };
    } else if (filter.from) {
      reqBody['timeFrame'] = {
        from: filter.from,
        to: new Date().toISOString()
      };
    }
    if (filter.category) {
      reqBody['category'] = filter.category;
    }
    if (filter.paymentType) {
      reqBody['paymentType'] = filter.paymentType;
    }
    return this._http.post(`${this.url}`, reqBody);
  }
}
