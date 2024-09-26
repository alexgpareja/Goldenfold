import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, HistorialAlta, Paciente } from '../../services/api.service';

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
  historialAltasPorPagina: number = 5;
  totalPaginas: number = 0;
  columnaOrdenada: keyof HistorialAlta | null = null;
  orden: 'asc' | 'desc' = 'asc';
  filtro: string = ''; 
  fechaAltaFiltro: string | undefined;
  notificacion: string | null = null;

  historialSeleccionado: HistorialAlta | null = null;
  mostrarFormularioActualizar: boolean = false;
  numSSFiltro : string = "";
  pacientes: Paciente[] = []; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerHistorialAltas();
    this.obtenerPacientes();
  }

  inicializarHistorialAlta(): HistorialAlta {
    return {
      IdHistorial: 0,
      IdPaciente: 0,
      IdMedico: 1,
      FechaAlta: new Date(),
      Diagnostico: '',
      Tratamiento: ''
    };
  }

  obtenerPacientes() {
    this.apiService.getPacientes().subscribe({
        next: (data: Paciente[]) => {
            this.pacientes = data;
            console.log('Pacientes:', this.pacientes);
        },
        error: (error: any) => {
            console.error('Error al obtener pacientes', error);
        }
    });
}


  filtrarPorFecha() {
    if (this.fechaAltaFiltro) {
      this.historialAltasPaginadas = this.historialAltas.filter(historial => {
        //convertir la fecha del historial a formato YYYY-MM-DD
        const fechaHistorial = new Date(historial.FechaAlta).toISOString().slice(0, 10);
        return fechaHistorial === this.fechaAltaFiltro;
      });
    } else {
      this.historialAltasPaginadas = [...this.historialAltas];
    }
  }
  
  filtrarPorNumeroSS(): void {
    const filtroSS = this.numSSFiltro.trim().toLowerCase(); // Normalize input for case insensitive comparison

    if (filtroSS.length > 0) {
        // Filter historialAltas based on the associated patient's SeguridadSocial
        this.historialAltasPaginadas = this.historialAltas.filter(historial => {
            const paciente = this.getPacienteById(historial.IdPaciente);
            return paciente && paciente.SeguridadSocial && 
                   paciente.SeguridadSocial.toLowerCase().includes(filtroSS); 
        }); 
        console.log(this.historialAltasPaginadas);
    } else {
        this.historialAltasPaginadas = [...this.historialAltas];
    }

    this.calcularTotalPaginasYActualizar();  // Recalculate pagination after filtering
  }

  getPacienteById(idPaciente: number): Paciente | undefined {
    // Look for the patient by their ID in the pacientes array
    return this.pacientes.find(paciente => paciente.IdPaciente === idPaciente);
  }
  aplicarFiltros(): void {
   //para poder filtrar por varios filtros
  }
  obtenerHistorialAltas(): void {
    this.apiService.getHistorialAltas().subscribe({
      next: (data: HistorialAlta[]) => {
        this.historialAltas = data;
        this.historialAltasPaginadas = [...this.historialAltas]
        this.calcularTotalPaginasYActualizar();
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
          this.obtenerHistorialAltas();
          this.historialAltaParaActualizar = null;
          this.mostrarFormularioActualizar = false;
          this.notificacion = "Historial Alta actualizado con éxito"
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

  cerrarPopup(): void {
    this.historialSeleccionado = null;
  }

  calcularTotalPaginasYActualizar(): void {
    this.totalPaginas = Math.ceil(this.historialAltas.length / this.historialAltasPorPagina);
    this.actualizarHistorialAltasPaginados();
  }

  actualizarHistorialAltasPaginados(): void {
    /*let historialAltasFiltrados = this.historialAltas.filter(ha =>
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
  */
    const inicio = (this.paginaActual - 1) * this.historialAltasPorPagina;
    this.historialAltasPaginadas = this.historialAltasPaginadas.slice(inicio, inicio + this.historialAltasPorPagina);
  }

  cambiarPagina(incremento: number): void {
    const nuevaPagina = this.paginaActual + incremento;
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarHistorialAltasPaginados();
    }
  if(this.historialAltasPaginadas.length === 0 && this.paginaActual > 1){
    this.paginaActual--;
    this.obtenerHistorialAltas();
  }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerHistorialAltas();
    }
  }
  irAPrimeraPagina(): void {
    this.paginaActual = 1;
    this.obtenerHistorialAltas();
  }

  irALaUltimaPagina(): void {
    this.paginaActual = this.totalPaginas;
    this.obtenerHistorialAltas();
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.obtenerHistorialAltas();
    }
  }

}
