import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, timeout, TimeoutError } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';
  private requestTimeout = 7000;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';

    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json',
    });
  }

  private handleError(action: string) {
    return (error: unknown) => {
      let message = `${action} failed. Please try again.`;

      if (error instanceof TimeoutError) {
        message = `${action} failed because the request timed out. Please check whether the backend is running.`;
      } else if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          message = `${action} failed. Cannot connect to backend. Please check backend server and CORS setting.`;
        } else if (error.status === 400) {
          message = `${action} failed. Please check the form fields.`;
        } else if (error.status === 401) {
          message = `${action} failed. Username or password is incorrect.`;
        } else if (error.status === 403) {
          message = `${action} failed. Admin access is required for this action.`;
        } else if (error.status === 404) {
          message = `${action} failed. The selected item was not found.`;
        } else if (error.status >= 500) {
          message = `${action} failed. Backend server error occurred.`;
        }
      }

      return throwError(() => new Error(message));
    };
  }

  // GET remains open, no Basic Auth header.
  getBooks(page: number = 0, size: number = 5): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}?page=${page}&size=${size}`)
      .pipe(timeout(this.requestTimeout), catchError(this.handleError('Load books')));
  }

  // GET remains open, no Basic Auth header.
  searchBooks(keyword: string, page: number = 0, size: number = 5): Observable<any> {
    const encodedKeyword = encodeURIComponent(keyword.trim());

    return this.http
      .get<any>(`${this.apiUrl}?q=${encodedKeyword}&page=${page}&size=${size}`)
      .pipe(timeout(this.requestTimeout), catchError(this.handleError('Search books')));
  }

  // POST requires Basic Auth.
  addBook(book: Book): Observable<Book> {
    return this.http
      .post<Book>(this.apiUrl, book, { headers: this.getHeaders() })
      .pipe(timeout(this.requestTimeout), catchError(this.handleError('Add book')));
  }

  // PUT requires ADMIN Basic Auth.
  updateBook(id: number, book: Book): Observable<Book> {
    return this.http
      .put<Book>(`${this.apiUrl}/${id}`, book, { headers: this.getHeaders() })
      .pipe(timeout(this.requestTimeout), catchError(this.handleError('Update book')));
  }

  // DELETE requires ADMIN Basic Auth.
  deleteBook(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(timeout(this.requestTimeout), catchError(this.handleError('Delete book')));
  }
}
