import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Rol {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = `${environment.apiUrl}/api/roles`;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Rol[]>('getRoles', []))
      );
  }

  getRol(id: number): Observable<Rol> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Rol>(url)
      .pipe(
        catchError(this.handleError<Rol>(`getRol id=${id}`))
      );
  }

  createRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol)
      .pipe(
        catchError(this.handleError<Rol>('createRol'))
      );
  }

  updateRol(id: number, rol: Rol): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, rol)
      .pipe(
        catchError(this.handleError<any>('updateRol'))
      );
  }

  deleteRol(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError<any>('deleteRol'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
