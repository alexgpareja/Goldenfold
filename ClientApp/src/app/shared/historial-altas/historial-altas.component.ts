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
  historialAltasPaginadas: HistorialAlta[] = [];
  nuevoHistorialAlta: HistorialAlta = this.inicializarHistorialAlta();
  historialAltaParaActualizar: HistorialAlta | null = null;

  paginaActual: number = 1;
  historialAltasPorPagina: number = 8;
  totalPaginas: number = 0;
  columnaOrdenada: keyof HistorialAlta | null = null;
  orden: 'asc' | 'desc' = 'asc';
  filtro: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerHistorialAltas();
  }

  inicializarHistorialAlta(): HistorialAlta {
    return {
      IdHistorial: 0,
      IdPaciente: 0,
      IdMedico: 0,
      FechaAlta: new Date(),
      Diagnostico: '',
      Tratamiento: ''
    };
  }

  obtenerHistorialAltas(): void {
    this.apiService.getHistorialAltas().subscribe({
      next: (data: HistorialAlta[]) => {
        this.historialAltas = data;
        this.calcularTotalPaginasYActualizar();
      },
      error: (error: any) => {
        console.error('Error al obtener el historial de altas', error);
      }
    });
  }

  calcularTotalPaginasYActualizar(): void {
    this.totalPaginas = Math.ceil(this.historialAltas.length / this.historialAltasPorPagina);
    this.actualizarHistorialAltasPaginados();
  }

  actualizarHistorialAltasPaginados(): void {
    let historialAltasFiltrados = this.historialAltas.filter(ha =>
      ha.Diagnostico.toLowerCase().includes(this.filtro.toLowerCase()) ||
      ha.Tratamiento.toLowerCase().includes(this.filtro.toLowerCase())
    );

    if (this.columnaOrdenada) {
      historialAltasFiltrados.sort((a, b) => {
        const valorA = a[this.columnaOrdenada!];
        const valorB = b[this.columnaOrdenada!];
        return (valorA < valorB ? -1 : valorA > valorB ? 1 : 0) * (this.orden === 'asc' ? 1 : -1);
      });
    }

    const inicio = (this.paginaActual - 1) * this.historialAltasPorPagina;
    this.historialAltasPaginadas = historialAltasFiltrados.slice(inicio, inicio + this.historialAltasPorPagina);
  }

  cambiarPagina(incremento: number): void {
    const nuevaPagina = this.paginaActual + incremento;
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarHistorialAltasPaginados();
    }
  }

  paginaAnterior(): void {
    this.cambiarPagina(-1);
  }

  paginaSiguiente(): void {
    this.cambiarPagina(1);
  }

  agregarHistorialAlta(): void {
    this.apiService.addHistorialAlta(this.nuevoHistorialAlta).subscribe({
      next: (nuevoHistorialAlta: HistorialAlta) => {
        this.historialAltas.push(nuevoHistorialAlta);
        this.calcularTotalPaginasYActualizar();
        this.nuevoHistorialAlta = this.inicializarHistorialAlta();
      },
      error: (error: any) => {
        console.error('Error al agregar el historial de alta', error);
      }
    });
  }

  toggleActualizarHistorialAlta(historialAlta: HistorialAlta): void {
    this.historialAltaParaActualizar = this.historialAltaParaActualizar?.IdHistorial === historialAlta.IdHistorial
      ? null
      : { ...historialAlta };
  }

  actualizarHistorialAlta(): void {
    if (this.historialAltaParaActualizar) {
      this.apiService.updateHistorialAlta(this.historialAltaParaActualizar).subscribe({
        next: (historialAltaActualizado: HistorialAlta) => {
          const index = this.historialAltas.findIndex(ha => ha.IdHistorial === historialAltaActualizado.IdHistorial);
          if (index !== -1) {
            this.historialAltas[index] = historialAltaActualizado;
            this.calcularTotalPaginasYActualizar();
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
        this.historialAltas = this.historialAltas.filter(historialAlta => historialAlta.IdHistorial !== id);
        this.calcularTotalPaginasYActualizar();
      },
      error: (error: any) => {
        console.error('Error al borrar el historial de alta', error);
      }
    });
  }

  ordenar(columna: keyof HistorialAlta): void {
    this.columnaOrdenada = this.columnaOrdenada === columna ? columna : columna;
    this.orden = this.columnaOrdenada === columna && this.orden === 'asc' ? 'desc' : 'asc';
    this.actualizarHistorialAltasPaginados();
  }

  aplicarFiltro(filtro: string): void {
    this.filtro = filtro;
    this.actualizarHistorialAltasPaginados();
  }
}
