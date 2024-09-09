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
}
