import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface Cama {
  id: number;
  numero: string;
  habitacionId: number;
  estado: string; // Ejemplo: "ocupada", "disponible"
}

@Injectable({
  providedIn: 'root'
})
export class CamaService {
  private apiUrl = `${environment.apiUrl}/api/camas`;

  constructor(private http: HttpClient) { }

  getCamas(): Observable<Cama[]> {
    return this.http.get<Cama[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Cama[]>('getCamas', []))
      );
  }

  getCama(id: number): Observable<Cama> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Cama>(url)
      .pipe(
        catchError(this.handleError<Cama>(`getCama id=${id}`))
      );
  }

  createCama(cama: Cama): Observable<Cama> {
    return this.http.post<Cama>(this.apiUrl, cama)
      .pipe(
        catchError(this.handleError<Cama>('createCama'))
      );
  }

  updateCama(id: number, cama: Cama): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, cama)
      .pipe(
        catchError(this.handleError<any>('updateCama'))
      );
  }

  deleteCama(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError<any>('deleteCama'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
