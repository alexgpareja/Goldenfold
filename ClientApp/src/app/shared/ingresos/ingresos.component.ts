import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService, Ingreso, Paciente, Usuario } from '../../services/api.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent implements OnInit {
  ingresos: Ingreso[] = [];
  pacientes: Paciente[] = [];
  medicos: Usuario[] = [];
  ingresoForm!: FormGroup;
  ingresoParaActualizar: Ingreso | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerIngresos();
    this.crearFormularioIngreso();
    this.obtenerPacientes();
    this.obtenerMedicos();
  }

  crearFormularioIngreso(): void{
    this.ingresoForm = new FormGroup({
      IdIngreso: new FormControl(0),
      IdPaciente: new FormControl(0),
      IdMedico: new FormControl(0),
      Motivo: new FormControl(''),
      FechaSolicitud: new FormControl(new Date()),
      FechaIngreso: new FormControl (null),
      Estado: new FormControl(''),
      TipoCama: new FormControl(''),
      IdAsignacion: new FormControl(null)
    });
  }

  obtenerPacientes(): void{
    this.apiService.getPacientes().subscribe({
      next: (data: Paciente[]) => {
        this.pacientes = data;
      },
      error: (error : any) =>{
        console.error('Error al cargar los pacientes',error);
      }
    })
  }

  obtenerMedicos(): void{
    this.apiService.getUsuarios().subscribe({
      next: (data:Usuario[]) =>{
        const medicosApi = data.filter(medico =>
          medico.IdRol == 2
        );
        this.medicos = medicosApi;
      },
      error: (error: any)=>{
        console.error('Error al cargar los medicos',error);
      }
    })
  }

  obtenerIngresos(): void {
    this.apiService.getIngresos().subscribe({
      next: (data: Ingreso[]) => {
        this.ingresos = data;
      },
      error: (error: any) => {
        console.error('Error al obtener los ingresos', error);
      }
    });
  }

  agregarIngreso(): void {
    if(this.ingresoForm.valid) {
      const nuevoIngreso: Ingreso = this.ingresoForm.value; //obtener los datos del formulario
      this.apiService.addIngreso(nuevoIngreso).subscribe({
        next: (ingreso: Ingreso) => {
          this.ingresos.push(ingreso);
          this.ingresoForm.reset(); //despues de agregarlo, reseteas el formulario
          alert('Ingreso creado con exito');
        },
        error: (error: any) => {
          const mensajeError =
            error.error || 'Error inesperado. Inténtalo de nuevo.';
          alert(mensajeError);
        },
      });
    } else{
      alert('Por favor, completa todos los campos requeridos.');  
    }
  }

  actualizarIngreso(): void {
    if (this.ingresoParaActualizar) {
      this.apiService.updateIngreso(this.ingresoParaActualizar).subscribe({
        next: (ingresoActualizado: Ingreso) => {
          const index = this.ingresos.findIndex(i => i.IdIngreso === ingresoActualizado.IdIngreso);
          if (index !== -1) {
            this.ingresos[index] = ingresoActualizado;
          }
          this.ingresoParaActualizar = null;
        },
        error: (error: any) => {
          console.error('Error al actualizar el ingreso', error);
        }
      });
    }
  }

  borrarIngreso(id: number): void {
    this.apiService.deleteIngreso(id).subscribe({
      next: () => {
        this.ingresos = this.ingresos.filter(i => i.IdIngreso !== id);
      },
      error: (error: any) => {
        console.error('Error al borrar el ingreso', error);
      }
    });
  }

  toggleActualizarIngreso(ingreso: Ingreso): void {
    this.ingresoParaActualizar = ingreso;
  }
}
