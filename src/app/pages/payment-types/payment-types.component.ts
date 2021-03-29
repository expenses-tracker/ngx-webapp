import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SmartDataType, SmartTableData } from 'app/@core/data/smart-table';
import { ToasterService, ToastType } from 'app/@core/services/toaster.service';

@Component({
  selector: 'ngx-payment-types',
  templateUrl: './payment-types.component.html',
  styleUrls: ['./payment-types.component.scss']
})
export class PaymentTypesComponent implements OnInit {

  readonly dataType = SmartDataType.PAYMENT_TYPES;
  readonly settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      description: {
        title: 'Description',
        type: 'string'
      },
      type: {
        title: 'Type',
        type: 'string'
      },
      createdBy: {
        title: 'Created By',
        type: 'string',
        editable: false
      },
      createdOn: {
        title: 'Created On',
        type: 'Date',
        editable: false,
        valuePrepareFunction: (createdOn) => this.formatDate(createdOn)
      },
      updatedBy: {
        title: 'Updated By',
        type: 'string',
        editable: false
      },
      updatedOn: {
        title: 'Updated On',
        type: 'Date',
        editable: false,
        valuePrepareFunction: (updatedOn) => this.formatDate(updatedOn)
      }
    },
  };

  constructor(
    private _datePipe: DatePipe,
    private _smartTableDataservice: SmartTableData,
    private _toasterService: ToasterService) { }

  ngOnInit(): void {
  }

  private formatDate(dateObj) {
    if (!dateObj || dateObj === '') {
      return dateObj;
    }
    const raw = new Date(dateObj);
    const formatted = this._datePipe.transform(raw, 'dd MMM yyyy h:mm a');
    return formatted;
  }

  onAdd($event: any) {
    if (this.isEmpty($event.newData.type) || this.isEmpty($event.newData.description)) {
      this._toasterService.showToast(
        ToastType.DANGER, `Missing Field`,
        `Please fill both Payment Description and Type.`);
      $event.confirm.reject();
      return;
    }
    this._smartTableDataservice.addPaymentType($event.newData).subscribe((res) => {
      this._toasterService.showToast(ToastType.SUCCESS, `Success`, `Payment Type has been created successfully`);
      $event.confirm.resolve(res);
    }, (err) => {
      this._toasterService.showToast(ToastType.DANGER, `Error`, JSON.stringify(err));
      $event.confirm.reject();
    });
  }

  onEdit($event: any) {
    if (this.isEmpty($event.newData.type) || this.isEmpty($event.newData.description)) {
      this._toasterService.showToast(
        ToastType.DANGER, `Missing Field`,
        `Please fill both Payment Description and Type.`);
      $event.confirm.reject();
      return;
    }
    this._smartTableDataservice.editPaymentType($event.newData).subscribe((res) => {
      this._toasterService.showToast(ToastType.SUCCESS, `Success`, `Payment Type has been updated successfully`);
      $event.confirm.resolve(res);
    }, (err) => {
      this._toasterService.showToast(ToastType.DANGER, `Error`, JSON.stringify(err));
      $event.confirm.reject();
    });
  }

  onDelete($event: any) {
    this._smartTableDataservice.deletePaymentType($event.data).subscribe((res) => {
      this._toasterService.showToast(ToastType.SUCCESS, `Success`, `Payment Type has been deleted successfully`);
      $event.confirm.resolve();
    }, (err) => {
      this._toasterService.showToast(ToastType.DANGER, `Error`, JSON.stringify(err));
      $event.confirm.reject();
    });
  }

  private isEmpty(data: string) {
    return data.length === 0 || data === undefined || data === null || !data;
  }

}
