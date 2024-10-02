import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, Rol } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators, asyncRolNameExistsValidator } from '../../validators';
import { SharedModule } from '../shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  // Para la tabla
  roles = new MatTableDataSource<Rol>([]);
  displayedColumns: string[] = ['IdRol', 'NombreRol', 'Actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  // Formularios Reactivos
  agregarRolForm!: FormGroup;
  actualizarRolForm!: FormGroup;
  searchRolForm!: FormGroup;

  rolParaActualizar: Rol | null = null;


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerRoles();
    this.initForms();
  }

  // Inicializa los formularios
  initForms(): void {
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
      next: (roles: Rol[]) => {
        this.roles.data = roles;
        this.roles.paginator = this.paginator;
        this.roles.sort = this.sort;
      },
      error: (error) => console.error('Error al obtener los roles', error),
    });
  }

  // Método para filtrar roles desde el searchbox
  filtrarRoles(event: { type: string; term: string }): void {
    const { term } = event;

    // Aplica el filtro al MatTableDataSource en lugar de filtrar manualmente
    this.roles.filter = term.trim().toLowerCase();

    if (this.roles.paginator) {
      this.roles.paginator.firstPage();  // Resetea a la primera página si hay un filtro activo
    }
  }

  agregarRol(): void {
    const nombreRolControl = this.agregarRolForm.get('NombreRol');

    // Si el campo no ha sido tocado o modificado, no marcamos errores
    if (!nombreRolControl || nombreRolControl.invalid) {
      return;  // No hace nada hasta que el campo haya sido tocado o modificado
    }

    const nombreRolAdd = nombreRolControl.value.trim().toLowerCase();

    this.apiService.getRoles(nombreRolAdd).subscribe({
      next: (roles: Rol[]) => {
        if (roles.length > 0) {
          nombreRolControl.setErrors({ nombreRolExiste: true });
        } else {
          const nuevoRol: Rol = {
            IdRol: 0,
            NombreRol: nombreRolAdd.charAt(0).toUpperCase() + nombreRolAdd.slice(1).toLowerCase(),
          };

          this.apiService.addRol(nuevoRol).subscribe({
            next: (rol: Rol) => {
              this.roles.data = [...this.roles.data, rol];
              this.agregarRolForm.reset(); // Limpia el formulario
              this.agregarRolForm.markAsPristine(); // Marcamos como "limpio"
              this.agregarRolForm.markAsUntouched(); // Marcamos como "no tocado"
            },
            error: () => {
              nombreRolControl.setErrors({ apiError: true });
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
    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      this.apiService.deleteRol(id).subscribe({
        next: () => {
          this.roles.data = this.roles.data.filter((r) => r.IdRol !== id);
          alert('Rol eliminado con éxito');
        },
        error: (error) => console.error('Error al borrar el rol', error),
      });
    }
  }


  onEdit(rol: Rol): void {
    this.toggleActualizarRol(rol);
  }

  onDelete(rol: Rol): void {
    this.borrarRol(rol.IdRol);
  }

  toggleActualizarRol(rol: Rol): void {
    if (this.rolParaActualizar && this.rolParaActualizar.IdRol === rol.IdRol) {
      this.rolParaActualizar = null;
      this.actualizarRolForm.reset();
    } else {
      this.rolParaActualizar = { ...rol };
      this.actualizarRolForm.patchValue({ IdRol: rol.IdRol, NombreRol: rol.NombreRol });
    }
  }

  descartarCambios(tipo: 'agregar' | 'actualizar' = 'actualizar'): void {
    if (tipo === 'actualizar') {
      this.actualizarRolForm.reset();
      this.actualizarRolForm.markAsPristine();
      this.actualizarRolForm.markAsUntouched();
      this.rolParaActualizar = null;
    } else if (tipo === 'agregar') {
      this.agregarRolForm.reset();
      this.agregarRolForm.markAsPristine();
      this.agregarRolForm.markAsUntouched();
    }
  }

  private formatearNombreRol(nombreRol: string): string {
    nombreRol = nombreRol.trim();
    return nombreRol.charAt(0).toUpperCase() + nombreRol.slice(1).toLowerCase();
  }
}
