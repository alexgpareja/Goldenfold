import { Component } from '@angular/core';
import { ApiService, Consulta } from '../../../services/api.service';
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
  formularioSeleccionado: 'alta' | 'ingreso' | null = null; // Para elegir qué formulario mostrar

  // Datos del formulario "Dar de Alta"
  diagnostico: string = '';
  tratamiento: string = '';

  // Datos del formulario "Solicitar Ingreso"
  tipoCama: string = '';
  motivoIngreso: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.obtenerConsultasPendientes();
  }
  
  obtenerConsultasPendientes() {
    const IdMedico = 6; // ID fijo del médico, que puede cambiar más tarde
    this.apiService.getConsultas(undefined, IdMedico, 'pendiente').subscribe({
      next: (consultas: Consulta[]) => {
        if (consultas.length > 0) {
          this.consultasPendientes = consultas;
          this.errorMensaje = null; // Limpiar mensaje de error si hay consultas
        } else {
          this.consultasPendientes = [];
          this.errorMensaje = 'No hay consultas pendientes para este médico.'; // Mostrar mensaje si no hay consultas
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMensaje = 'No hay consultas pendientes para este médico.'; // Mensaje amigable en caso de error 404
        } else {
          this.errorMensaje = 'Error al cargar las consultas. Por favor, inténtalo de nuevo.';
        }
        this.consultasPendientes = []; 
      }
    });
  }
  

  // Seleccionar una consulta para evaluar
  evaluar(consulta: Consulta) {
    this.consultaSeleccionada = consulta;
    this.formularioSeleccionado = null; // Ocultar cualquier formulario anterior
  }

  // Mostrar el formulario seleccionado
  mostrarFormulario(tipo: 'alta' | 'ingreso') {
    this.formularioSeleccionado = tipo;
  }

  darDeAlta() {
    if (!this.consultaSeleccionada) {
      console.error('No hay consulta seleccionada');
      return;
    }
  
    // Crear el objeto de historial de alta
    const historialAlta = {
      IdHistorial: 0,
      IdPaciente: this.consultaSeleccionada.IdPaciente,
      IdMedico: 6, // ID del médico, puedes ajustarlo según corresponda
      Diagnostico: this.diagnostico,
      Tratamiento: this.tratamiento,
      FechaAlta: new Date() // Puedes ajustar la fecha si es necesario
    };
  
    // Paso 1: Crear el historial de alta, el estado de la consulta se actualiza en el backend
    this.apiService.addHistorialAlta(historialAlta).subscribe({
      next: (response) => {
        console.log('Historial de alta creado y consulta completada:', response);
        
        // Mostrar una alerta de éxito
        window.alert('Paciente dado de alta correctamente');
  
        // Limpiar el formulario después de la operación
        this.resetFormulario();
  
        // Volver a cargar las consultas pendientes
        this.obtenerConsultasPendientes();
      },
      error: (err) => {
        console.error('Error al crear el historial de alta:', err);
        window.alert('Hubo un error al dar de alta al paciente.');
      }
    });
  }
  

  // Lógica para "Solicitar Ingreso" del paciente
  solicitarIngreso() {
    console.log('Ingreso solicitado:', this.tipoCama, this.motivoIngreso);
    // Aquí puedes añadir la lógica para enviar estos datos a la API
    // Ejemplo:
    // this.apiService.solicitarIngreso(this.consultaSeleccionada.id, this.tipoCama, this.motivoIngreso)
    //   .subscribe(...);
    this.resetFormulario(); // Limpiar el formulario tras el ingreso
  }

  // Método para resetear el formulario y volver al estado inicial
  resetFormulario() {
    this.consultaSeleccionada = null;
    this.formularioSeleccionado = null;
    this.diagnostico = '';
    this.tratamiento = '';
    this.tipoCama = '';
    this.motivoIngreso = '';
  }
}
