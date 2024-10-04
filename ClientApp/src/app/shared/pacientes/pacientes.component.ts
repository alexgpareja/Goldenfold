import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService, Paciente } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogFormularioComponent } from '../dialog-formulario/dialog-formulario.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['IdPaciente', 'Nombre', 'Dni', 'FechaNacimiento', 'Estado', 'FechaRegistro', 'SeguridadSocial', 'acciones'];
  dataSource = new MatTableDataSource<Paciente>([]);
  totalItems = 0;
  itemsPerPage = 300;
  pageIndex = 0;

  pacientes: Paciente[] = [];
  nuevoPaciente: Paciente;
  notificacion: string | null = null;  // Variable para notificaciones

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pacienteSeleccionado: Paciente | null = null;

  constructor(private apiService: ApiService, public dialog: MatDialog) {
    this.nuevoPaciente = {
      IdPaciente: 0,
      Nombre: '',
      Dni: '',
      FechaNacimiento: new Date(),
      Estado: 'Registrado',
      FechaRegistro: new Date(),
      SeguridadSocial: '',
      Direccion: '',
      Telefono: '',
      Email: '',
      HistorialMedico: ''
    };
  }

  ngOnInit(): void {
    this.obtenerPacientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerPacientes(): void {
    this.apiService.getPacientes().subscribe((data: Paciente[]) => {
      this.pacientes = data;
      this.totalItems = data.length;
      this.actualizarPagina(0, this.itemsPerPage);
    });
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.actualizarPagina(this.pageIndex, this.itemsPerPage);
  }

  actualizarPagina(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.dataSource.data = this.pacientes.slice(startIndex, endIndex);
  }

  filtrarPacientes(event: { type: string; term: string }): void {
    const { term } = event;
    this.dataSource.filter = term.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Mostrar el formulario para actualizar paciente
  toggleActualizarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = { ...paciente };
    this.dialog.open(DialogFormularioComponent, {
      data: this.pacienteSeleccionado
    }).afterClosed().subscribe((pacienteActualizado) => {
      if (pacienteActualizado) {
        this.pacienteSeleccionado = pacienteActualizado;
        this.actualizarPaciente();
      }
    });
  }

  toggleFormularioAgregar(): void {
    this.nuevoPaciente = {
      IdPaciente: 0,
      Nombre: '',
      Dni: '',
      FechaNacimiento: new Date(),
      Estado: 'Registrado',
      FechaRegistro: new Date(),
      SeguridadSocial: '',
      Direccion: '',
      Telefono: '',
      Email: '',
      HistorialMedico: ''
    };
    this.dialog.open(DialogFormularioComponent, {
      data: this.nuevoPaciente
    }).afterClosed().subscribe((pacienteCreado) => {
      if (pacienteCreado) {
        this.guardarPaciente();
      }
    });
  }

  cerrarFormulario(): void {
    this.pacienteSeleccionado = null;
  }

  borrarPaciente(id: number): void {
    this.apiService.deletePaciente(id).subscribe(() => {
      this.obtenerPacientes();
      this.notificacion = 'Paciente borrado con éxito';
      this.ocultarNotificacion();
    });
  }

  guardarPaciente(): void {
    this.apiService.addPaciente(this.nuevoPaciente).subscribe(() => {
      this.obtenerPacientes();
      this.cerrarFormulario();
      this.notificacion = 'Paciente guardado con éxito';
      this.ocultarNotificacion();
    }, error => {
      console.error('Error al guardar paciente', error);
    });
  }

  actualizarPaciente(): void {
    if (this.pacienteSeleccionado) {
      this.apiService.updatePaciente(this.pacienteSeleccionado).subscribe(() => {
        this.obtenerPacientes();
        this.cerrarFormulario();
        this.notificacion = 'Paciente actualizado con éxito';
        this.ocultarNotificacion();
      }, error => {
        console.error('Error al actualizar paciente', error);
      });
    }
  }

  // Función para ocultar la notificación después de 2 segundos
  private ocultarNotificacion(): void {
    setTimeout(() => {
      this.notificacion = null;
    }, 2000);
  }
}
