import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Habitacion } from '../../services/api.service';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  habitacionesPaginas: Habitacion[] = [];
  nuevaHabitacion: Habitacion = { IdHabitacion: 0, Edificio: '', Planta: '', NumeroHabitacion: '', TipoCama: '' };
  habitacionParaActualizar: Habitacion | null = null;

  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  totalPaginas: number = 1;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerHabitaciones();
  }

  obtenerHabitaciones(): void {
    this.apiService.getHabitaciones().subscribe({
      next: (data: any[]) => {
        this.habitaciones = data.map(item => ({
          IdHabitacion: item.IdHabitacion,
          Edificio: item.Edificio,
          Planta: item.Planta,
          NumeroHabitacion: item.NumeroHabitacion,
          TipoCama: item.TipoCama
        }));
        this.totalPaginas = Math.ceil(this.habitaciones.length / this.itemsPorPagina);
        this.actualizarPaginas();
      },
      error: (error: any) => {
        console.error('Error al obtener las habitaciones', error);
      }
    });
  }

  actualizarPaginas(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.habitacionesPaginas = this.habitaciones.slice(inicio, fin);

    // Si no hay habitaciones en la página actual y hay más páginas, ir a la última página
    if (this.habitacionesPaginas.length === 0 && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
      this.actualizarPaginas(); // Actualiza nuevamente las habitaciones para la nueva página
    }
  }

  agregarHabitacion(): void {
    this.apiService.addHabitacion(this.nuevaHabitacion).subscribe({
      next: (nuevaHabitacion: Habitacion) => {
        this.habitaciones.push(nuevaHabitacion);
        this.nuevaHabitacion = { IdHabitacion: 0, Edificio: '', Planta: '', NumeroHabitacion: '', TipoCama: "" };
        this.totalPaginas = Math.ceil(this.habitaciones.length / this.itemsPorPagina);
        this.actualizarPaginas();
      },
      error: (error: any) => {
        console.error('Error al agregar la habitación', error);
      }
    });
  }

  actualizarHabitacion(): void {
    if (this.habitacionParaActualizar) {
      this.apiService.updateHabitacion(this.habitacionParaActualizar).subscribe({
        next: (habitacionActualizada: Habitacion) => {
          const index = this.habitaciones.findIndex(h => h.IdHabitacion === habitacionActualizada.IdHabitacion);
          if (index !== -1) {
            this.habitaciones[index] = habitacionActualizada;
          }
          this.habitacionParaActualizar = null;
          this.actualizarPaginas();
        },
        error: (error: any) => {
          console.error('Error al actualizar la habitación', error);
        }
      });
    }
  }

  borrarHabitacion(id: number): void {
    this.apiService.deleteHabitacion(id).subscribe({
      next: () => {
        this.habitaciones = this.habitaciones.filter(h => h.IdHabitacion !== id);
        this.totalPaginas = Math.ceil(this.habitaciones.length / this.itemsPorPagina);

        // Si después de borrar, la página actual no tiene habitaciones
        if (this.habitacionesPaginas.length === 0 && this.paginaActual > 1) {
          this.paginaActual = this.totalPaginas; // Ir a la última página
        }

        this.actualizarPaginas(); // Actualizar la lista de habitaciones
      },
      error: (error: any) => {
        console.error('Error al borrar la habitación', error);
      }
    });
  }

  toggleActualizarHabitacion(habitacion: Habitacion): void {
    this.habitacionParaActualizar = habitacion;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginas();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginas();
    }
  }

  irAPrimeraPagina(): void {
    this.paginaActual = 1;
    this.actualizarPaginas();
  }

  irALaUltimaPagina(): void {
    this.paginaActual = this.totalPaginas;
    this.actualizarPaginas();
  }
}
