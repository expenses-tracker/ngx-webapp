import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData, SmartDataType } from '../../../@core/data/smart-table';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { DialogNamePromptComponent } from 'app/pages/modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements OnInit {

  @Input() dataType: SmartDataType;
  @Input() settings: any;

  @Output() onAdd: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  dataSource$: Observable<any[]>;

  defaultSettings: any = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, private dialogService: NbDialogService) {
  }

  ngOnInit() {
    if (!this.settings) {
      this.settings = this.defaultSettings;
    }
    this.dataSource$ = this.service.getData(this.dataType).pipe(tap((res) => this.source.load(res)));
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(DialogNamePromptComponent, {context: { confirmText: event.data.description }})
      .onClose.subscribe(name => {
        if (name === 'Cancel') {
          // Do nothing
        } else if (name === event.data.description) {
          event.confirm.resolve();
          this.onDelete.emit(event);
        } else {
          this.dialogService.open(DialogNamePromptComponent, {context: { message: 'NO_MATCH' }});
          event.confirm.reject();
        }
      });
  }
}
