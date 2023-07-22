import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ODataResult } from '../models';
import { IrsNotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class IrsHttpService {

  private apiUrl: string;
  private odataUrl: string;

  constructor(private http: HttpClient, private notificationService: IrsNotificationService, private router: Router) {
    this.apiUrl = environment.apiUrl;
    this.odataUrl = environment.odataUrl;
  }

  get<T>(resourceUrl: string, resourceId?: number) {
    if (resourceId) {
      resourceUrl = `${resourceUrl}/${resourceId}`;
    }
    return this.http.get<T>(`${this.apiUrl}${resourceUrl}`)
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
  }

  post<T>(resourceUrl: string, model: any) {
    return this.http.post<T>(`${this.apiUrl}${resourceUrl}`, model)
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
  }

  put<T>(resourceUrl: string, id: number, model: any) {
    return this.http.put<T>(`${this.apiUrl}${resourceUrl}/${id}`, model)
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
  }

  patch<T>(resourceUrl: string, id: number, model: Partial<any>) {
    return this.http.patch<T>(`${this.apiUrl}${resourceUrl}/${id}`, model)
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
  }

  getPage(resourceUrl: string) {
    const response = this.http.get(`${this.apiUrl}${resourceUrl}`, { observe: 'response' })
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
    return response;
    // return response.map(map(x => ({ items: x.body, total_count: x.headers.get('X-Total-Count') })));
  }

  getOdata<T>(resourceUrl: string, resourceId?: number): Observable<ODataResult<T>> {
    if (resourceId) {
      resourceUrl = `${resourceUrl}/${resourceId}`;
    }
    return this.http.get<ODataResult<T>>(`${this.odataUrl}${resourceUrl}`)
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
  }

  getSingleOdata<T>(resourceUrl: string, resourceId?: number): Observable<T> {
    if (resourceId) {
      resourceUrl = `${resourceUrl}/${resourceId}`;
    }
    return this.http.get<T>(`${this.odataUrl}${resourceUrl}`)
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
  }

  saveOdata<T>(resourceUrl: string, form: any, id?: number): Observable<T> {
    let response;
    if (form.id > 0 || id) {
      const formId = id || form.id;
      response = this.http.patch(`${this.odataUrl}${resourceUrl}/${formId}`, form, { headers: { 'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=false' } })
        .pipe(catchError((err, caught) => this.handleError(err, caught)));
    } else {
      response = this.http.post<T>(`${this.odataUrl}${resourceUrl}`, form, { headers: { 'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=false;' } })
        .pipe(catchError((err, caught) => this.handleError(err, caught)));
    }
    return response;
  }

  postOdata<T>(resourceUrl: string, form: any): Observable<T> {
    let response;
    response = this.http.post<T>(`${this.odataUrl}${resourceUrl}`, form, { headers: { 'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=false' } })
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
    return response;
  }

  patchOdata<T>(resourceUrl: string, form: any, id?: number) {
    const formId = id || form.id;
    const response = this.http.patch<T>(`${this.odataUrl}${resourceUrl}/${formId}`, form)
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
    return response;
  }

  deleteOdata(resourceUrl: string, id: number): Observable<any> {
    let response;
    response = this.http.delete(`${this.odataUrl}${resourceUrl}/${id}`)
      .pipe(catchError((err, caught) => this.handleError(err, caught)));
    return response;
  }

  private handleError<T>(error: HttpErrorResponse, caught: Observable<T>): Observable<T> {
    if (environment.production === false) {
      console.warn(error);
      console.warn(caught);
    }

    if (error.status === 400) {
      // bad request
      const errorMessage = this.getMessageToDisplay(error.error, '');
      this.notificationService.notifyBadRequest(errorMessage, error.statusText);
    } else if (error.status === 404) {
      // not found
      this.notificationService.notifyBadRoute(undefined, error.statusText);
    } else if (error.status === 401) {
      // Unauthorized
      if (error.headers.has('Refresh-Token-Required')) {
        this.http.get(
          `${this.apiUrl}Account/Refresh?token=${localStorage.getItem('token')}&refreshToken=${localStorage.getItem('refresh_token')}`
        ).subscribe(x => {
          if (x) {
            this.notificationService.notifyBadRequest('Please try again', 'Access token refreshed.');
            console.log(x);
          }
        });
      } else {
        this.notificationService.notifyBadRequest('User is not Authorized to acces this resource.', error.statusText);
        this.router.navigateByUrl('');
      }
      // return of<T>(null);

    } else if (error.status === 0) {
      // Bad Gateway or Server Error. 500+ error
      this.notificationService.notifyBadRoute('Please try again later!', error.statusText);
    } else {
      console.warn('handle this error in Http Service');
      console.warn(error);
    }
    throw error;
  }

  private getMessageToDisplay(error: any, extactedMessage: string): string {
    if (!error) {
      return '';
    }
    if (typeof error === 'string') {
      return error;
    } else if (Array.isArray(error)) {
      error.forEach(x => (extactedMessage += this.getMessageToDisplay(x, extactedMessage)));
      return extactedMessage;
    } else {
      Object.keys(error).forEach(x => extactedMessage += this.getMessageToDisplay(error[x], extactedMessage));
      return extactedMessage;
    }
  }

}
