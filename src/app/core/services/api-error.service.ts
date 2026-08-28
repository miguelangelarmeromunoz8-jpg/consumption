import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  getMessage(err: unknown, fallback = 'Ocurrió un error inesperado.'): string {
    if (err instanceof HttpErrorResponse) {
      const apiError = (err.error as any)?.error;
      if (apiError?.fields?.length) {
        return apiError.fields
          .map((f: { message: string }) => f.message)
          .join(' ');
      }
      if (apiError?.message) {
        return apiError.message;
      }
    }
    return fallback;
  }
}
