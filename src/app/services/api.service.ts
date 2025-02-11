import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { ApiResponse } from '../models/idea.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API_TIMEOUT = 30000;
  private BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public verifyUsername(username: string): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.BASE_URL}/api/verify-username`, {
        username,
      })
      .pipe(timeout(this.API_TIMEOUT), retry(2), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
