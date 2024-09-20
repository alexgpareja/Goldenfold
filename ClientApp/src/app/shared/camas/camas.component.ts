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
  camasPaginadas: Cama[] = [];

  nuevaCama: Cama =
    { IdCama: 0, Ubicacion: '', Estado: '', Tipo: '', IdHabitacion: 0 };
  camaParaActualizar: Cama | null = null;

  paginaActual: number = 1;
  camasPorPagina: number = 7;
  totalPaginas: number = 0;

  // Variables para el formulario
  mostrarFormularioAgregarCama: boolean = false;
  mostrarFormularioActualizarCama: boolean = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  // Variables para filtros
  filtroUbicacion: string = '';
  filtroEstado: string = '';
  filtroTipo: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerCamas();
  }

  // Obtener las camas desde la API
  obtenerCamas(): void {
    this.apiService.getCamas().subscribe({
      next: (data: Cama[]) => {
        console.log(data);
        this.camas = data;
        this.aplicarFiltros(); // Inicializa el filtrado y la paginación
      },
      error: (error: any) => {
        console.error('Error al obtener las camas', error);
      }
    });
  }

  // Aplicar filtros
  aplicarFiltros(): void {
    // Filtra las camas según los filtros seleccionados
    this.camasFiltradas = this.camas.filter(cama => {
      const coincideUbicacion = this.filtroUbicacion
        ? cama.Ubicacion.toLowerCase().includes(this.filtroUbicacion.toLowerCase())
        : true;
      const coincideEstado = this.filtroEstado ? cama.Estado === this.filtroEstado : true;
      const coincideTipo = this.filtroTipo ? cama.Tipo === this.filtroTipo : true;

      return coincideUbicacion && coincideEstado && coincideTipo;
    });

    // Reiniciar a la primera página
    this.paginaActual = 1;

    // Calcular el total de páginas basado en las camas filtradas
    this.totalPaginas = Math.ceil(this.camasFiltradas.length / this.camasPorPagina);

    // Aplicar la paginación después de filtrar
    this.filtrarCamasPaginadas();
  }

  // Filtrar las camas con paginación
  filtrarCamasPaginadas(): void {
    const inicio = (this.paginaActual - 1) * this.camasPorPagina;
    const fin = inicio + this.camasPorPagina;
    this.camasPaginadas = this.camasFiltradas.slice(inicio, fin);
  }

  // Métodos de filtrado para cada filtro
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

  // Método para ir a la primera página
  irAPrimeraPagina(): void {
    this.paginaActual = 1;
    this.filtrarCamasPaginadas();
  }

  // Método para ir a la última página
  irALaUltimaPagina(): void {
    this.paginaActual = this.totalPaginas;
    this.filtrarCamasPaginadas();
  }

  // Método para ir a la página siguiente
  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.filtrarCamasPaginadas();
    }
  }

  // Método para ir a la página anterior
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.filtrarCamasPaginadas();
    }
  }
}
