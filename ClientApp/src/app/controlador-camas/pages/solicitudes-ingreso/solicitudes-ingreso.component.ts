import { Component, OnInit } from '@angular/core';
import { ApiService, Ingreso, Cama, Asignacion } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-solicitudes-ingreso',
  templateUrl: './solicitudes-ingreso.component.html',
  styleUrls: ['./solicitudes-ingreso.component.css']
})
export class SolicitudesIngresoComponent implements OnInit {
  solicitudesPendientes: Ingreso[] = [];
  camasDisponibles: Cama[] = [];
  errorMensaje: string | null = null;
  solicitudSeleccionada: Ingreso | null = null;
  formularioSeleccionado: 'seleccionarCama' | null = null;
  camaSeleccionada: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.obtenerSolicitudesPendientes();
  }

  // Obtener las solicitudes de ingreso con estado pendiente
  obtenerSolicitudesPendientes() {
    this.apiService.getIngresos(undefined, undefined, 'Pendiente').subscribe({
      next: (solicitudes: Ingreso[]) => {
        this.solicitudesPendientes = solicitudes;
      },
      error: (error) => {
        this.errorMensaje = 'Error al cargar las solicitudes de ingreso.';
      }
    });
  }

  // Método para asignar una cama a una solicitud de ingreso
  asignarCama(solicitud: Ingreso) {
    this.solicitudSeleccionada = solicitud;
    this.obtenerCamasDisponibles();
  }

  // Obtener las camas disponibles
  obtenerCamasDisponibles() {
    this.apiService.getCamas(undefined, 'Disponible').subscribe({
      next: (camas: Cama[]) => {
        this.camasDisponibles = camas;
      },
      error: (error) => {
        this.errorMensaje = 'Error al cargar las camas disponibles.';
      }
    });
  }

  // Mostrar el formulario de selección de cama
  mostrarFormulario(tipo: 'seleccionarCama') {
    this.formularioSeleccionado = tipo;
  }

  // Confirmar la selección de cama y asignarla
  confirmarCama() {
    if (this.solicitudSeleccionada && this.camaSeleccionada) {
      const asignacion = {
        IdAsignacion: 0,
        IdPaciente: this.solicitudSeleccionada.IdPaciente,
        IdCama: 0,
        FechaAsignacion: new Date(),
        FechaLiberacion: new Date(),
        AsignadoPor: 1
        
      };

      this.apiService.addAsignacion(asignacion).subscribe({
        next: () => {
          alert('Cama asignada correctamente.');
          this.actualizarEstadoSolicitud('Asignado');
        },
        error: (error) => {
          this.errorMensaje = 'Error al asignar la cama.';
        }
      });
    }
  }

  // Actualizar el estado de la solicitud de ingreso tras la asignación de cama
  actualizarEstadoSolicitud(nuevoEstado: string) {
    if (this.solicitudSeleccionada) {
      const solicitudActualizada = { ...this.solicitudSeleccionada, Estado: nuevoEstado };

      this.apiService.updateIngreso(solicitudActualizada).subscribe({
        next: () => {
          alert('Estado de la solicitud actualizado.');
          this.resetFormulario();
        },
        error: (error) => {
          this.errorMensaje = 'Error al actualizar el estado de la solicitud.';
        }
      });
    }
  }

  // Rechazar la solicitud de ingreso
  rechazarSolicitud() {
    if (this.solicitudSeleccionada) {
      this.actualizarEstadoSolicitud('Rechazado');
    }
  }

  // Método para resetear el formulario
  resetFormulario() {
    this.solicitudSeleccionada = null;
    this.formularioSeleccionado = null;
    this.camaSeleccionada = null;
    this.obtenerSolicitudesPendientes(); // Refrescar la lista de solicitudes pendientes
  }
}
