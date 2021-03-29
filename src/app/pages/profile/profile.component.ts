import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UserDetails } from 'app/@core/data/users';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  @Input() user$: Observable<UserDetails>;
  loading = true;

  constructor(protected ref: NbDialogRef<ProfileComponent>) { }

  ngOnInit(): void {
  }

  findDefaultCurrency(userInfo: UserDetails): string {
    this.loading = false;
    const defaultCurrency = userInfo.preferences.currency.find(x => x.isDefault);
    return defaultCurrency ? defaultCurrency.type : '';
  }

  dismiss() {
    this.ref.close();
  }

}
