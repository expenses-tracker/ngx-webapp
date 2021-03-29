import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Expense } from 'app/@core/data/expense';
import { Income } from 'app/@core/data/income';
import { DialogNamePromptComponent } from 'app/pages/modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';

@Component({
  selector: 'ngx-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {

  @Input() isDashboard: boolean;
  @Input() transactions: Income[] | Expense[];

  @Output() edit = new EventEmitter<Income | Expense>();
  @Output() delete = new EventEmitter<Income | Expense>();

  constructor(private dialogService: NbDialogService) { }

  ngOnInit(): void {
  }

  onEdit(selected: Income | Expense) {
    this.edit.emit(selected);
  }

  onDelete(selected: Income | Expense) {
    this.dialogService.open(DialogNamePromptComponent, {context: { confirmText: 'Confirm' }})
      .onClose.subscribe(name => {
        if (name === 'Cancel') {
          // Do nothing
        } else if (name === 'Confirm') {
          this.delete.emit(selected);
        } else {
          this.dialogService.open(DialogNamePromptComponent, {context: { message: 'NO_MATCH' }});
        }
      });
  }

}
