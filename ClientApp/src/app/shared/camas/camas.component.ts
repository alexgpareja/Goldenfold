import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Cama } from '../../services/api.service';

@Component({
  selector: 'app-camas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './camas.component.html',
  styleUrls: ['./camas.component.css']
})
export class CamasComponent implements OnInit {
  camas: Cama[] = [];
  camasFiltradas: Cama[] = [];
  nuevaCama: Cama = { Ubicacion: '', Estado: '', Tipo: '' };
  camaParaActualizar: Cama | null = null;

  // Variables para el formulario
  mostrarFormularioCama: boolean = false;
  mensajeExito: string | null = null;

  // Variables para filtros
  filtroUbicacion: string = '';
  filtroEstado: string = '';
  filtroTipo: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerCamas();
  }

  obtenerCamas(): void {
    this.apiService.getCamas().subscribe({
      next: (data: Cama[]) => {
        this.camas = data;
        this.camasFiltradas = [...this.camas];
      },
      error: (error: any) => {
        console.error('Error al obtener las camas', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.camasFiltradas = this.camas.filter(cama => {
      const coincideUbicacion = this.filtroUbicacion
        ? cama.Ubicacion.toLowerCase().includes(this.filtroUbicacion.toLowerCase())
        : true;
      const coincideEstado = this.filtroEstado ? cama.Estado === this.filtroEstado : true;
      const coincideTipo = this.filtroTipo ? cama.Tipo === this.filtroTipo : true;

      return coincideUbicacion && coincideEstado && coincideTipo;
    });
  }

  filtrarPorUbicacion(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filtroUbicacion = inputElement.value;
    this.aplicarFiltros();
  }

  filtrarPorEstado(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filtroEstado = selectElement.value;
    this.aplicarFiltros();
  }

  filtrarPorTipo(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filtroTipo = selectElement.value;
    this.aplicarFiltros();
  }

  abrirFormularioCama(): void {
    this.mostrarFormularioCama = true;
    this.mensajeExito = null; // Limpiar mensaje de éxito
  }

  cerrarFormularioCama(): void {
    this.mostrarFormularioCama = false;
    this.mensajeExito = null; // Limpiar mensaje de éxito
  }

  agregarCama(): void {
    this.apiService.addCama(this.nuevaCama).subscribe({
      next: (cama: Cama) => {
        this.camas.push(cama);
        this.camasFiltradas = [...this.camas];
        this.nuevaCama = { Ubicacion: '', Estado: '', Tipo: '' };
        this.mensajeExito = 'Cama agregada correctamente'; // Mensaje de éxito
        this.cerrarFormularioCama(); // Cerrar el modal después de agregar
      },
      error: (error: any) => {
        console.error('Error al agregar la cama', error);
      }
    });
  }

  borrarCama(ubicacion: string): void {
    this.apiService.deleteCama(ubicacion).subscribe({
      next: () => {
        this.camas = this.camas.filter(c => c.Ubicacion !== ubicacion);
        this.camasFiltradas = [...this.camas];
      },
      error: (error: any) => {
        console.error('Error al eliminar la cama', error);
      }
    });
  }

  // cerrar el modal cuando se hace clic fuera del formulario
  manejarClicFuera(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.cerrarFormularioCama();
    }
  }

  confirmarBorrarCama(cama: Cama): void {
    const confirmar = window.confirm(`¿Está seguro de que desea borrar la cama con ubicación ${cama.Ubicacion}?`);
    if (confirmar) {
      this.borrarCama(cama.Ubicacion);
    }
  }

  toggleActualizarCama(cama: Cama): void {
    if (this.camaParaActualizar && this.camaParaActualizar.Ubicacion === cama.Ubicacion) {
      this.camaParaActualizar = null;
    } else {
      this.camaParaActualizar = { ...cama };
    }
  }
}

