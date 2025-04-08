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
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private AUTH_HEADER = 'Authorization';
  constructor(private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
      })
    );
  }
}
