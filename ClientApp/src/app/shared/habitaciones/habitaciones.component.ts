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
  nuevaHabitacion: Habitacion = { idHabitacion: 0, edificio: '', planta: '', numeroHabitacion: '' };
  habitacionParaActualizar: Habitacion | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerHabitaciones();
  }

  obtenerHabitaciones(): void {
    this.apiService.getHabitaciones().subscribe({
      next: (data: any[]) => {
        this.habitaciones = data.map(item => ({
          idHabitacion: item.idHabitacion,
          edificio: item.edificio,
          planta: item.planta,
          numeroHabitacion: item.numeroHabitacion
        }));
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
        this.nuevaHabitacion = { idHabitacion: 0, edificio: '', planta: '', numeroHabitacion: '' };
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
          const index = this.habitaciones.findIndex(h => h.idHabitacion === habitacionActualizada.idHabitacion);
          if (index !== -1) {
            this.habitaciones[index] = habitacionActualizada;
          }
          this.habitacionParaActualizar = null; // Reset the update form
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
        this.habitaciones = this.habitaciones.filter(h => h.idHabitacion !== id);
      },
      error: (error: any) => {
        console.error('Error al borrar la habitación', error);
      }
    });
  }

  toggleActualizarHabitacion(habitacion: Habitacion): void {
    this.habitacionParaActualizar = habitacion;
  }
}
