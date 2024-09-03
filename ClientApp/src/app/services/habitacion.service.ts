import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Habitacion {
  id: number;
  numero: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private apiUrl = `${environment.apiUrl}/api/habitaciones`;

  constructor(private http: HttpClient) { }

  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Habitacion[]>('getHabitaciones', []))
      );
  }

  getHabitacion(id: number): Observable<Habitacion> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Habitacion>(url)
      .pipe(
        catchError(this.handleError<Habitacion>(`getHabitacion id=${id}`))
      );
  }

  createHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.apiUrl, habitacion)
      .pipe(
        catchError(this.handleError<Habitacion>('createHabitacion'))
      );
  }

  updateHabitacion(id: number, habitacion: Habitacion): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, habitacion)
      .pipe(
        catchError(this.handleError<any>('updateHabitacion'))
      );
  }

  deleteHabitacion(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError<any>('deleteHabitacion'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
