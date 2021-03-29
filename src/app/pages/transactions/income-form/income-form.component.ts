import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SmartTableService } from 'app/@core/mock/smart-table.service';
import { Observable, Subject } from 'rxjs';
import { PaymentType } from 'app/@core/models/payment-type.model';
import { IncomeService } from 'app/@core/services/income.service';
import { ToasterService, ToastType } from 'app/@core/services/toaster.service';
import { Income } from 'app/@core/data/income';
import { takeUntil } from 'rxjs/operators';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-income-form',
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss']
})
export class IncomeFormComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  incomeForm: FormGroup;
  paymentType$: Observable<PaymentType[]>;
  saveInProgress = false;

  @Input() incomeData?: Income;

  constructor(
    protected ref: NbDialogRef<IncomeFormComponent>,
    private fb: FormBuilder,
    private smartTableService: SmartTableService,
    private incomeService: IncomeService,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.paymentType$ = this.smartTableService.getAllPaymentTypes();
    this.incomeForm = this.fb.group({
      description: this.incomeData ? this.incomeData.description : '',
      dated: this.incomeData ? new Date(this.incomeData.dated) : '',
      amount: this.incomeData ? this.incomeData.amount : '',
      paymentType: this.incomeData ? this.incomeData.paymentType : '',
      tag: this.incomeData ? this.incomeData.tag : '',
      subDescription: this.incomeData ? this.incomeData.subDescription : ''
    });
  }

  getAction() {
    if (this.incomeData) {
      return 'Update';
    }
    return 'Add';
  }

  onSubmit(incomeData) {
    this.saveInProgress = true;
    if (this.incomeData) {
      this.onUpdate(incomeData);
    } else {
      this.onAdd(incomeData);
    }
  }

  onAdd(incomeData) {
    this.incomeService.addIncome(incomeData as Income)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      this.saveInProgress = false;
      this.incomeForm.reset();
      this.onSuccess();
    }, (err: any) => {
      this.saveInProgress = false;
      this.onFailure(JSON.stringify(err));
    });
  }

  onUpdate(incomeData) {
    const toUpdate: Income = this.incomeData;
    toUpdate.description = incomeData.description;
    toUpdate.dated = incomeData.dated;
    toUpdate.paymentType = incomeData.paymentType;
    toUpdate.amount = incomeData.amount;
    toUpdate.tag = incomeData.tag;
    toUpdate.subDescription = incomeData.subDescription;
    this.incomeService.updateIncome(toUpdate)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      this.saveInProgress = false;
      this.incomeForm.reset();
      this.onSuccess();
    }, (err: any) => {
      this.saveInProgress = false;
      this.onFailure(JSON.stringify(err));
    });
  }

  onSuccess() {
    this.toasterService.showToast(
      ToastType.SUCCESS, `Success`,
      `Income saved successfully.`);
      this.dismiss();
  }

  onFailure(err: string) {
    this.toasterService.showToast(
      ToastType.DANGER, `Error`,
      `${err}`);
  }

  dismiss() {
    this.incomeService.notifyUpdates$(true);
    this.ref.close();
  }

}
