import { Component, OnInit } from '@angular/core';
import { ApiService, Paciente } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacientesPaginados: Paciente[] = [];
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
    Email: '',
    HistorialMedico: '',
  };

  pacienteParaActualizar: Paciente | null = null;

  paginaActual: number = 1;
  pacientesPorPagina: number = 5;
  totalPaginas: number = 0;

  filtroNombre: string = '';
  orden: 'asc' | 'desc' = 'asc';
  columnaOrdenada: keyof Paciente | '' = '';
  filtro: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerPacientes();
  }

  obtenerPacientes(): void {
    this.apiService.getPacientes().subscribe({
      next: (data: Paciente[]) => {
        this.pacientes = data;
        this.filtrarPacientes();
      },
      error: (error: any) => {
        console.error('Error al obtener los pacientes', error);
      },
    });
  }

  filtrarPacientes(): void {
    let pacientesFiltrados = this.pacientes.filter((paciente) =>
      paciente.Nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );

    if (this.columnaOrdenada) {
      pacientesFiltrados.sort((a, b) => {
        const valorA = a[this.columnaOrdenada as keyof Paciente];
        const valorB = b[this.columnaOrdenada as keyof Paciente];

        if (valorA < valorB) {
          return this.orden === 'asc' ? -1 : 1;
        }
        if (valorA > valorB) {
          return this.orden === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const inicio = (this.paginaActual - 1) * this.pacientesPorPagina;
    const fin = inicio + this.pacientesPorPagina;
    this.pacientesPaginados = pacientesFiltrados.slice(inicio, fin);
    this.totalPaginas = Math.ceil(
      pacientesFiltrados.length / this.pacientesPorPagina
    );
  }

  ordenar(columna: keyof Paciente): void {
    if (this.columnaOrdenada === columna) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.columnaOrdenada = columna;
      this.orden = 'asc';
    }
    this.filtrarPacientes();
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.filtrarPacientes();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.filtrarPacientes();
    }
  }

  agregarPaciente(): void {
    this.apiService.addPaciente(this.nuevoPaciente).subscribe({
      next: (paciente: Paciente) => {
        this.pacientes.push(paciente);
        this.filtrarPacientes();
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
          Email: '',
          HistorialMedico: '',
        };
        this.toggleFormularioAgregar(); // Cierra el modal después de agregar el paciente
      },
      error: (error: any) => {
        console.error('Error al agregar el paciente', error);
      },
    });
  }
  mostrarFormularioActualizar: boolean = false;
  toggleActualizarPaciente(paciente: Paciente): void {
    if (
      this.pacienteParaActualizar &&
      this.pacienteParaActualizar.IdPaciente === paciente.IdPaciente
    ) {
      this.pacienteParaActualizar = null;
      this.mostrarFormularioActualizar = false; // Cerrar el formulario
    } else {
      this.pacienteParaActualizar = { ...paciente };
      this.mostrarFormularioActualizar = true; // Abrir el formulario
    }
  }

  actualizarPaciente(): void {
    if (this.pacienteParaActualizar) {
      this.apiService.updatePaciente(this.pacienteParaActualizar).subscribe({
        next: (pacienteActualizado: Paciente) => {
          const index = this.pacientes.findIndex(
            (p) => p.IdPaciente === pacienteActualizado.IdPaciente
          );
          if (index !== -1) {
            this.pacientes[index] = pacienteActualizado;
            this.filtrarPacientes();
          }
          this.pacienteParaActualizar = null;
        },
        error: (error: any) => {
          console.error('Error al actualizar el paciente', error);
        },
      });
    }
    this.notificacion = 'Paciente actualizado con éxito';

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      this.notificacion = null;
    }, 3000);
  }

  aplicarFiltroNombre(filtro: string): void {
    this.filtroNombre = filtro;
    this.filtrarPacientes();
  }
  mostrarFormularioAgregar: boolean = false;

  // Método para alternar la visibilidad del formulario de agregar paciente
  toggleFormularioAgregar(): void {
    this.mostrarFormularioAgregar = !this.mostrarFormularioAgregar;
  }
  mostrarMas: boolean = false;

  // Método para alternar la visibilidad de la información adicional
  toggleMostrarMas(): void {
    this.mostrarMas = !this.mostrarMas;
  }
  notificacion: string | null = null;
}
