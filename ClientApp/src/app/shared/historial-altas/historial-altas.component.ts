import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, HistorialAlta } from '../../services/api.service';

@Component({
  selector: 'app-historial-altas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-altas.component.html',
  styleUrls: ['./historial-altas.component.css']
})
export class HistorialAltasComponent implements OnInit {
  historialAltas: HistorialAlta[] = [];
  nuevoHistorialAlta: HistorialAlta = {
    idHistorial: 0,
    idPaciente: 0,
    fechaAlta: new Date(),
    diagnostico: '',
    tratamiento: ''
  };
  historialAltaParaActualizar: HistorialAlta | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerHistorialAltas();
  }

  obtenerHistorialAltas(): void {
    this.apiService.getHistorialAltas().subscribe({
      next: (data: HistorialAlta[]) => {
        this.historialAltas = data;
      },
      error: (error: any) => {
        console.error('Error al obtener el historial de altas', error);
      }
    });
  }

  agregarHistorialAlta(): void {
    this.apiService.addHistorialAlta(this.nuevoHistorialAlta).subscribe({
      next: (nuevoHistorialAlta: HistorialAlta) => {
        this.historialAltas.push(nuevoHistorialAlta);
        this.nuevoHistorialAlta = {
          idHistorial: 0,
          idPaciente: 0,
          fechaAlta: new Date(),
          diagnostico: '',
          tratamiento: ''
        };
      },
      error: (error: any) => {
        console.error('Error al agregar el historial de alta', error);
      }
    });
  }

  toggleActualizarHistorialAlta(historialAlta: HistorialAlta): void {
    if (this.historialAltaParaActualizar && this.historialAltaParaActualizar.idHistorial === historialAlta.idHistorial) {
      this.historialAltaParaActualizar = null;
    } else {
      this.historialAltaParaActualizar = { ...historialAlta };
    }
  }

  actualizarHistorialAlta(): void {
    if (this.historialAltaParaActualizar) {
      this.apiService.updateHistorialAlta(this.historialAltaParaActualizar).subscribe({
        next: (historialAltaActualizado: HistorialAlta) => {
          const index = this.historialAltas.findIndex(ha => ha.idHistorial === historialAltaActualizado.idHistorial);
          if (index !== -1) {
            this.historialAltas[index] = historialAltaActualizado;
          }
          this.historialAltaParaActualizar = null;
        },
        error: (error: any) => {
          console.error('Error al actualizar el historial de alta', error);
        }
      });
    }
  }

  borrarHistorialAlta(id: number): void {
    this.apiService.deleteHistorialAlta(id).subscribe({
      next: () => {
        this.historialAltas = this.historialAltas.filter(historialAlta => historialAlta.idHistorial !== id);
      },
      error: (error: any) => {
        console.error('Error al borrar el historial de alta', error);
      }
    });
  }
}

