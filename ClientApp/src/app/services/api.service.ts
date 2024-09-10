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
  idConsulta: number;
  idPaciente: number;
  idMedico: number;
  motivo: string;
  fechaSolicitud: Date;
  fechaConsulta: Date;
  estado: string;
}

export interface Ingreso {
  idIngreso: number;
  idPaciente: number;
  idMedico: number;
  motivo: string;
  fechaSolicitud: Date;
  estado: string;
  idAsignacion: number;
}

export interface HistorialAlta {
  idHistorial: number;
  idPaciente: number;
  fechaAlta: Date;
  diagnostico: string;
  tratamiento: string;
}

export interface Asignacion {
  idAsignacion: number;
  idPaciente: number;
  ubicacion: string;
  fechaAsignacion: Date;
  fechaLiberacion: Date;
  asignadoPor: number;
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  nombreUsuario: string;
  contrasenya: string;
  idRol: number;
}

export interface Cama {
  ubicacion: string;
  estado: string;
  tipo: string;
}

export interface Habitacion {
  idHabitacion: number;
  edificio: string;
  planta: string;
  numeroHabitacion: string;
}

export interface Rol {
  idRol: number;
  nombreRol: string;
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

  getConsultaById(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.apiUrl}/Consultas/${id}`);
  }

  addConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.apiUrl}/Consultas`, consulta);
  }

  updateConsulta(consulta: Consulta): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.apiUrl}/Consultas/${consulta.idConsulta}`, consulta);
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

  getIngresoById(id: number): Observable<Ingreso> {
    return this.http.get<Ingreso>(`${this.apiUrl}/Ingresos/${id}`);
  }

  addIngreso(ingreso: Ingreso): Observable<Ingreso> {
    return this.http.post<Ingreso>(`${this.apiUrl}/Ingresos`, ingreso);
  }

  updateIngreso(ingreso: Ingreso): Observable<Ingreso> {
    return this.http.put<Ingreso>(`${this.apiUrl}/Ingresos/${ingreso.idIngreso}`, ingreso);
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

  getAsignacionById(id: number): Observable<Asignacion> {
    return this.http.get<Asignacion>(`${this.apiUrl}/Asignaciones/${id}`);
  }

  addAsignacion(asignacion: Asignacion): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.apiUrl}/Asignaciones`, asignacion);
  }

  updateAsignacion(asignacion: Asignacion): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.apiUrl}/Asignaciones/${asignacion.idAsignacion}`, asignacion);
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

  getHistorialAltaById(id: number): Observable<HistorialAlta> {
    return this.http.get<HistorialAlta>(`${this.apiUrl}/HistorialAltas/${id}`);
  }

  addHistorialAlta(historialAlta: HistorialAlta): Observable<HistorialAlta> {
    return this.http.post<HistorialAlta>(`${this.apiUrl}/HistorialAltas`, historialAlta);
  }

  updateHistorialAlta(historialAlta: HistorialAlta): Observable<HistorialAlta> {
    return this.http.put<HistorialAlta>(`${this.apiUrl}/HistorialAltas/${historialAlta.idHistorial}`, historialAlta);
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

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/Usuarios/${id}`);
  }

  addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/Usuarios`, usuario);
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/Usuarios/${usuario.idUsuario}`, usuario);
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
    return this.http.put<Cama>(`${this.apiUrl}/Camas/${cama.ubicacion}`, cama);
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
    return this.http.put<Habitacion>(`${this.apiUrl}/Habitaciones/${habitacion.idHabitacion}`, habitacion);
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
    return this.http.put<Rol>(`${this.apiUrl}/Roles/${rol.idRol}`, rol);
  }

  deleteRol(id?: number): Observable<void> {
    let params = new HttpParams();
    if (id) params = params.set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/Roles`, { params });
  }
}
