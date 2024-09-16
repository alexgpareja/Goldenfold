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
    IdPaciente: 0,
    Nombre: '',
    Dni: '',
    FechaNacimiento: new Date(),
    Estado: '',
    FechaRegistro: new Date(),
    SeguridadSocial: '',
    Direccion: '',
    Telefono: '',
    Email: '',
    HistorialMedico: ''
  };

  constructor(private apiService: ApiService) {}

  registerPatient(event: Event) {
    event.preventDefault();

    // Verificar que el número de seguridad social tiene 12 dígitos
    if (this.nuevoPaciente.SeguridadSocial.length !== 12) {
      alert('El número de seguridad social debe tener 12 dígitos.');
      return;
    }

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
      IdPaciente: 0,
      Nombre: '',
      Dni: '',
      FechaNacimiento: new Date(),
      Estado: '',
      FechaRegistro: new Date(),
      SeguridadSocial: '',
      Direccion: '',
      Telefono: '',
      Email: '',
      HistorialMedico: ''
    };
  }
}
