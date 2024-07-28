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
    IdPaciente: 0,
    Nombre: '',
    Edad: 0,
    FechaNacimiento: new Date(),
    Sintomas: '',
    Estado: '',
    FechaRegistro: new Date(),
    SeguridadSocial: '',
    Direccion: '',
    Telefono: '',
    HistorialMedico: ''
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerPacientes();
  }

  obtenerPacientes(): void {
    this.apiService.getPacientes().subscribe({
      next: (data: any[]) => {
        console.log(data); 
        this.pacientes = data.map(item => ({
          IdPaciente: item.idPaciente,
          Nombre: item.nombre,
          Edad: item.edad,
          FechaNacimiento: new Date(item.fechaNacimiento),
          Sintomas: item.sintomas,
          Estado: item.estado,
          FechaRegistro: new Date(item.fechaRegistro),
          SeguridadSocial: item.seguridadSocial,
          Direccion: item.direccion,
          Telefono: item.telefono,
          HistorialMedico: item.historialMedico
        }));
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
          IdPaciente: 0,
          Nombre: '',
          Edad: 0,
          FechaNacimiento: new Date(),
          Sintomas: '',
          Estado: '',
          FechaRegistro: new Date(),
          SeguridadSocial: '',
          Direccion: '',
          Telefono: '',
          HistorialMedico: ''
        }; // Reset form
      },
      error: (error: any) => {
        console.error('Error al agregar el paciente', error);
      }
    });
  }

  editarRegistro(id: number) {
    console.log(`Editar registro con ID ${id}`);
    // Aquí puedes agregar la lógica para editar el registro
  }

  copiarRegistro(id: number) {
    console.log(`Copiar registro con ID ${id}`);
    // Aquí puedes agregar la lógica para copiar el registro
  }

  borrarRegistro(id: number) {
    this.apiService.deletePaciente(id).subscribe({
      next: () => {
        console.log(`Borrar registro con ID ${id}`);
        this.pacientes = this.pacientes.filter(paciente => paciente.IdPaciente !== id);
      },
      error: (error: any) => {
        console.error('Error al borrar el paciente', error);
      }
    });
  }
}
