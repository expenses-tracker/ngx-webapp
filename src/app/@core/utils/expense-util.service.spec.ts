import { TestBed } from '@angular/core/testing';

import { ExpenseUtilService } from './expense-util.service';

describe('ExpenseUtilService', () => {
  let service: ExpenseUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
