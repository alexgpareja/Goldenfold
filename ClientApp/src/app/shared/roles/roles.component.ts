import { Component, OnInit } from '@angular/core';
import { ApiService, Rol } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CustomValidators,
  asyncRolNameExistsValidator,
} from '../../validators';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  roles: Rol[] = [];
  
  // Formularios Reactivos
  agregarRolForm!: FormGroup;
  actualizarRolForm!: FormGroup;
  searchRolForm!: FormGroup;

  rolParaActualizar: Rol | null = null;

  // Columnas a mostrar en la tabla
  columns = [
    { columnDef: 'IdRol', header: 'ID Rol' },
    { columnDef: 'NombreRol', header: 'Nombre Rol' }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerRoles();

    // Inicializamos los formularios reactivos
    this.searchRolForm = new FormGroup({
      searchTerm: new FormControl(''),
      searchType: new FormControl('nombreRol'), // Valor por defecto para buscar
    });

    this.agregarRolForm = new FormGroup({
      NombreRol: new FormControl(
        '',
        [CustomValidators.noWhitespaceValidator()],
        [asyncRolNameExistsValidator(this.apiService)]
      ),
    });
    this.actualizarRolForm = new FormGroup({
      IdRol: new FormControl({ value: '', disabled: true }),
      NombreRol: new FormControl(
        '',
        [CustomValidators.noWhitespaceValidator()],
        [asyncRolNameExistsValidator(this.apiService)]
      ),
    });
  }

  obtenerRoles(): void {
    this.apiService.getRoles().subscribe({
      next: (data: Rol[]) => {
        this.roles = data;
      },
      error: (error: any) => {
        console.error('Error al obtener los roles', error);
      },
    });
  }

  // Método para filtrar roles desde el searchbox
  filtrarRoles(event: { type: string; term: string }): void {
    const { term } = event;
    this.roles = this.roles.filter(rol =>
      rol.NombreRol.toLowerCase().includes(term.toLowerCase())
    );
  }

  onEdit(rol: Rol): void {
    this.toggleActualizarRol(rol); 
  }

  onDelete(rol: Rol): void {
    this.borrarRol(rol.IdRol);
  }

  // Métodos agregar, actualizar y borrar se mantienen igual
  agregarRol(): void {
    if (this.agregarRolForm.invalid) {
      this.agregarRolForm.markAllAsTouched();
      return;
    }
    const nombreRolAdd = this.agregarRolForm.get('NombreRol')?.value.trim();
    this.apiService.getRoles(nombreRolAdd).subscribe({
      next: (roles: Rol[]) => {
        if (roles.length > 0) {
          this.agregarRolForm.get('NombreRol')?.setErrors({ nombreRolExiste: true });
        } else {
          const nuevoRol: Rol = { IdRol: 0, NombreRol: nombreRolAdd };
          this.apiService.addRol(nuevoRol).subscribe({
            next: (rol: Rol) => {
              this.roles.push(rol);
              this.agregarRolForm.reset();
            },
            error: () => {
              this.agregarRolForm.get('NombreRol')?.setErrors({ apiError: true });
            },
          });
        }
      },
      error: () => console.error('Error al verificar el nombre del rol'),
    });
  }

  toggleActualizarRol(rol: Rol): void {
    if (this.rolParaActualizar && this.rolParaActualizar.IdRol === rol.IdRol) {
      this.rolParaActualizar = null;
      this.actualizarRolForm.reset();
    } else {
      this.rolParaActualizar = { ...rol };
      this.actualizarRolForm.patchValue({
        IdRol: rol.IdRol,
        NombreRol: rol.NombreRol,
      });
    }
  }

  actualizarRol(): void {
    if (this.actualizarRolForm.invalid) {
      this.agregarRolForm.markAllAsTouched();
      return;
    }
    const nombreRolActualizar = this.actualizarRolForm.get('NombreRol')?.value.trim();
    this.apiService.getRoles(nombreRolActualizar).subscribe({
      next: (roles: Rol[]) => {
        if (roles.length > 0 && roles[0].IdRol !== this.rolParaActualizar?.IdRol) {
          this.actualizarRolForm.get('NombreRol')?.setErrors({ nombreRolExiste: true });
        } else {
          const rolActualizado: Rol = { IdRol: this.rolParaActualizar?.IdRol ?? 0, NombreRol: nombreRolActualizar };
          this.apiService.updateRol(rolActualizado).subscribe({
            next: () => {
              this.obtenerRoles();
              this.actualizarRolForm.reset();
              this.rolParaActualizar = null;
            },
            error: () => {
              this.actualizarRolForm.get('NombreRol')?.setErrors({ apiError: true });
            },
          });
        }
      },
      error: () => console.error('Error al verificar el nombre del rol'),
    });
  }

  borrarRol(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      this.apiService.deleteRol(id).subscribe({
        next: () => {
          this.roles = this.roles.filter((r) => r.IdRol !== id);
          alert('Rol eliminado con éxito');
        },
        error: (error: any) => console.error('Error al borrar el rol', error),
      });
    }
  }

  descartarCambios(tipo: 'agregar' | 'actualizar' = 'actualizar'): void {
    if (tipo === 'actualizar') {
      this.actualizarRolForm.reset();
      this.rolParaActualizar = null;
    } else if (tipo === 'agregar') {
      this.agregarRolForm.reset();
    }
  }
}
