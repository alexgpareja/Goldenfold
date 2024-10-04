import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, Rol } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators, asyncRolNameExistsValidator } from '../../validators';
import { SharedModule } from '../shared.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SnackbarComponent } from '../snackbar/snackbar.component'; // Importar el componente standalone


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;  // Referencia al snackbar

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

      this.apiService.deleteRol(id).subscribe({
        next: () => {
          this.roles.data = this.roles.data.filter((r) => r.IdRol !== id);
          this.snackbar.showNotification('success', 'Rol eliminado con éxito'); // Notificación de éxito
        },
        error: (error) => {
          console.error('Error al borrar el rol', error);
          this.snackbar.showNotification('error', 'Error al borrar el rol'); // Notificación de error
        },
      });

  }

  actualizarRol(): void {
    if (this.rolParaActualizar && this.actualizarRolForm.valid) {
      const nombreFormateado = this.formatearNombreRol(this.actualizarRolForm.value.NombreRol); // formatear nombre
      const rolActualizado: Rol = { ...this.rolParaActualizar, NombreRol: nombreFormateado };
      this.apiService.updateRol(rolActualizado).subscribe({
        next: () => {
          this.obtenerRoles();
          this.rolParaActualizar = null;
          this.actualizarRolForm.reset();
          alert('Rol actualizado con éxito.');
        },
        error: (error: any) => {
          console.error('Error al actualizar el rol', error)
        },
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



  private formatearNombreRol(nombreRol: string): string {
    nombreRol = nombreRol.trim();
    return nombreRol.charAt(0).toUpperCase() + nombreRol.slice(1).toLowerCase();
  }

  limpiarFormulario(): void {
    this.rolParaActualizar = null;

    // Limpiar el formulario de agregar
    this.agregarRolForm.reset();
    this.agregarRolForm.markAsPristine();
    this.agregarRolForm.markAsUntouched();

    // Actualizar los validadores y el estado del formulario
    this.agregarRolForm.get('NombreRol')?.setErrors(null); // Restablecer errores específicos si es necesario

    // Limpiar el formulario de actualizar
    this.actualizarRolForm.reset();
    this.actualizarRolForm.markAsPristine();
    this.actualizarRolForm.markAsUntouched();
    this.actualizarRolForm.get('NombreRol')?.setErrors(null); // Restablecer errores específicos si es necesario
  }

}
