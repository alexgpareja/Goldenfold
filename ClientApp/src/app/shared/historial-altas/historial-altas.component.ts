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
  nuevoHistorialAlta: HistorialAlta = {
    idHistorial: 0,
    idPaciente: 0,
    fechaAlta: new Date(),
    diagnostico: '',
    tratamiento: ''
  };
  historialAltaParaActualizar: HistorialAlta | null = null;

  paginaActual: number = 1;
  historialAltasPorPagina: number = 5;
  totalPaginas: number = 0;
  columnaOrdenada: keyof HistorialAlta | null = null;
  orden: 'asc' | 'desc' = 'asc';
  filtro: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerHistorialAltas();
  }

  obtenerHistorialAltas(): void {
    this.apiService.getHistorialAltas().subscribe({
      next: (data: HistorialAlta[]) => {
        this.historialAltas = data;
        this.totalPaginas = Math.ceil(this.historialAltas.length / this.historialAltasPorPagina);
        this.actualizarHistorialAltasPaginados();
      },
      error: (error: any) => {
        console.error('Error al obtener el historial de altas', error);
      }
    });
  }

  actualizarHistorialAltasPaginados(): void {
    let historialAltasFiltrados = this.historialAltas.filter(ha =>
      ha.diagnostico.toLowerCase().includes(this.filtro.toLowerCase()) ||
      ha.tratamiento.toLowerCase().includes(this.filtro.toLowerCase())
    );

    if (this.columnaOrdenada) {
      historialAltasFiltrados = historialAltasFiltrados.sort((a, b) => {
        const valorA = a[this.columnaOrdenada!];
        const valorB = b[this.columnaOrdenada!];

        if (valorA < valorB) {
          return this.orden === 'asc' ? -1 : 1;
        }
        if (valorA > valorB) {
          return this.orden === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const inicio = (this.paginaActual - 1) * this.historialAltasPorPagina;
    const fin = inicio + this.historialAltasPorPagina;
    this.historialAltasPaginadas = historialAltasFiltrados.slice(inicio, fin);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarHistorialAltasPaginados();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarHistorialAltasPaginados();
    }
  }

  agregarHistorialAlta(): void {
    this.apiService.addHistorialAlta(this.nuevoHistorialAlta).subscribe({
      next: (nuevoHistorialAlta: HistorialAlta) => {
        this.historialAltas.push(nuevoHistorialAlta);
        this.totalPaginas = Math.ceil(this.historialAltas.length / this.historialAltasPorPagina);
        this.actualizarHistorialAltasPaginados();
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
            this.totalPaginas = Math.ceil(this.historialAltas.length / this.historialAltasPorPagina);
            this.actualizarHistorialAltasPaginados();
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
        this.totalPaginas = Math.ceil(this.historialAltas.length / this.historialAltasPorPagina);
        this.actualizarHistorialAltasPaginados();
      },
      error: (error: any) => {
        console.error('Error al borrar el historial de alta', error);
      }
    });
  }

  ordenar(columna: keyof HistorialAlta): void {
    if (this.columnaOrdenada === columna) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.columnaOrdenada = columna;
      this.orden = 'asc';
    }
    this.actualizarHistorialAltasPaginados();
  }

  aplicarFiltro(filtro: string): void {
    this.filtro = filtro;
    this.actualizarHistorialAltasPaginados();
  }
}
