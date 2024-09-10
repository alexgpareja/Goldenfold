import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definición de las interfaces de las tablas
export interface Paciente {
  IdPaciente: number;
  Nombre: string;
  Edad: number;
  FechaNacimiento: Date;
  Sintomas: string;
  Estado: string;
  FechaRegistro: Date;
  SeguridadSocial: string;
  Direccion: string;
  Telefono: string;
  Email: string;
  HistorialMedico: string;
}

export interface Consulta {
  IdConsulta: number;
  IdPaciente: number;
  IdMedico: number;
  Motivo: string;
  FechaSolicitud: Date;
  FechaConsulta: Date;
  Estado: string;
}

export interface Ingreso {
  IdIngreso: number;
  IdPaciente: number;
  IdMedico: number;
  Motivo: string;
  FechaSolicitud: Date;
  Estado: string;
  IdAsignacion: number;
}

export interface HistorialAlta {
  IdHistorial: number;
  IdPaciente: number;
  FechaAlta: Date;
  Diagnostico: string;
  Tratamiento: string;
}

export interface Asignacion {
  IdAsignacion: number;
  IdPaciente: number;
  Ubicacion: string;
  FechaAsignacion: Date;
  FechaLiberacion: Date;
  AsignadoPor: number;
}

export interface Usuario {
  IdUsuario: number;
  Nombre: string;
  NombreUsuario: string;
  Contrasenya: string;
  IdRol: number;
}

export interface Cama {
  Ubicacion: string;
  Estado: string;
  Tipo: string;
}

export interface Habitacion {
  IdHabitacion: number;
  Edificio: string;
  Planta: string;
  NumeroHabitacion: string;
}

export interface Rol {
  IdRol: number;
  NombreRol: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5076/api';

  constructor(private http: HttpClient) {}

  // CRUD para Pacientes con parámetros
  getPacientes(nombre?: string, numSS?: string): Observable<Paciente[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (numSS) params = params.set('numSS', numSS);
    return this.http.get<Paciente[]>(`${this.apiUrl}/Pacientes`, { params });
  }

  addPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/Pacientes`, paciente);
  }

  updatePaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/Pacientes/${paciente.IdPaciente}`, paciente);
  }

  deletePaciente(id?: number, nombre?: string): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    if (nombre) params = params.set('nombre', nombre);
    return this.http.delete<void>(`${this.apiUrl}/Pacientes`, { params });
  }

  // CRUD para Consultas
  getConsultas(idPaciente?: number, idMedico?: number, estado?: string): Observable<Consulta[]> {
    let params = new HttpParams();
    if (idPaciente) params = params.set('idPaciente', idPaciente.toString());
    if (idMedico) params = params.set('idMedico', idMedico.toString());
    if (estado) params = params.set('estado', estado);
    return this.http.get<Consulta[]>(`${this.apiUrl}/Consultas`, { params });
  }

  // Obtener pacientes con consultas pendientes de ingreso
  getPacientesPendientesIngreso(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/Consultas/pendientes-ingreso`);
  }

  addConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.apiUrl}/Consultas`, consulta);
  }

  updateConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.apiUrl}/Consultas/${consulta.IdConsulta}`, consulta);
  }

  deleteConsulta(id?: number, estado?: string): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    if (estado) params = params.set('estado', estado);
    return this.http.delete<void>(`${this.apiUrl}/Consultas`, { params });
  }

  // CRUD para Ingresos
  getIngresos(idPaciente?: number, idMedico?: number, estado?: string): Observable<Ingreso[]> {
    let params = new HttpParams();
    if (idPaciente) params = params.set('idPaciente', idPaciente.toString());
    if (idMedico) params = params.set('idMedico', idMedico.toString());
    if (estado) params = params.set('estado', estado);
    return this.http.get<Ingreso[]>(`${this.apiUrl}/Ingresos`, { params });
  }

  addIngreso(ingreso: Ingreso): Observable<Ingreso> {
    return this.http.post<Ingreso>(`${this.apiUrl}/Ingresos`, ingreso);
  }

  updateIngreso(ingreso: Ingreso): Observable<Ingreso> {
    return this.http.put<Ingreso>(`${this.apiUrl}/Ingresos/${ingreso.IdIngreso}`, ingreso);
  }

  deleteIngreso(id?: number, estado?: string): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    if (estado) params = params.set('estado', estado);
    return this.http.delete<void>(`${this.apiUrl}/Ingresos`, { params });
  }

  // CRUD para Asignaciones con parámetros
  getAsignaciones(idPaciente?: number): Observable<Asignacion[]> {
    let params = new HttpParams();
    if (idPaciente) params = params.set('idPaciente', idPaciente.toString());
    return this.http.get<Asignacion[]>(`${this.apiUrl}/Asignaciones`, { params });
  }

  addAsignacion(asignacion: Asignacion): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.apiUrl}/Asignaciones`, asignacion);
  }

  updateAsignacion(asignacion: Asignacion): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.apiUrl}/Asignaciones/${asignacion.IdAsignacion}`, asignacion);
  }

  deleteAsignacion(id?: number): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/Asignaciones`, { params });
  }

  // CRUD para HistorialAltas
  getHistorialAltas(idPaciente?: number): Observable<HistorialAlta[]> {
    let params = new HttpParams();
    if (idPaciente) params = params.set('idPaciente', idPaciente.toString());
    return this.http.get<HistorialAlta[]>(`${this.apiUrl}/HistorialAltas`, { params });
  }

  addHistorialAlta(historialAlta: HistorialAlta): Observable<HistorialAlta> {
    return this.http.post<HistorialAlta>(`${this.apiUrl}/HistorialAltas`, historialAlta);
  }

  updateHistorialAlta(historialAlta: HistorialAlta): Observable<HistorialAlta> {
    return this.http.put<HistorialAlta>(`${this.apiUrl}/HistorialAltas/${historialAlta.IdHistorial}`, historialAlta);
  }

  deleteHistorialAlta(id?: number): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/HistorialAltas`, { params });
  }

  // CRUD para Usuarios
  getUsuarios(nombre?: string): Observable<Usuario[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    return this.http.get<Usuario[]>(`${this.apiUrl}/Usuarios`, { params });
  }

  addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/Usuarios`, usuario);
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/Usuarios/${usuario.IdUsuario}`, usuario);
  }

  deleteUsuario(id?: number, nombre?: string): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    if (nombre) params = params.set('nombre', nombre);
    return this.http.delete<void>(`${this.apiUrl}/Usuarios`, { params });
  }

  // CRUD para Camas
  getCamas(ubicacion?: string, estado?: string): Observable<Cama[]> {
    let params = new HttpParams();
    if (ubicacion) params = params.set('ubicacion', ubicacion);
    if (estado) params = params.set('estado', estado);
    return this.http.get<Cama[]>(`${this.apiUrl}/Camas`, { params });
  }

  addCama(cama: Cama): Observable<Cama> {
    return this.http.post<Cama>(`${this.apiUrl}/Camas`, cama);
  }

  updateCama(cama: Cama): Observable<Cama> {
    return this.http.put<Cama>(`${this.apiUrl}/Camas/${cama.Ubicacion}`, cama);
  }

  deleteCama(ubicacion?: string): Observable<void> {
    let params = new HttpParams();
    if (ubicacion) params = params.set('ubicacion', ubicacion);
    return this.http.delete<void>(`${this.apiUrl}/Camas`, { params });
  }

  // CRUD para Habitaciones
  getHabitaciones(id?: number, edificio?: string): Observable<Habitacion[]> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    if (edificio) params = params.set('edificio', edificio);
    return this.http.get<Habitacion[]>(`${this.apiUrl}/Habitaciones`, { params });
  }

  addHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(`${this.apiUrl}/Habitaciones`, habitacion);
  }

  updateHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.apiUrl}/Habitaciones/${habitacion.IdHabitacion}`, habitacion);
  }

  deleteHabitacion(id?: number): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/Habitaciones`, { params });
  }

  // CRUD para Roles
  getRoles(nombre?: string): Observable<Rol[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    return this.http.get<Rol[]>(`${this.apiUrl}/Roles`, { params });
  }

  addRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/Roles`, rol);
  }

  updateRol(rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/Roles/${rol.IdRol}`, rol);
  }

  deleteRol(id?: number): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/Roles`, { params });
  }
}
