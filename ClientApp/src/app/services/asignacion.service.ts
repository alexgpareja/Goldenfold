import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface Asignacion {
  id: number;
  pacienteId: number;
  camaId: number;
  fechaAsignacion: Date;
  fechaLiberacion: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private apiUrl = `${environment.apiUrl}/api/asignaciones`;

  constructor(private http: HttpClient) { }

  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Asignacion[]>('getAsignaciones', []))
      );
  }

  getAsignacion(id: number): Observable<Asignacion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Asignacion>(url)
      .pipe(
        catchError(this.handleError<Asignacion>(`getAsignacion id=${id}`))
      );
  }

  createAsignacion(asignacion: Asignacion): Observable<Asignacion> {
    return this.http.post<Asignacion>(this.apiUrl, asignacion)
      .pipe(
        catchError(this.handleError<Asignacion>('createAsignacion'))
      );
  }

  updateAsignacion(id: number, asignacion: Asignacion): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, asignacion)
      .pipe(
        catchError(this.handleError<any>('updateAsignacion'))
      );
  }

  deleteAsignacion(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError<any>('deleteAsignacion'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
