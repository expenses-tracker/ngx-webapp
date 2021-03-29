import { Component, OnInit, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaymentType } from 'app/@core/models/payment-type.model';
import { Category } from 'app/@core/models/category.model';
import { Expense } from 'app/@core/data/expense';
import { NbDialogRef } from '@nebular/theme';
import { SmartTableService } from 'app/@core/mock/smart-table.service';
import { ExpenseService } from 'app/@core/services/expense.service';
import { ToasterService, ToastType } from 'app/@core/services/toaster.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  expenseForm: FormGroup;
  paymentType$: Observable<PaymentType[]>;
  category$: Observable<Category[]>;
  saveInProgress = false;

  @Input() expenseData?: Expense;

  constructor(
    protected ref: NbDialogRef<ExpenseFormComponent>,
    private fb: FormBuilder,
    private smartTableService: SmartTableService,
    private expenseService: ExpenseService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit(): void {
    this.paymentType$ = this.smartTableService.getAllPaymentTypes();
    this.category$ = this.smartTableService.getAllCategories();
    this.expenseForm = this.fb.group({
      description: this.expenseData ? this.expenseData.description : '',
      dated: this.expenseData ? new Date(this.expenseData.dated) : '',
      amount: this.expenseData ? this.expenseData.amount : '',
      paymentType: this.expenseData ? this.expenseData.paymentType : '',
      category: this.expenseData ? this.expenseData.category : '',
      tag: this.expenseData ? this.expenseData.tag : '',
      subDescription: this.expenseData ? this.expenseData.subDescription : ''
    });
  }

  getAction() {
    if (this.expenseData) {
      return 'Update';
    }
    return 'Add';
  }

  onSubmit(expenseData) {
    this.saveInProgress = true;
    if (this.expenseData) {
      this.onUpdate(expenseData);
    } else {
      this.onAdd(expenseData);
    }
  }

  onAdd(expenseData) {
    this.expenseService.addExpense(expenseData as Expense)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      this.saveInProgress = false;
      this.expenseForm.reset();
      this.onSuccess();
    }, (err: any) => {
      this.saveInProgress = false;
      this.onFailure(JSON.stringify(err));
    });
  }

  onUpdate(expenseData) {
    const toUpdate: Expense = this.expenseData;
    toUpdate.description = expenseData.description;
    toUpdate.dated = expenseData.dated;
    toUpdate.paymentType = expenseData.paymentType;
    toUpdate.amount = expenseData.amount;
    toUpdate.category = expenseData.category;
    toUpdate.tag = expenseData.tag;
    toUpdate.subDescription = expenseData.subDescription;
    this.expenseService.updateExpense(toUpdate)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      this.saveInProgress = false;
      this.expenseForm.reset();
      this.onSuccess();
    }, (err: any) => {
      this.saveInProgress = false;
      this.onFailure(JSON.stringify(err));
    });
  }

  onSuccess() {
    this.toasterService.showToast(
      ToastType.SUCCESS, `Success`,
      `Expense saved successfully.`);
      this.dismiss();
  }

  onFailure(err: string) {
    this.toasterService.showToast(
      ToastType.DANGER, `Error`,
      `${err}`);
  }

  dismiss() {
    this.expenseService.notifyUpdates$(true);
    this.ref.close();
  }

}
