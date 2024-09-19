import { Component } from '@angular/core';
import { ApiService, Paciente, Consulta } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  // Inicializar un objeto vacío para la nueva consulta
  consulta: Consulta = {
    IdConsulta: 0,
    IdPaciente: 0,
    IdMedico: 0, 
    Motivo: '',
    FechaSolicitud: new Date(),
    FechaConsulta: null,
    Estado: 'pendiente'
  };

  constructor(private apiService: ApiService) {}

  buscarPaciente(event: Event) {
    event.preventDefault();
  
    // Resetea los resultados anteriores
    this.errorMensaje = null;
    this.pacientesEncontrados = [];

    // Verificar si al menos uno de los campos de búsqueda está lleno
    if (this.searchName.trim() !== '' || this.searchSS.trim() !== '') {
      this.apiService.getPacientes(this.searchName, this.searchSS).subscribe({
        next: (pacientes: Paciente[]) => {
          if (pacientes.length > 0) {
            this.pacientesEncontrados = pacientes;
          } else {
            this.errorMensaje = 'No se encontraron pacientes con ese nombre o número de seguridad social.';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al buscar el paciente. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      this.errorMensaje = 'Por favor, ingresa un nombre o un número de seguridad social para buscar.';
    }
}

  
  

  // Seleccionar un paciente para editar
editarPaciente(paciente: Paciente) {
  if (this.pacienteSeleccionado && this.pacienteSeleccionado.IdPaciente === paciente.IdPaciente) {
    // Si ya está seleccionado, ocultar el formulario
    this.pacienteSeleccionado = null;
    this.mostrarFormularioEdicion = false;
  } else {
    // Si no está seleccionado, mostrar el formulario de edición
    this.pacienteSeleccionado = { ...paciente }; // Clona el paciente seleccionado
    this.mostrarFormularioEdicion = true; // Mostrar el formulario de edición
    this.mostrarFormularioConsulta = false; // Ocultar el formulario de consulta
  }
}


  // Actualizar los datos del paciente
  actualizarPaciente() {
    if (this.pacienteSeleccionado) {
      this.apiService.updatePaciente(this.pacienteSeleccionado).subscribe({
        next: () => {
          this.buscarPaciente(new Event('')); // Rehacer la búsqueda para actualizar los datos
          this.pacienteSeleccionado = null; // Limpiar el paciente seleccionado
          this.mostrarFormularioEdicion = false; // Ocultar el formulario de edición
          alert('Paciente actualizado con éxito.');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al actualizar el paciente. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }

// Seleccionar un paciente para consulta
abrirFormularioConsulta(paciente: Paciente) {
  if (paciente.Estado === 'EnConsulta') {
    // Si el paciente ya está en consulta, mostrar un mensaje y no permitir abrir el formulario
    alert('Este paciente ya está en consulta.');
    return;
  }

  if (this.pacienteSeleccionado && this.pacienteSeleccionado.IdPaciente === paciente.IdPaciente && this.mostrarFormularioConsulta) {
    // Si ya está seleccionado y el formulario de consulta está visible, ocultarlo
    this.pacienteSeleccionado = null;
    this.mostrarFormularioConsulta = false;
  } else {
    // Si no está seleccionado o el formulario de consulta no está visible, mostrarlo
    this.pacienteSeleccionado = paciente;
    this.mostrarFormularioConsulta = true; // Mostrar el formulario de consulta
    this.mostrarFormularioEdicion = false; // Ocultar el formulario de edición

    // Rellenar los campos de la consulta con los valores predeterminados
    this.consulta.IdPaciente = paciente.IdPaciente;
    this.consulta.FechaSolicitud = new Date(); // Fecha actual
    this.consulta.Estado = 'pendiente';
  }
}


  

  // Método para registrar la consulta
  registrarConsulta() {
    if (this.consulta.IdMedico && this.consulta.Motivo) {
      this.apiService.addConsulta(this.consulta).subscribe({
        next: () => {
          alert('Consulta registrada con éxito.');
          this.mostrarFormularioConsulta = false;
          this.pacienteSeleccionado = null; // Limpiar el paciente seleccionado después de registrar la consulta
          this.resetConsulta(); // Reiniciar el formulario de consulta
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al registrar la consulta. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      alert('Por favor, ingrese todos los datos requeridos.');
    }
  }

  // Método para cancelar la edición del paciente
  cancelarEdicion() {
    this.pacienteSeleccionado = null; // Limpiar el paciente seleccionado
    this.mostrarFormularioEdicion = false; // Ocultar el formulario de edición
  }

  // Método para cancelar el registro de la consulta
  cancelarConsulta() {
    this.mostrarFormularioConsulta = false;
    this.resetConsulta(); // Reiniciar el formulario de consulta
  }

  // Método para reiniciar el formulario de consulta
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
