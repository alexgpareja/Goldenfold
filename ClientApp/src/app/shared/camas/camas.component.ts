import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Cama } from '../../services/api.service';
import { HttpBackend } from '@angular/common/http';

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

  //variables para el formulario
  mostrarFormularioAgregarCama: boolean = false;
  mostrarFormularioActualizarCama : boolean = false;
  mensajeExito: string | null = null;
  mensajeError :string | null = null;

  //variables para filtros
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

  actualizarCama(): void {
    if (this.camaParaActualizar) {
      this.apiService.updateCama(this.camaParaActualizar).subscribe({
        next: (camaActualizada: Cama) => {
          this.obtenerCamas(); 
          this.camaParaActualizar = null;
          window.alert("Cama actualizada correctamente.") 
        },
        error: (error: any) => {
          console.error('Error al actualizar la cama', error);
        }
      });
    }
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

  abrirFormularioAgregarCama(): void {
    this.mostrarFormularioAgregarCama = true;
    this.mensajeExito = null; 
  }
  abrirFormularioActualizarCama(cama: Cama): void {
    this.camaParaActualizar = { ...cama }; 
    this.mostrarFormularioActualizarCama = true;
    this.mensajeExito = null;
  }
 
  cerrarFormularioAgregarCama(): void {
    this.mostrarFormularioAgregarCama = false;
    this.mensajeExito = null;
  }

  cerrarFormularioActualizarCama(): void {
    this.mostrarFormularioAgregarCama = false;
    this.mensajeExito = null;
  }

  agregarCama(): void {
    this.apiService.addCama(this.nuevaCama).subscribe({
      next: (cama: Cama) => {
        this.camas.push(cama);
        this.camasFiltradas = [...this.camas];
        this.nuevaCama = { Ubicacion: '', Estado: '', Tipo: '' };
        this.mensajeExito = 'Cama agregada correctamente'; 
        this.cerrarFormularioAgregarCama(); 
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
        window.alert("Cama eliminada correctamente.")
      },
      error: (error: any) => {
        console.error('Error al eliminar la cama', error);
        window.alert(error.message || "currió un error al eliminar la cama.")
      }
    });
  }

/*
  manejarClicFuera(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.cerrarFormularioAgregarCama();
      this.cerrarFormularioActualizarCama();
    }
  }
*/
  confirmarBorrarCama(cama: Cama): void {
    const confirmar = window.confirm(`¿Está seguro de que desea borrar la cama con ubicación ${cama.Ubicacion}?`);
    if (confirmar) {
      this.borrarCama(cama.Ubicacion);
    }
  }

  
}

