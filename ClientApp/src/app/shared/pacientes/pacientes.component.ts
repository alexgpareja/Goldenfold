import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService, Paciente } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
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

  // Variables relacionadas con la tabla y los datos
  displayedColumns: string[] = ['IdPaciente', 'Nombre', 'Dni', 'FechaNacimiento', 'Estado', 'FechaRegistro', 'SeguridadSocial', 'acciones'];
  dataSource = new MatTableDataSource<Paciente>([]); // Esta solo contendrá los datos visibles
  totalItems = 0; // Número total de pacientes
  itemsPerPage = 300; // Tamaño de página
  pageIndex = 0; // Índice de la página actual

  pacientes: Paciente[] = []; // Aquí almacenaremos todos los pacientes recibidos
  nuevoPaciente: Paciente; // Para manejar el nuevo paciente

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pacienteSeleccionado: Paciente | null = null; // Paciente seleccionado para editar o actualizar

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
    this.dataSource.sort = this.sort; // Conectar el ordenamiento
  }

  // Obtener todos los pacientes
  obtenerPacientes(): void {
    this.apiService.getPacientes().subscribe((data: Paciente[]) => {
      this.pacientes = data;  // Almacena todos los pacientes
      this.totalItems = data.length; // Configura el total de pacientes
      this.actualizarPagina(0, this.itemsPerPage);  // Mostrar la primera página
    });
  }

  // Controlar la paginación localmente
  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.actualizarPagina(this.pageIndex, this.itemsPerPage);
  }

  // Actualizar los datos que se muestran según la página actual
  actualizarPagina(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.dataSource.data = this.pacientes.slice(startIndex, endIndex);  // Mostrar los datos paginados
  }

  // Filtrar pacientes desde el searchbox
  filtrarPacientes(event: { type: string; term: string }): void {
    const { term } = event;
    this.dataSource.filter = term.trim().toLowerCase(); // Aplicar el filtro
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Resetea a la primera página si se aplica un filtro
    }
  }

  // Mostrar el formulario para actualizar paciente
  toggleActualizarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = { ...paciente };
    this.dialog.open(DialogFormularioComponent, {
      data: this.pacienteSeleccionado
    }).afterClosed().subscribe(() => {
      this.obtenerPacientes(); // Refrescar la tabla tras actualizar
    });
  }

  // Mostrar el formulario para agregar nuevo paciente
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
    }).afterClosed().subscribe(() => {
      this.obtenerPacientes();  // Refrescar la tabla tras agregar
    });
  }

  // Cerrar el formulario
  cerrarFormulario(): void {
    this.pacienteSeleccionado = null;
  }

  // Eliminar paciente
  borrarPaciente(id: number): void {
    this.apiService.deletePaciente(id).subscribe(() => {
      this.obtenerPacientes(); // Refrescar la tabla tras borrar
    });
  }

  // Guardar un nuevo paciente
  guardarPaciente(): void {
    this.apiService.addPaciente(this.nuevoPaciente).subscribe(() => {
      this.obtenerPacientes();
      this.cerrarFormulario();
    });
  }

  // Actualizar el paciente seleccionado
  actualizarPaciente(): void {
    if (this.pacienteSeleccionado) {
      this.apiService.updatePaciente(this.pacienteSeleccionado).subscribe(() => {
        this.obtenerPacientes();
        this.cerrarFormulario();
      });
    }
  }

}
