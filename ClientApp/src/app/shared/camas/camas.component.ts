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
 
  nuevaCama: Cama =
  {IdCama: 0,
    Ubicacion: '',
    Estado: '',
    Tipo: '' ,
    IdHabitacion: 0};
  camaParaActualizar: Cama | null = null;
 
  paginaActual: number = 1;
  camasPorPagina: number = 7;
  totalPaginas: number = 0;
 
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
        console.log(data);
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
 
}
 