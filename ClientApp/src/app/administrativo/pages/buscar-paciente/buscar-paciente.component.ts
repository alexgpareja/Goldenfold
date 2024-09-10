import { Component } from '@angular/core';
import { ApiService, Paciente } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-buscar-paciente',
  templateUrl: './buscar-paciente.component.html',
  styleUrls: ['./buscar-paciente.component.css']
})
export class BuscarPacienteComponent {
  searchName: string = ''; // Nombre del paciente a buscar
  pacientesEncontrados: Paciente[] = []; // Resultados de la búsqueda
  errorMensaje: string | null = null; // Mensaje de error
  selectedPaciente: Paciente | null = null; // Paciente seleccionado para edición

  constructor(private apiService: ApiService) {}

  // Método para buscar pacientes
  searchPatient(event: Event) {
    event.preventDefault(); // Evita la recarga de la página
    this.errorMensaje = null;
    this.pacientesEncontrados = [];

    // Verificar que se ha ingresado un nombre
    if (this.searchName.trim() !== '') {
      this.apiService.getPacientes(this.searchName).subscribe({
        next: (pacientes: Paciente[]) => {
          if (pacientes.length > 0) {
            this.pacientesEncontrados = pacientes; // Mostrar pacientes encontrados
          } else {
            this.errorMensaje = 'No se encontraron pacientes con ese nombre.';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al buscar el paciente. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      this.errorMensaje = 'Por favor, ingresa un nombre para buscar.';
    }
  }

  // Seleccionar un paciente para editar
  editPatient(paciente: Paciente) {
    this.selectedPaciente = { ...paciente }; // Clona el paciente seleccionado
  }

  // Actualizar los datos del paciente
  updatePatient() {
    if (this.selectedPaciente) {
      this.apiService.updatePaciente(this.selectedPaciente).subscribe({
        next: () => {
          // Actualizar la lista de pacientes después de editar
          this.searchPatient(new Event('')); // Rehacer la búsqueda para actualizar los datos
          this.selectedPaciente = null; // Limpiar el paciente seleccionado
          alert('Paciente actualizado con éxito.');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al actualizar el paciente. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }

  // Cancelar la edición del paciente
  cancelEdit() {
    this.selectedPaciente = null; // Limpiar el paciente seleccionado
  }
}
