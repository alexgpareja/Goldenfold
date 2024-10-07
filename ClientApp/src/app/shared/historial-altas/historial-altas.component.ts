import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService, HistorialAlta, Paciente } from '../../services/api.service';
import { asyncPatientIdExistsValidator } from '../../validators/patientIdExistsValidator';
import { CustomValidators } from '../../validators';
import { asyncConsultaExistsValidator } from '../../validators/consultaExistsValidator';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-historial-altas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './historial-altas.component.html',
  styleUrls: ['./historial-altas.component.css']
})
export class HistorialAltasComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  historialAltas: MatTableDataSource<HistorialAlta> = new MatTableDataSource<HistorialAlta>();
  historialAltaForm!: FormGroup;
  historialAltaParaActualizar: HistorialAlta | null = null;

  pacientes: Paciente[] = [];
  fechaAltaFiltro: string | undefined;
  numSSFiltro: string = "";

   //columnas que se mostraran en la tabla
   displayedColumns: string[] = ['IdPaciente','FechaAlta','Diagnostico','Tratamiento', 'Acciones'];

  constructor(private apiService: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.obtenerHistorialAltas();
    this.obtenerPacientes();
    this.crearFormularioHistorialAlta();
    this.configurarValidaciones();
  }

  crearFormularioHistorialAlta(): void {
    this.historialAltaForm = this.fb.group({
      IdPaciente: ['', {
        validators: [Validators.required],
        asyncValidators: [asyncPatientIdExistsValidator(this.apiService), asyncConsultaExistsValidator(this.apiService)],
        updateOn: 'blur'
      }],
      FechaAlta: ['', [Validators.required, CustomValidators.noWhitespaceValidator()]],
      Diagnostico: ['', [Validators.required, CustomValidators.noWhitespaceValidator()]],
      Tratamiento: ['', [Validators.required, CustomValidators.noWhitespaceValidator()]]
    });
  }

  obtenerPacientes(): void {
    this.apiService.getPacientes().subscribe({
      next: (data: Paciente[]) => this.pacientes = data,
      error: (error: any) => this.handleError('Error al obtener pacientes', error)
    });
  }

  obtenerHistorialAltas(): void {
    this.apiService.getHistorialAltas().subscribe({
      next: (data: HistorialAlta[]) => {
        this.historialAltas.data = data;
        this.historialAltas.paginator = this.paginator;
        this.historialAltas.sort = this.sort;
      },
      error: (error: any) => this.handleError('Error al obtener el historial de altas', error)
    });
  }

  agregarHistorialAlta(): void {
    if (this.historialAltaForm.valid) {
      const nuevoHistorialAlta: HistorialAlta = {
        IdHistorial: 0, 
        IdPaciente: this.historialAltaForm.value.IdPaciente,
        IdMedico: 1,
        FechaAlta: this.historialAltaForm.value.FechaAlta,
        Diagnostico: this.historialAltaForm.value.Diagnostico,
        Tratamiento: this.historialAltaForm.value.Tratamiento
      };

      this.apiService.addHistorialAlta(nuevoHistorialAlta).subscribe({
        next: (nuevoHistorialAlta: HistorialAlta) => {
          this.historialAltas.data.push(nuevoHistorialAlta);
          this.historialAltaForm.reset();
          this.snackbar.showNotification('success', 'Historial de alta creado con éxito');
        },
        error: (error: any) => this.handleError('Error al agregar el historial de alta', error)
      });
    } else {
      this.snackbar.showNotification('error', 'Por favor, completa todos los campos requeridos.');
    }
  }

  filtrarHistoriales(event: { type: string; term: string }): void {
    const { term } = event;
    this.historialAltas.filter = term.trim().toLowerCase();

    if (this.historialAltas.paginator) {
        this.historialAltas.paginator.firstPage();
    }
}

  toggleActualizarHistorialAlta(historialAlta: HistorialAlta): void {
    if (this.historialAltaParaActualizar?.IdHistorial === historialAlta.IdHistorial) {
      this.historialAltaParaActualizar = null;
      this.historialAltaForm.reset();
    } else {
      this.historialAltaParaActualizar = { ...historialAlta };
      this.historialAltaForm.patchValue({
        IdPaciente: historialAlta.IdPaciente,
        FechaAlta: new Date(historialAlta.FechaAlta), 
        Diagnostico: historialAlta.Diagnostico,
        Tratamiento: historialAlta.Tratamiento
      });
      this.configurarValidaciones();
    }
  }

  actualizarHistorialAlta(): void {
    if (this.historialAltaParaActualizar && this.historialAltaForm.valid) {
      const historialAltaActualizado: HistorialAlta = { 
        ...this.historialAltaParaActualizar, 
        ...this.historialAltaForm.value,
        FechaAlta: this.historialAltaForm.value.FechaAlta instanceof Date 
          ? this.historialAltaForm.value.FechaAlta.toISOString() 
          : new Date(this.historialAltaForm.value.FechaAlta).toISOString()
      };
  
  
      this.apiService.updateHistorialAlta(historialAltaActualizado).subscribe({
        next: () => {
          this.obtenerHistorialAltas();
          this.historialAltaParaActualizar = null;
          this.historialAltaForm.reset();
          this.snackbar.showNotification('success', 'Historial de alta actualizado con éxito');
        },
        error: (error: any) => {
          this.handleError('Error al actualizar el historial de alta', error);
        }
      });
    } else {
      this.snackbar.showNotification('error', 'Por favor, completa todos los campos requeridos.');
    }
  }
  
  borrarHistorialAlta(id: number): void {
    this.apiService.deleteHistorialAlta(id).subscribe({
      next: () => {
        this.historialAltas.data = this.historialAltas.data.filter(historial => historial.IdHistorial !== id);
        this.snackbar.showNotification('success', 'Historial de alta eliminado con éxito.');
      },
      error: (error: any) => this.handleError('Error al borrar el historial de alta', error)
    });
  }

  filtrarPorNumeroSS(): void {
    const filtroSS = this.numSSFiltro.trim().toLowerCase(); 

    if (filtroSS.length > 0) {
      this.historialAltas.data = this.historialAltas.data.filter(historial => {
        const paciente = this.getPacienteById(historial.IdPaciente);
        return paciente?.SeguridadSocial?.toLowerCase().includes(filtroSS) ?? false; 
      });
    }
  }

  getPacienteById(idPaciente: number): Paciente | undefined {
    return this.pacientes.find(paciente => paciente.IdPaciente === idPaciente);
  }

  configurarValidaciones(): void {
    const idPacienteControl = this.historialAltaForm.get('IdPaciente');
    if (!this.historialAltaParaActualizar) {
      idPacienteControl?.setAsyncValidators([asyncPatientIdExistsValidator(this.apiService), asyncConsultaExistsValidator(this.apiService)]);
    } else {
      idPacienteControl?.clearAsyncValidators();
    }
    idPacienteControl?.updateValueAndValidity();
  }

  handleError(message: string, error: any): void {
    console.error(message, error);
    this.snackbar.showNotification('error', message);
  }
}
