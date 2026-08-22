import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error) => {
        const isTokenExpired =
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          error.error?.error?.code === 'TOKEN_EXPIRED';

        const alreadyRetried = req.headers.has('X-Retry');

        if (isTokenExpired && !req.url.includes('/auth/') && !alreadyRetried) {
          return this.handle401(req, next);
        }

        if (isTokenExpired && alreadyRetried) {
          // Ya reintentamos una vez y sigue fallando: cerramos sesión, sin loop.
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.accessToken);
          return next.handle(this.addToken(req, res.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(req, token as string)))
    );
  }

  private addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Retry': 'true',
      },
    });
  }
}