import { Component, OnInit } from '@angular/core';
import { ApiService, Ingreso, Paciente, Asignacion } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {
  ingresos: Ingreso[] = []; // Lista de pacientes ingresados
  errorMensaje: string | null = null;
  ingresoSeleccionado: Ingreso | null = null; // Paciente seleccionado para dar de alta

  // Datos del formulario "Dar de Alta"
  diagnostico: string = '';
  tratamiento: string = '';
  fechaLiberacion: string = ''; // Fecha de liberación de la cama

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.obtenerPacientesIngresados();
  }

  // Obtener los pacientes ingresados
  obtenerPacientesIngresados() {
    this.apiService.getIngresos(undefined, undefined, 'Ingresado').subscribe({
      next: (ingresos: Ingreso[]) => {
        if (ingresos.length > 0) {
          this.ingresos = ingresos;
          this.errorMensaje = null; 
        } else {
          this.ingresos = [];
          this.errorMensaje = 'No hay pacientes ingresados actualmente.';
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMensaje = 'Error al cargar los ingresos. Por favor, inténtalo de nuevo.';
        this.ingresos = [];
      }
    });
  }

  // Seleccionar un paciente para dar de alta
  darDeAlta(ingreso: Ingreso) {
    this.ingresoSeleccionado = ingreso;
  }

  // Confirmar el alta del paciente
  confirmarAlta() {
    if (!this.ingresoSeleccionado) {
      return;
    }

    const altaData = {
      IdHistorial: 0,
      IdPaciente: this.ingresoSeleccionado.IdPaciente,
      IdMedico: 6,
      Diagnostico: this.diagnostico,
      Tratamiento: this.tratamiento,
      FechaAlta: new Date(), 
      FechaLiberacion: new Date(),
    };

    this.apiService.addHistorialAlta(altaData).subscribe({
      next: () => {
        window.alert('Paciente dado de alta correctamente.');
        this.resetFormulario();
        this.obtenerPacientesIngresados(); // Actualizar la lista de ingresos
      },
      error: (err: any) => {
        window.alert('Error al dar de alta al paciente.');
      }
    });
  }

  // Resetear el formulario
  resetFormulario() {
    this.ingresoSeleccionado = null;
    this.diagnostico = '';
    this.tratamiento = '';
    this.fechaLiberacion = '';
  }
}
