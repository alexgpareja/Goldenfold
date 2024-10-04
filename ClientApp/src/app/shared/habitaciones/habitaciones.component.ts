import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Habitacion } from '../../services/api.service';
import { SnackbarComponent } from '../snackbar/snackbar.component'; // Importar el componente standalone

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, SnackbarComponent], // Importar el SnackbarComponent standalone
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css'],
})
export class HabitacionesComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;  // Referencia al snackbar

  habitaciones: Habitacion[] = [];
  habitacionesPaginas: Habitacion[] = [];
  nuevaHabitacion: Habitacion = {
    IdHabitacion: 0,
    Edificio: '',
    Planta: '',
    NumeroHabitacion: '',
    TipoCama: '',
  };
  habitacionParaActualizar: Habitacion | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerHabitaciones();
  }

  obtenerHabitaciones(): void {
    this.apiService.getHabitaciones().subscribe({
      next: (data: any[]) => {
        this.habitaciones = data.map((item) => ({
          IdHabitacion: item.IdHabitacion,
          Edificio: item.Edificio,
          Planta: item.Planta,
          NumeroHabitacion: item.NumeroHabitacion,
          TipoCama: item.TipoCama,
        }));
      },
      error: (error: any) => {
        console.error('Error al obtener las habitaciones', error);
        this.snackbar.showNotification('error', 'Error al obtener las habitaciones');  // Mostrar notificación de error
      },
    });
  }

  agregarHabitacion(): void {
    this.apiService.addHabitacion(this.nuevaHabitacion).subscribe({
      next: (nuevaHabitacion: Habitacion) => {
        this.habitaciones.push(nuevaHabitacion);
        this.nuevaHabitacion = {
          IdHabitacion: 0,
          Edificio: '',
          Planta: '',
          NumeroHabitacion: '',
          TipoCama: '',
        };
        this.snackbar.showNotification('success', 'Habitación agregada exitosamente');  // Mostrar notificación de éxito
      },
      error: (error: any) => {
        console.error('Error al agregar la habitación', error);
        this.snackbar.showNotification('error', 'Error al agregar la habitación');  // Mostrar notificación de error
      },
    });
  }

  actualizarHabitacion(): void {
    if (this.habitacionParaActualizar) {
      this.apiService
        .updateHabitacion(this.habitacionParaActualizar)
        .subscribe({
          next: (habitacionActualizada: Habitacion) => {
            const index = this.habitaciones.findIndex(
              (h) => h.IdHabitacion === habitacionActualizada.IdHabitacion
            );
            if (index !== -1) {
              this.snackbar.showNotification('success', 'Habitación actualizada correctamente');
              this.habitaciones[index] = habitacionActualizada;
            }
            this.habitacionParaActualizar = null;
              // Mostrar notificación de éxito
          },
          error: (error: any) => {
            console.error('Error al actualizar la habitación', error);
            this.snackbar.showNotification('error', 'Error al actualizar la habitación');  // Mostrar notificación de error
          },
        });
    }
  }

  borrarHabitacion(id: number): void {
    this.apiService.deleteHabitacion(id).subscribe({
      next: () => {
        this.habitaciones = this.habitaciones.filter(
          (h) => h.IdHabitacion !== id
        );
        this.snackbar.showNotification('success', 'Habitación borrada correctamente');  // Mostrar notificación de éxito
      },
      error: (error: any) => {
        console.error('Error al borrar la habitación', error);
        this.snackbar.showNotification('error', 'Error al borrar la habitación');  // Mostrar notificación de error
      },
    });
  }

  toggleActualizarHabitacion(habitacion: Habitacion): void {
    this.habitacionParaActualizar = habitacion;
  }
}
