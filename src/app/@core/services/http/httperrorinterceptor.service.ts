import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToasterService, ToastType } from '../toaster.service';

export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toast: ToasterService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
            this.toast.showToast(ToastType.DANGER, 'Application Error', errorMsg);
          } else {
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            this.toast.showToast(ToastType.DANGER, 'Service Error', errorMsg);
          }
          return throwError(errorMsg);
        })
      );
  }
}
