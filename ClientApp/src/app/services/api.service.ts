// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definición de la interfaz Paciente
export interface Paciente {
  idPaciente: number;
  nombre: string;
  edad: number;
  fechaNacimiento: Date;
  sintomas: string;
  estado: string;
  fechaRegistro: Date;
  seguridadSocial: string;
  direccion: string;
  telefono: string;
  email: string;
  historialMedico: string;
}

// Definición de la interfaz HistorialAlta
export interface HistorialAlta {
  idHistorial: number;
  idPaciente: number;
  fechaAlta: Date;
  diagnostico: string;
  tratamiento: string;
}

// Definición de la interfaz Rol
export interface Rol {
  idRol: number;
  nombreRol: string;
}

// Definición de la interfaz Asignacion
export interface Asignacion {
  idAsignacion: number;
  idPaciente: number;
  ubicacion: string;
  fechaAsignacion: Date;
  fechaLiberacion: Date;
  asignadoPor: number;
}

// Definición de la interfaz Habitación
export interface Habitacion {
  idHabitacion: number;
  edificio: string;
  planta: string;
  numeroHabitacion: string;
}

// Definición de la interfaz Cama
export interface Cama {
  ubicacion: string;
  estado: string;
  tipo: string;
}

// Definición de la interfaz Usuario
export interface Usuario {
  idUsuario: number;
  nombre: string;
  nombreUsuario: string;
  contrasenya: string;
  idRol: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5076/api'; 

  constructor(private http: HttpClient) { }

  // CRUD para Pacientes
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/Pacientes`);
  }

  getPacienteById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/Pacientes/${id}`);
  }

  getPacienteByName(name: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/Pacientes/byname/${name}`);
  }  

  addPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/Pacientes`, paciente);
  }

  updatePaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/Pacientes/${paciente.idPaciente}`, paciente);
  }

  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Pacientes/${id}`);
  }

  // CRUD para Asignaciones
  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.apiUrl}/Asignaciones`);
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

  deleteAsignacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Asignaciones/${id}`);
  }

  // CRUD para HistorialAltas
  getHistorialAltas(): Observable<HistorialAlta[]> {
    return this.http.get<HistorialAlta[]>(`${this.apiUrl}/HistorialAltas`);
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

  deleteHistorialAlta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/HistorialAltas/${id}`);
  }

  // CRUD para Usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/Usuarios`);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/Usuarios/${id}`);
  }

  getUsuarioByName(nombre: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/Usuarios/${nombre}`);
  }

  addUsuario(Usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/Usuarios`, Usuario);
  }

  updateUsuario(Usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/Usuarios/${Usuario.idUsuario}`, Usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Usuarios/${id}`);
  }

  // CRUD para Camas
  getCamas(): Observable<Cama[]> {
    return this.http.get<Cama[]>(`${this.apiUrl}/Camas`);
  }

  getCamaByUbi(ubicacion: string): Observable<Cama> {
    return this.http.get<Cama>(`${this.apiUrl}/Camas/${ubicacion}`);
  }

  addCama(cama: Cama): Observable<Cama> {
    return this.http.post<Cama>(`${this.apiUrl}/Camas`, cama);
  }

  updateCama(cama: Cama): Observable<Cama> {
    return this.http.put<Cama>(`${this.apiUrl}/Camas/${cama.ubicacion}`, cama);
  }

  deleteCama(ubicacion: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Camas/${ubicacion}`);
  }
  
  // CRUD para Roles
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/Roles`);
  }

  getRolById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/Roles/${id}`);
  }

  addRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/Roles`, rol);
  }

  updateRol(rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/Roles/${rol.idRol}`, rol);
  }

  deleteRol(idRol: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Roles/${idRol}`);
  }

  // CRUD para Habitaciones
  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.apiUrl}/Habitaciones`);
  }

  getHabitacionById(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.apiUrl}/Habitaciones/${id}`);
  }

  addHabitacion(Habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(`${this.apiUrl}/Habitaciones`, Habitacion);
  }

  updateHabitacion(Habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.apiUrl}/Habitaciones/${Habitacion.idHabitacion}`, Habitacion);
  }

  deleteHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Habitaciones/${id}`);
  }
}
