import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private AUTH_HEADER = 'Authorization';
  private activeRequests = 0;

  constructor(private router: Router, private loader: LoaderService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.loader.show();
    }
    this.activeRequests++;

    const token = localStorage.getItem('token') || '';
    request = request.clone({
      headers: request.headers
        .set('Content-Type', 'application/json')
        .set(this.AUTH_HEADER, `Bearer ${token}`),
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.router.navigate(['/login']);
        }
        return throwError(error);
      }),
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.loader.hide();
        }
      })
    );
  }
}
