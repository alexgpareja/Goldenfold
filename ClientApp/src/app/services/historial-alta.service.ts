import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface HistorialAlta {
  id: number;
  pacienteId: number;
  fechaAlta: string;
  motivoAlta: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialAltaService {
  private apiUrl = `${environment.apiUrl}/api/historialAltas`;

  constructor(private http: HttpClient) { }

  getHistorialAltas(): Observable<HistorialAlta[]> {
    return this.http.get<HistorialAlta[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<HistorialAlta[]>('getHistorialAltas', []))
      );
  }

  getHistorialAlta(id: number): Observable<HistorialAlta> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<HistorialAlta>(url)
      .pipe(
        catchError(this.handleError<HistorialAlta>(`getHistorialAlta id=${id}`))
      );
  }

  createHistorialAlta(historialAlta: HistorialAlta): Observable<HistorialAlta> {
    return this.http.post<HistorialAlta>(this.apiUrl, historialAlta)
      .pipe(
        catchError(this.handleError<HistorialAlta>('createHistorialAlta'))
      );
  }

  updateHistorialAlta(id: number, historialAlta: HistorialAlta): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, historialAlta)
      .pipe(
        catchError(this.handleError<any>('updateHistorialAlta'))
      );
  }

  deleteHistorialAlta(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError<any>('deleteHistorialAlta'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
