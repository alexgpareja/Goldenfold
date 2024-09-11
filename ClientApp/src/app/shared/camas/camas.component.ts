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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerCamas();
  }

  obtenerCamas(): void {
    this.apiService.getCamas().subscribe({
      next: (data: Cama[]) => {
        this.camas = data;
        this.camasFiltradas = [...this.camas]; // Inicializamos camasFiltradas
      },
      error: (error: any) => {
        console.error('Error al obtener las camas', error);
      }
    });
  }

  agregarCama(): void {
    this.apiService.addCama(this.nuevaCama).subscribe({
      next: (cama: Cama) => {
        this.camas.push(cama);
        this.nuevaCama = { Ubicacion: '', Estado: '', Tipo: '' };
        this.camasFiltradas = [...this.camas]; // Refrescamos las camas filtradas
      },
      error: (error: any) => {
        console.error('Error al agregar la cama', error);
      }
    });
  }

  toggleActualizarCama(cama: Cama): void {
    if (this.camaParaActualizar && this.camaParaActualizar.Ubicacion === cama.Ubicacion) {
      this.camaParaActualizar = null;
    } else {
      this.camaParaActualizar = { ...cama };
    }
  }

  actualizarCama(): void {
    if (this.camaParaActualizar) {
      this.apiService.updateCama(this.camaParaActualizar).subscribe({
        next: (camaActualizada: Cama) => {
          this.obtenerCamas(); 
          this.camaParaActualizar = null; 
        },
        error: (error: any) => {
          console.error('Error al actualizar la cama', error);
        }
      });
    }
  }

  confirmarBorrarCama(cama: Cama): void {
    const confirmar = window.confirm(`¿Está seguro de que desea borrar la cama con ubicación ${cama.Ubicacion}?`);
    if (confirmar) {
      this.borrarCama(cama.Ubicacion);
    }
  }

  borrarCama(ubicacion: string): void {
    this.apiService.deleteCama(ubicacion).subscribe({
      next: () => {
        this.camas = this.camas.filter(c => c.Ubicacion !== ubicacion);
        this.camasFiltradas = [...this.camas]; // Refrescar la lista filtrada
      },
      error: (error: any) => {
         console.error('Error al eliminar la cama', error);
      }
    });
  }

  filtrarPorUbicacion(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (value !== undefined && value !== null) {
      this.camasFiltradas = this.camas.filter(cama =>
        cama.Ubicacion.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.camasFiltradas = [...this.camas];
    }
  }

  filtrarPorEstado(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    if (value === '') {
      this.camasFiltradas = [...this.camas];
    } else {
      this.camasFiltradas = this.camas.filter(cama =>
        cama.Estado === value
      );
    }
  }

  filtrarPorTipo(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    if (value === '') {
      this.camasFiltradas = [...this.camas];
    } else {
      this.camasFiltradas = this.camas.filter(cama =>
        cama.Tipo === value
      );
    }
  }
}
