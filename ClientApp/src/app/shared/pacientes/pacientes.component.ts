import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core'; // Asegúrate de importar Inject
import { ApiService, Paciente } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog} from '@angular/material/dialog'; 
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
  displayedColumns: string[] = ['IdPaciente','Nombre','Dni','FechaNacimiento','Estado','FechaRegistro','SeguridadSocial','acciones'];
  dataSource = new MatTableDataSource<Paciente>([]);
  totalItems = 0;
  itemsPerPage = 10;
  nuevoPaciente: Paciente = {
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pacienteSeleccionado: Paciente | null = null;
  mostrarFormularioActualizar: boolean = false;
  mostrarFormularioAgregar: boolean = false;

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerPacientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Obtener la lista de pacientes desde el servicio
  obtenerPacientes(): void {
    this.apiService.getPacientes().subscribe((data: Paciente[]) => {
      this.dataSource.data = data;
      this.totalItems = data.length;
    });
  }

  // Cambiar la página en la tabla
  onPaginateChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.dataSource.data.slice(startIndex, endIndex);
  }

  // Mostrar el formulario para actualizar paciente
  toggleActualizarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = { ...paciente };  
    this.mostrarFormularioActualizar = true;
    this.mostrarFormularioAgregar = false;
    this.dialog.open(DialogFormularioComponent, {
      data: this.pacienteSeleccionado
    }).afterClosed().subscribe(() => {
      this.obtenerPacientes(); 
    });
  }

  // Mostrar el formulario para agregar nuevo paciente
  toggleFormularioAgregar(): void {
    this.mostrarFormularioAgregar = true;
    this.mostrarFormularioActualizar = false;
    this.nuevoPaciente = { // Limpiar formulario
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
    this.mostrarFormularioActualizar = false;
    this.mostrarFormularioAgregar = false;
    this.pacienteSeleccionado = null;
  }

  // Eliminar paciente
  borrarPaciente(id: number): void {
    this.apiService.deletePaciente(id).subscribe(() => {
      this.obtenerPacientes(); 
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

  // Guardar un nuevo paciente
  guardarPaciente(): void {
    this.apiService.addPaciente(this.nuevoPaciente).subscribe(() => {
      this.obtenerPacientes();
      this.cerrarFormulario();
    });
  }
}


