import { Component, OnInit } from '@angular/core';
import { ApiService, Rol } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidators } from '../../validators/whitespace.validator';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  roles: Rol[] = [];
  searchTerm: string = '';

  // Formularios Reactivos
  agregarRolForm!: FormGroup;
  actualizarRolForm!: FormGroup;

  rolParaActualizar: Rol | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerRoles();

    // Inicializamos los formularios reactivos
    this.agregarRolForm = new FormGroup({
      NombreRol: new FormControl('', [
        CustomValidators.noWhitespaceValidator(),
      ]),
    });
    this.actualizarRolForm = new FormGroup({
      IdRol: new FormControl({ value: '', disabled: true }),
      NombreRol: new FormControl('', [
        Validators.required,
        CustomValidators.noWhitespaceValidator(),
      ]),
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

  filtrarRoles(): void {
    if (!this.searchTerm.trim()) {
      this.obtenerRoles(); // Si no hay término de búsqueda, obtener todos los roles
    } else {
      this.apiService.getRoles(this.searchTerm).subscribe({
        next: (data: Rol[]) => {
          this.roles = data;
        },
        error: (error: any) => {
          console.error('Error al filtrar los roles', error);
        },
      });
    }
  }

  agregarRol(): void {
    if (this.agregarRolForm.invalid) {
      return; // No permitir la búsqueda si el formulario es inválido (incluyendo solo espacios en blanco)
    }

    const nombreRolAdd = this.agregarRolForm.get('NombreRol')?.value.trim();

    // Comprobar si el nombre del rol ya existe
    this.apiService.getRoles(nombreRolAdd).subscribe({
      next: (roles: Rol[]) => {
        if (roles.length > 0) {
          this.agregarRolForm
            .get('NombreRol')
            ?.setErrors({ nombreRolExiste: true });
        } else {
          const nuevoRol: Rol = {
            IdRol: 0,
            NombreRol: nombreRolAdd,
          };

          this.apiService.addRol(nuevoRol).subscribe({
            next: (rol: Rol) => {
              this.roles.push(rol);
              this.agregarRolForm.reset();
            },
            error: () => {
              this.agregarRolForm
                .get('NombreRol')
                ?.setErrors({ apiError: true });
            },
          });
        }
      },
      error: () => {
        console.error('Error al verificar el nombre del rol');
      },
    });
  }

  toggleActualizarRol(rol: Rol): void {
    if (this.rolParaActualizar && this.rolParaActualizar.IdRol === rol.IdRol) {
      this.rolParaActualizar = null;
      this.actualizarRolForm.reset(); // Limpiar el formulario
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
      return; // No permitir la búsqueda si el formulario es inválido (incluyendo solo espacios en blanco)
    }

    const nombreRolActualizar = this.actualizarRolForm
      .get('NombreRol')
      ?.value.trim();

    this.apiService.getRoles(nombreRolActualizar).subscribe({
      next: (roles: Rol[]) => {
        if (
          roles.length > 0 &&
          roles[0].IdRol !== this.rolParaActualizar?.IdRol
        ) {
          this.actualizarRolForm
            .get('NombreRol')
            ?.setErrors({ nombreRolExiste: true });
        } else {
          const rolActualizado: Rol = {
            IdRol: this.rolParaActualizar?.IdRol ?? 0,
            NombreRol: nombreRolActualizar,
          };

          this.apiService.updateRol(rolActualizado).subscribe({
            next: () => {
              this.obtenerRoles();
              this.actualizarRolForm.reset();
              this.rolParaActualizar = null;
            },
            error: () => {
              this.actualizarRolForm
                .get('NombreRol')
                ?.setErrors({ apiError: true });
            },
          });
        }
      },
      error: () => {
        console.error('Error al verificar el nombre del rol');
      },
    });
  }

  borrarRol(id: number): void {
    const confirmacion = confirm(
      '¿Estás seguro de que quieres eliminar este rol?'
    );
    if (confirmacion) {
      this.apiService.deleteRol(id).subscribe({
        next: () => {
          this.roles = this.roles.filter((r) => r.IdRol !== id);
          alert('Rol eliminado con éxito');
        },
        error: (error: any) => {
          console.error('Error al borrar el rol', error);
        },
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
