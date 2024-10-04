import { Component } from '@angular/core';
import { ApiService, Paciente, Consulta } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa el MatSnackBar

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

          }
        },
        error: (error: HttpErrorResponse) => {

        }
      });
    } else {

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
        },
        error: (error: HttpErrorResponse) => {

        }
      });
    }
  }

  abrirFormularioConsulta(paciente: Paciente) {
    if (paciente.Estado === 'EnConsulta') {
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
          this.mostrarFormularioConsulta = false;
          this.pacienteSeleccionado = null;
          this.resetConsulta();
          window.location.reload();
        },
        error: (error: HttpErrorResponse) => {

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

}

