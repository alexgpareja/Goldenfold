import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Ingreso } from '../../services/api.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {
  ingresos: Ingreso[] = [];
  nuevoIngreso: Ingreso = {
    IdIngreso: 0,
    IdPaciente: 0,
    IdMedico: 0,
    Motivo: '',
    FechaSolicitud: new Date(),
    FechaIngreso: new Date(),
    Estado: '',
    IdAsignacion: null
  };
  ingresoParaActualizar: Ingreso | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerIngresos();
  }

  obtenerIngresos(): void {
    this.apiService.getIngresos().subscribe({
      next: (data: Ingreso[]) => {
        this.ingresos = data;
      },
      error: (error: any) => {
        console.error('Error al obtener los ingresos', error);
      }
    });
  }

  agregarIngreso(): void {
    this.apiService.addIngreso(this.nuevoIngreso).subscribe({
      next: (nuevoIngreso: Ingreso) => {
        this.ingresos.push(nuevoIngreso);
        this.nuevoIngreso = {
          IdIngreso: 0,
          IdPaciente: 0,
          IdMedico: 0,
          Motivo: '',
          FechaSolicitud: new Date(),
          FechaIngreso: new Date(),
          Estado: '',
          IdAsignacion: null
        };
      },
      error: (error: any) => {
        console.error('Error al agregar el ingreso', error);
      }
    });
  }

  actualizarIngreso(): void {
    if (this.ingresoParaActualizar) {
      this.apiService.updateIngreso(this.ingresoParaActualizar).subscribe({
        next: (ingresoActualizado: Ingreso) => {
          const index = this.ingresos.findIndex(i => i.IdIngreso === ingresoActualizado.IdIngreso);
          if (index !== -1) {
            this.ingresos[index] = ingresoActualizado;
          }
          this.ingresoParaActualizar = null;
        },
        error: (error: any) => {
          console.error('Error al actualizar el ingreso', error);
        }
      });
    }
  }

  borrarIngreso(id: number): void {
    this.apiService.deleteIngreso(id).subscribe({
      next: () => {
        this.ingresos = this.ingresos.filter(i => i.IdIngreso !== id);
      },
      error: (error: any) => {
        console.error('Error al borrar el ingreso', error);
      }
    });
  }

  toggleActualizarIngreso(ingreso: Ingreso): void {
    this.ingresoParaActualizar = ingreso;
  }
}
