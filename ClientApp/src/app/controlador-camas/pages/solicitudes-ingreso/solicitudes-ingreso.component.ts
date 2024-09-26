import { Component, OnInit } from '@angular/core';
import { ApiService, Ingreso, HistorialAlta, Cama } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-solicitudes-ingreso',
  templateUrl: './solicitudes-ingreso.component.html',
  styleUrls: ['./solicitudes-ingreso.component.css']
})
export class SolicitudesIngresoComponent implements OnInit {
  solicitudesPendientes: Ingreso[] = [];
  errorMensaje: string | null = null;
  solicitudSeleccionada: Ingreso | null = null;
  formularioSeleccionado: 'alta' | 'seleccionarCama' | null = null;
  camasDisponibles: Cama[] = [];
  camaSeleccionada: number | null = null;

  // Datos del formulario "Dar de Alta"
  diagnostico: string = '';
  tratamiento: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.obtenerSolicitudesPendientes();
  }

  obtenerSolicitudesPendientes() {
    this.apiService.getIngresos(undefined, undefined, 'Pendiente').subscribe({
      next: (solicitudes: Ingreso[]) => {
        if (solicitudes.length > 0) {
          this.solicitudesPendientes = solicitudes;
          this.errorMensaje = null; // Limpiar mensaje de error si hay solicitudes
        } else {
          this.solicitudesPendientes = [];
          this.errorMensaje = 'No hay solicitudes de ingreso pendientes.'; // Mostrar mensaje si no hay solicitudes
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMensaje = 'No hay solicitudes de ingreso pendientes.';
        } else {
          this.errorMensaje = 'Error al cargar las solicitudes de ingreso. Por favor, inténtalo de nuevo.';
        }
        this.solicitudesPendientes = [];
      }
    });
  }

  // Seleccionar una solicitud para realizar acciones
  addAsignacion(solicitud: Ingreso) {
    this.solicitudSeleccionada = solicitud;
    this.formularioSeleccionado = 'seleccionarCama'; // Mostrar el formulario para asignar cama
    this.obtenerCamasDisponibles(); // Llamar a la API para obtener las camas disponibles
  }

  // Mostrar el formulario de "Dar de Alta" o "Seleccionar Cama"
  mostrarFormulario(tipo: 'alta' | 'seleccionarCama') {
    this.formularioSeleccionado = tipo;
  }

  // Dar de alta al paciente
  darDeAlta() {
    if (!this.solicitudSeleccionada) {
      console.error('No hay solicitud seleccionada');
      return;
    }

    // Crear el objeto de historial de alta
    const historialAlta: HistorialAlta = {
      IdHistorial: 0,
      IdPaciente: this.solicitudSeleccionada.IdPaciente, 
      IdMedico: this.solicitudSeleccionada.IdMedico,
      Diagnostico: this.diagnostico,
      Tratamiento: this.tratamiento,
      FechaAlta: new Date()
    };

    // Crear historial de alta y actualizar el estado de la solicitud
    this.apiService.addHistorialAlta(historialAlta).subscribe({
      next: (response) => {
        console.log('Paciente dado de alta correctamente:', response);
        window.alert('Paciente dado de alta correctamente');
        this.resetFormulario();
        this.obtenerSolicitudesPendientes();
      },
      error: (err) => {
        console.error('Error al dar de alta al paciente:', err);
        window.alert('Hubo un error al dar de alta al paciente.');
      }
    });
  }

  // Obtener las camas disponibles para la asignación
  obtenerCamasDisponibles() {
    this.apiService.getCamas().subscribe({
      next: (camas: Cama[]) => {
        this.camasDisponibles = camas.filter(cama => cama.Estado === 'Disponible');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener las camas disponibles:', error);
      }
    });
  }

  // Confirmar la asignación de una cama
  confirmarCama() {
    if (!this.solicitudSeleccionada || !this.camaSeleccionada) {
      console.error('No hay solicitud o cama seleccionada');
      return;
    }

    this.apiService.addAsignacion({
      IdAsignacion: 0,
      IdPaciente: this.solicitudSeleccionada!.IdPaciente,
      IdCama: this.camaSeleccionada!, 
      FechaAsignacion: new Date(),  
      FechaLiberacion: null,
      AsignadoPor: 7 
    }).subscribe({
      next: (response) => {
        console.log('Cama asignada correctamente:', response);
        window.alert('Cama asignada correctamente');
        this.resetFormulario();
        this.obtenerSolicitudesPendientes();  
      },
      error: (err) => {
        console.error('Error al asignar la cama:', err);
        window.alert('Hubo un error al asignar la cama.');
      }
    });
    
  }

  // Método para resetear el formulario y volver al estado inicial
  resetFormulario() {
    this.solicitudSeleccionada = null;
    this.formularioSeleccionado = null;
    this.diagnostico = '';
    this.tratamiento = '';
    this.camaSeleccionada = null;
  }
}
