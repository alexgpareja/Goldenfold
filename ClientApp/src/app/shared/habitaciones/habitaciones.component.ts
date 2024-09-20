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
<<<<<<< HEAD
  habitacionesFiltradas: Habitacion[] = [];
  nuevaHabitacion: Habitacion = { IdHabitacion: 0, Edificio: '', Planta: '', NumeroHabitacion: '' };
=======
  nuevaHabitacion: Habitacion = { IdHabitacion: 0, Edificio: '', Planta: '', NumeroHabitacion: '', TipoCama: ''  };
>>>>>>> 114d952f399ac69b48260d4d5011b0b3e6a4b20c
  habitacionParaActualizar: Habitacion | null = null;

  paginaActual: number = 1;
  habitacionesPorPagina: number = 5;
  totalPaginas: number = 0;

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
        // Calcular total de páginas
        this.totalPaginas = Math.ceil(this.habitaciones.length / this.habitacionesPorPagina);
        this.filtrarHabitaciones(); // Filtrar habitaciones para mostrar las de la primera página
      },
      error: (error: any) => {
        console.error('Error al obtener las habitaciones', error);
      }
    });
  }

  agregarHabitacion(): void {
    this.apiService.addHabitacion(this.nuevaHabitacion).subscribe({
      next: (nuevaHabitacion: Habitacion) => {
        this.habitaciones.push(nuevaHabitacion);
<<<<<<< HEAD
        this.nuevaHabitacion = { IdHabitacion: 0, Edificio: '', Planta: '', NumeroHabitacion: '' };
        this.totalPaginas = Math.ceil(this.habitaciones.length / this.habitacionesPorPagina); // Recalcular total de páginas
        this.filtrarHabitaciones(); // Refrescar la vista paginada
=======
        this.nuevaHabitacion = { IdHabitacion: 0, Edificio: '', Planta: '', NumeroHabitacion: '', TipoCama: "" };
>>>>>>> 114d952f399ac69b48260d4d5011b0b3e6a4b20c
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
          this.filtrarHabitaciones(); // Actualizar la vista después de la actualización
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
        this.totalPaginas = Math.ceil(this.habitaciones.length / this.habitacionesPorPagina); // Recalcular total de páginas
        this.filtrarHabitaciones(); // Refrescar la vista después de borrar la habitación
      },
      error: (error: any) => {
        console.error('Error al borrar la habitación', error);
      }
    });
  }

  toggleActualizarHabitacion(habitacion: Habitacion): void {
    this.habitacionParaActualizar = habitacion;
  }

  // Método para filtrar habitaciones con paginación
  filtrarHabitaciones(): void {
    const inicio = (this.paginaActual - 1) * this.habitacionesPorPagina;
    const fin = inicio + this.habitacionesPorPagina;
    this.habitacionesFiltradas = this.habitaciones.slice(inicio, fin);
  }

  // Método para ir a la primera página
  irAPrimeraPagina(): void {
    this.paginaActual = 1;
    this.filtrarHabitaciones();
  }

  // Método para ir a la última página
  irALaUltimaPagina(): void {
    this.paginaActual = this.totalPaginas;
    this.filtrarHabitaciones();
  }

  // Método para ir a la página siguiente
  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.filtrarHabitaciones();
    }
  }

  // Método para ir a la página anterior
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.filtrarHabitaciones();
    }
  }
}
