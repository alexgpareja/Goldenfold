import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Paciente } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-administrativo-dashboard',
  templateUrl: './administrativo-dashboard.component.html',
  styleUrls: ['./administrativo-dashboard.component.css']
})
export class AdministrativoDashboardComponent {
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

  searchName: string = '';
  pacientesEncontrados: Paciente[] = [];
  errorMensaje: string | null = null;
  mostrarResultados: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {}

  logout() {
    alert('Sesión cerrada');
    this.router.navigate(["/inicio"]);
  }

  toggleSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = (section.style.display === 'none' || section.style.display === '') ? 'block' : 'none';
    }
  }

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
        console.error('Error al registrar el paciente', error);
      }
    });
  }

  toggleSearchResults(event: Event) {
    // Evita que el botón provoque un comportamiento predeterminado como el scroll
    event.preventDefault();
    
    // Toggle la visibilidad de los resultados
    this.mostrarResultados = !this.mostrarResultados;
  
    // Si se activan los resultados, realiza la búsqueda
    if (this.mostrarResultados) {
      this.searchPatient();
    }
  }

  searchPatient() {
    this.errorMensaje = null;
    this.pacientesEncontrados = [];

    if (this.searchName.trim() !== '') {
      this.apiService.getPacienteByName(this.searchName).subscribe({
        next: (pacientes: Paciente[]) => {
          if (pacientes.length > 0) {
            this.pacientesEncontrados = pacientes;
          } else {
            this.errorMensaje = 'No se encontraron pacientes con ese nombre.';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al buscar el paciente. Por favor, inténtalo de nuevo.';
          console.error('Error al buscar el paciente', error);
        }
      });
    } else {
      this.errorMensaje = 'Por favor, ingresa un nombre para buscar.';
    }
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
