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
    Estado: 'Registrado',
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
  
    // Validaciones antes de enviar al servidor
    if (this.nuevoPaciente.SeguridadSocial.length !== 12) {
      alert('El número de seguridad social debe tener 12 dígitos.');
      return;
    }
  
    if (!this.isValidDni(this.nuevoPaciente.Dni)) {
      alert('El DNI debe tener 8 números seguidos de una letra.');
      return;
    }
  
    if (this.nuevoPaciente.FechaNacimiento > new Date()) {
      alert('La fecha de nacimiento no puede ser en el futuro.');
      return;
    }
  
    if (this.nuevoPaciente.Telefono && !this.isValidPhoneNumber(this.nuevoPaciente.Telefono)) {
      alert('El número de teléfono debe tener exactamente 9 dígitos.');
      return;
    }
  
    // Llamada al API para registrar el paciente
    this.apiService.addPaciente(this.nuevoPaciente).subscribe({
      next: () => {
        alert('Paciente registrado exitosamente');
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessageFromResponse(error);
        alert('Error: ' + errorMessage);
      }
    });
  }
  
  getErrorMessageFromResponse(error: HttpErrorResponse): string {
    if (error.error instanceof Object) {
      if (error.error.errors) {
        // Si el backend devuelve un objeto de errores en formato de validación, desglosarlo.
        return Object.values(error.error.errors).flat().join(', ');
      }
      // En caso de otro formato de error, devolver todos los valores del objeto.
      return JSON.stringify(error.error);
    } else if (typeof error.error === 'string') {
      // Si el error es una cadena de texto, devolverlo tal cual.
      return error.error;
    } else {
      return 'Ocurrió un error inesperado.';
    }
  }
  

   // Validación de DNI (formato 8 dígitos seguidos de una letra)
   isValidDni(dni: string): boolean {
    const dniPattern = /^\d{8}[A-Za-z]$/;
    return dniPattern.test(dni);
  }

  // Validación de número de teléfono (9 dígitos)
  isValidPhoneNumber(phone: string): boolean {
    const phonePattern = /^\d{9}$/;
    return phonePattern.test(phone);
  }

  resetForm() {
    this.nuevoPaciente = {
      IdPaciente: 0,
      Nombre: '',
      Dni: '',
      FechaNacimiento: new Date(),
      Estado: 'Registrado',
      FechaRegistro: new Date(),
      SeguridadSocial: '',
      Direccion: '',
      Telefono: '',
      Email: '',
      HistorialMedico: ''
    };
  }
}
