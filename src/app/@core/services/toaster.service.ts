import { Injectable } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';

export enum ToastType {
  PRIMARY = 'primary',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private _toastrService: NbToastrService) { }

  showToast(type: ToastType, title: string, content: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 2000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    const titleContent = title ? `${title}` : '';

    this._toastrService.show(
      content,
      `${titleContent}`,
      config);
  }
}
