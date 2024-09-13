import { Component } from '@angular/core';
import { ApiService, Consulta, Ingreso } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-consultas-programadas',
  templateUrl: './consultas-programadas.component.html',
  styleUrls: ['./consultas-programadas.component.css']
})
export class ConsultasProgramadasComponent {
  consultasPendientes: Consulta[] = [];
  errorMensaje: string | null = null;
  consultaSeleccionada: Consulta | null = null; // Para seleccionar la consulta a evaluar
  tipoCamaSeleccionado: string = 'General'; // Opción por defecto

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.obtenerConsultasPendientes();
  }

  obtenerConsultasPendientes() {
    const idMedico = 8; // ID fijo del médico, que puede cambiar más tarde
    this.apiService.getConsultas(undefined, idMedico, 'pendiente de consultar').subscribe({
      next: (consultas: Consulta[]) => {
        this.consultasPendientes = consultas;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMensaje = 'Error al cargar las consultas. Por favor, inténtalo de nuevo.';
      }
    });
  }

  // Seleccionar una consulta para evaluar
  evaluar(consulta: Consulta) {
    this.consultaSeleccionada = consulta;
  }

  // Dar de alta sin ingreso: actualizar el estado del paciente y crear historial
  darAlta(idPaciente: number) {
    this.apiService.updatePacienteEstado(idPaciente, 'Alta').subscribe({
      next: () => {
        // Agregar nuevo registro al historial de altas
        this.apiService.addHistorialAlta({
          IdHistorial: 0,
          IdPaciente: 0,
          FechaAlta: new Date(),
          Diagnostico: 'Alta médica sin ingreso',
          Tratamiento: 'Seguimiento ambulatorio'
        }).subscribe(() => {
          alert('Paciente dado de alta con éxito.');
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMensaje = 'Error al dar de alta al paciente.';
      }
    });
  }
  

solicitarIngreso(idPaciente: number, tipoCama: string) {
  const nuevoIngreso: Ingreso = {
    IdIngreso: 0,
    IdPaciente: idPaciente,
    IdMedico: 8, // Esto puede ser dinámico según la sesión
    Motivo: 'Requiere ingreso en ' + tipoCama,
    FechaSolicitud: new Date(),
    Estado: 'pendiente',
    IdAsignacion: null  // La cama aún no ha sido asignada
  };

  this.apiService.addIngreso(nuevoIngreso).subscribe({
    next: () => {
      alert('Ingreso solicitado con éxito.');
    },
    error: (error: HttpErrorResponse) => {
      this.errorMensaje = 'Error al solicitar el ingreso.';
    }
  });
}

  
}
