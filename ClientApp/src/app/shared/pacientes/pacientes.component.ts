import { Component, OnInit } from '@angular/core';
import { ApiService, Paciente } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  nuevoPaciente: Paciente = {
    idPaciente: 0,
    nombre: '',
    edad: 0,
    fechaNacimiento: new Date(),
    sintomas: '',
    estado: '',
    fechaRegistro: new Date(),
    seguridadSocial: '',
    direccion: '',
    telefono: '',
    historialMedico: ''
  };
  pacienteParaActualizar: Paciente | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerPacientes();
  }

  obtenerPacientes(): void {
    this.apiService.getPacientes().subscribe({
      next: (data: Paciente[]) => {
        this.pacientes = data;
      },
      error: (error: any) => {
        console.error('Error al obtener los pacientes', error);
      }
    });
  }

  agregarPaciente(): void {
    this.apiService.addPaciente(this.nuevoPaciente).subscribe({
      next: (paciente: Paciente) => {
        this.pacientes.push(paciente);
        this.nuevoPaciente = {
          idPaciente: 0,
          nombre: '',
          edad: 0,
          fechaNacimiento: new Date(),
          sintomas: '',
          estado: '',
          fechaRegistro: new Date(),
          seguridadSocial: '',
          direccion: '',
          telefono: '',
          historialMedico: ''
        };
      },
      error: (error: any) => {
        console.error('Error al agregar el paciente', error);
      }
    });
  }

  toggleActualizarPaciente(paciente: Paciente): void {
    if (this.pacienteParaActualizar && this.pacienteParaActualizar.idPaciente === paciente.idPaciente) {
      this.pacienteParaActualizar = null;
    } else {
      this.pacienteParaActualizar = { ...paciente };
    }
  }

  actualizarPaciente(): void {
    if (this.pacienteParaActualizar) {
      this.apiService.updatePaciente(this.pacienteParaActualizar).subscribe({
        next: (pacienteActualizado: Paciente) => {
          const index = this.pacientes.findIndex(p => p.idPaciente === pacienteActualizado.idPaciente);
          if (index !== -1) {
            this.pacientes[index] = pacienteActualizado;
          }
          this.pacienteParaActualizar = null;
        },
        error: (error: any) => {
          console.error('Error al actualizar el paciente', error);
        }
      });
    }
  }

  borrarPaciente(id: number): void {
    this.apiService.deletePaciente(id).subscribe({
      next: () => {
        this.pacientes = this.pacientes.filter(p => p.idPaciente !== id);
      },
      error: (error: any) => {
        console.error('Error al borrar el paciente', error);
      }
    });
  }
}
