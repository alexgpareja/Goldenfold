import { Component } from '@angular/core';
import { ApiService, Paciente } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrls: ['./registrar-paciente.component.css']
})
export class RegistrarPacienteComponent {
  nuevoPaciente: Paciente = {
    idPaciente: 0,
    nombre: '',
    edad: 0,
    fechaNacimiento: new Date(),
    sintomas: '',
    estado: 'Pendiente de cama',
    seguridadSocial: '',
    direccion: '',
    telefono: '',
    email: '',
    historialMedico: '',
    fechaRegistro: new Date()
  };

  constructor(private apiService: ApiService) {}

  registerPatient(event: Event) {
    event.preventDefault();

    this.apiService.addPaciente(this.nuevoPaciente).subscribe({
      next: () => {
        alert('Paciente registrado exitosamente');
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          alert('Error: El paciente ya existe. Por favor, verifica los datos e intenta nuevamente.');
        } else {
          alert('Error al registrar el paciente. Por favor, inténtalo de nuevo.');
        }
      }
    });
  }

  resetForm() {
    this.nuevoPaciente = {
      idPaciente: 0,
      nombre: '',
      edad: 0,
      fechaNacimiento: new Date(),
      sintomas: '',
      estado: 'Pendiente de cama',
      seguridadSocial: '',
      direccion: '',
      telefono: '',
      email: '',
      historialMedico: '',
      fechaRegistro: new Date()
    };
  }
}
