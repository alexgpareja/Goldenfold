import { Component } from '@angular/core';
import { ApiService, Paciente } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-buscar-paciente',
  templateUrl: './buscar-paciente.component.html',
  styleUrls: ['./buscar-paciente.component.css']
})
export class BuscarPacienteComponent {
  searchName: string = '';
  pacientesEncontrados: Paciente[] = [];
  errorMensaje: string | null = null;
  selectedPaciente: Paciente | null = null; // Paciente seleccionado para edición

  constructor(private apiService: ApiService) {}

  searchPatient(event: Event) {
    event.preventDefault();
    this.errorMensaje = null;
    this.pacientesEncontrados = [];

    if (this.searchName.trim() !== '') {
      this.apiService.getPacientes(this.searchName).subscribe({
        next: (pacientes: Paciente[]) => {
          if (pacientes.length > 0) {
            this.pacientesEncontrados = pacientes;

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

  transformarPropiedadesAMinusculas(paciente: any): any {
    const pacienteConMinusculas: any = {};
    Object.keys(paciente).forEach(key => {
      pacienteConMinusculas[key.toLowerCase()] = paciente[key];
    });
    return pacienteConMinusculas;
  }

  editPatient(paciente: Paciente) {
    this.selectedPaciente = { ...paciente }; // Clonar el paciente para editarlo
  }

  updatePatient() {
    if (this.selectedPaciente) {
      this.apiService.updatePaciente(this.selectedPaciente).subscribe({
        next: () => {
          // Actualizar la lista de pacientes
          this.searchPatient(new Event('')); // Rehacer la búsqueda para refrescar los datos
          this.selectedPaciente = null; // Limpiar el paciente seleccionado
          alert('Paciente actualizado con éxito.');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al actualizar el paciente. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }

  cancelEdit() {
    this.selectedPaciente = null; // Limpiar el paciente seleccionado
  }

  deletePatient(pacienteId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      this.apiService.deletePaciente(pacienteId).subscribe({
        next: () => {
          this.pacientesEncontrados = this.pacientesEncontrados.filter(paciente => paciente.IdPaciente !== pacienteId);
          alert('Paciente eliminado con éxito.');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al eliminar el paciente. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }
}
