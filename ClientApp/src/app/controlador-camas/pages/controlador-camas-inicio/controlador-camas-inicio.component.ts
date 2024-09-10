import { Component, OnInit } from '@angular/core';
import { ApiService, Paciente } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-controlador-camas-inicio',
  templateUrl: './controlador-camas-inicio.component.html',
  styleUrls: ['./controlador-camas-inicio.component.css']
})
export class ControladorCamasInicioComponent implements OnInit {
  pacientes: Paciente[] = [];
  errorMensaje: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarPacientesPendientesIngreso();
  }

  cargarPacientesPendientesIngreso(): void {
    this.apiService.getPacientesPendientesIngreso().subscribe({
      next: (pacientes: Paciente[]) => {
        this.pacientes = pacientes;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMensaje = 'Error al cargar los pacientes pendientes de ingreso.';
      }
    });
  }
}
