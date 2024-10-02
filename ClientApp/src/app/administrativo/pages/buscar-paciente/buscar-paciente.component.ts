import { Component } from '@angular/core';
import { ApiService, Paciente, Consulta } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa el MatSnackBar
import { SnackBarNotiComponent } from '../../../shared/snack-bar-noti/snack-bar-noti.component'; // Importa el componente del snackbar

@Component({
  selector: 'app-buscar-paciente',
  templateUrl: './buscar-paciente.component.html',
  styleUrls: ['./buscar-paciente.component.css']
})
export class BuscarPacienteComponent {
  searchName: string = ''; // Nombre del paciente a buscar
  searchSS: string = '';
  pacientesEncontrados: Paciente[] = []; // Resultados de la búsqueda
  errorMensaje: string | null = null; // Mensaje de error
  pacienteSeleccionado: Paciente | null = null; // Paciente seleccionado para consulta o edición
  mostrarFormularioConsulta: boolean = false; // Mostrar u ocultar el formulario de consulta
  mostrarFormularioEdicion: boolean = false; // Mostrar u ocultar el formulario de edición

  consulta: Consulta = {
    IdConsulta: 0,
    IdPaciente: 0,
    IdMedico: 0,
    Motivo: '',
    FechaSolicitud: new Date(),
    FechaConsulta: null,
    Estado: 'pendiente'
  };

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {} // Inyecta el MatSnackBar

  buscarPaciente(event: Event) {
    event.preventDefault();

    this.errorMensaje = null;
    this.pacientesEncontrados = [];

    if (this.searchName.trim() !== '' || this.searchSS.trim() !== '') {
      this.apiService.getPacientes(this.searchName, this.searchSS).subscribe({
        next: (pacientes: Paciente[]) => {
          if (pacientes.length > 0) {
            this.pacientesEncontrados = pacientes;
          } else {
            this.mostrarNotificacionAlert('No se encontraron pacientes con ese nombre o número de seguridad social.');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarNotificacionError('Error al buscar el paciente. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      this.mostrarNotificacionAlert('Por favor, ingresa un nombre o un número de seguridad social para buscar.');
    }
  }

  editarPaciente(paciente: Paciente) {
    if (this.pacienteSeleccionado && this.pacienteSeleccionado.IdPaciente === paciente.IdPaciente) {
      this.pacienteSeleccionado = null;
      this.mostrarFormularioEdicion = false;
    } else {
      this.pacienteSeleccionado = { ...paciente };
      this.mostrarFormularioEdicion = true;
      this.mostrarFormularioConsulta = false;
    }
  }

  actualizarPaciente() {
    if (this.pacienteSeleccionado) {
      this.apiService.updatePaciente(this.pacienteSeleccionado).subscribe({
        next: () => {
          this.buscarPaciente(new Event(''));
          this.pacienteSeleccionado = null;
          this.mostrarFormularioEdicion = false;
          this.mostrarNotificacionSuccess('Paciente actualizado con éxito.');
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarNotificacionError('Error al actualizar el paciente. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }

  abrirFormularioConsulta(paciente: Paciente) {
    if (paciente.Estado === 'EnConsulta') {
      this.mostrarNotificacionAlert('Este paciente ya está en consulta.');
      return;
    }

    if (this.pacienteSeleccionado && this.pacienteSeleccionado.IdPaciente === paciente.IdPaciente && this.mostrarFormularioConsulta) {
      this.pacienteSeleccionado = null;
      this.mostrarFormularioConsulta = false;
    } else {
      this.pacienteSeleccionado = paciente;
      this.mostrarFormularioConsulta = true;
      this.mostrarFormularioEdicion = false;

      this.consulta.IdPaciente = paciente.IdPaciente;
      this.consulta.FechaSolicitud = new Date();
      this.consulta.Estado = 'pendiente';
    }
  }

  registrarConsulta() {
    if (this.consulta.IdMedico && this.consulta.Motivo) {
      this.apiService.addConsulta(this.consulta).subscribe({
        next: () => {
          this.mostrarNotificacionSuccess('Consulta registrada con éxito.');
          this.mostrarFormularioConsulta = false;
          this.pacienteSeleccionado = null;
          this.resetConsulta();
          window.location.reload();
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarNotificacionError('Error al registrar la consulta. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      alert('Por favor, ingrese todos los datos requeridos.');
    }
  }

  cancelarEdicion() {
    this.pacienteSeleccionado = null;
    this.mostrarFormularioEdicion = false;
  }

  cancelarConsulta() {
    this.mostrarFormularioConsulta = false;
    this.resetConsulta();
  }

  resetConsulta() {
    this.consulta = {
      IdConsulta: 0,
      IdPaciente: 0,
      IdMedico: 0,
      Motivo: '',
      FechaSolicitud: new Date(),
      FechaConsulta: null,
      Estado: 'pendiente'
    };
  }

  // Métodos para manejar las notificaciones utilizando Snackbar
mostrarNotificacionSuccess(mensaje: string) {
  this.snackBar.openFromComponent(SnackBarNotiComponent, {
    data: {
      message: mensaje,
        panelClass: 'success-snackbar',
      icon: 'check_circle' // Icono para éxito
    },
    duration: 2500,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
}

mostrarNotificacionError(mensaje: string) {
  this.snackBar.openFromComponent(SnackBarNotiComponent, {
    data: {
      message: mensaje,
      panelClass: 'error-snackbar',
      icon: 'error' // Icono para error
    },
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
}

mostrarNotificacionAlert(mensaje: string) {
  this.snackBar.openFromComponent(SnackBarNotiComponent, {
    data: {
      message: mensaje,
      panelClass: 'alert-snackbar',
      icon: 'warning' // Icono para alerta
    },
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
}
}
