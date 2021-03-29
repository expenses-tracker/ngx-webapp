import { Component, OnInit } from '@angular/core';
import { SmartDataType, SmartTableData } from 'app/@core/data/smart-table';
import { DatePipe } from '@angular/common';
import { ToastType, ToasterService } from 'app/@core/services/toaster.service';

@Component({
  selector: 'ngx-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  readonly dataType = SmartDataType.CATEGORIES;
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
    if (this.isEmpty($event.newData.description)) {
      this._toasterService.showToast(ToastType.DANGER, `Missing Field`, `Please fill the mandatory category Description.`);
      $event.confirm.reject();
      return;
    }
    this._smartTableDataservice.addCategory($event.newData).subscribe((res) => {
      this._toasterService.showToast(ToastType.SUCCESS, `Success`, `Category has been created successfully`);
      $event.confirm.resolve(res);
    }, (err) => {
      this._toasterService.showToast(ToastType.DANGER, `Error`, JSON.stringify(err));
      $event.confirm.reject();
    });
  }

  onEdit($event: any) {
    if (this.isEmpty($event.newData.description)) {
      this._toasterService.showToast(ToastType.DANGER, `Missing Field`, `Please fill the mandatory category Description.`);
      $event.confirm.reject();
      return;
    }
    this._smartTableDataservice.editCategory($event.newData).subscribe((res) => {
      this._toasterService.showToast(ToastType.SUCCESS, `Success`, `Category has been updated successfully`);
      $event.confirm.resolve(res);
    }, (err) => {
      this._toasterService.showToast(ToastType.DANGER, `Error`, JSON.stringify(err));
      $event.confirm.reject();
    });
  }

  onDelete($event: any) {
    this._smartTableDataservice.deleteCategory($event.data).subscribe((res) => {
      this._toasterService.showToast(ToastType.SUCCESS, `Success`, `Category has been deleted successfully`);
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
