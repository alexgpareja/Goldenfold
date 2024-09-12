import { Component, OnInit } from '@angular/core';
import { ApiService, Rol } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  roles: Rol[] = [];
  nuevoRol: Rol = { IdRol: 0, NombreRol: '' };
  rolParaActualizar: Rol | null = null;
  searchTerm: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerRoles();
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
          this.roles = data; // Actualizar los roles filtrados
        },
        error: (error: any) => {
          console.error('Error al filtrar los roles', error);
        },
      });
    }
  }

  agregarRol(): void {
    this.apiService.addRol(this.nuevoRol).subscribe({
      next: (rol: Rol) => {
        this.roles.push(rol);
        this.nuevoRol = { IdRol: 0, NombreRol: '' };
        alert('Rol agregado con éxito');
      },
      error: (error: any) => {
        // Mostrar directamente el mensaje de error del backend
        const mensajeError =
          error.error || 'Error inesperado. Inténtalo de nuevo.';
        alert(mensajeError);
      },
    });
  }

  toggleActualizarRol(rol: Rol): void {
    if (this.rolParaActualizar && this.rolParaActualizar.IdRol === rol.IdRol) {
      this.rolParaActualizar = null;
    } else {
      this.rolParaActualizar = { ...rol };
    }
  }

  actualizarRol(): void {
    if (this.rolParaActualizar) {
      this.apiService.updateRol(this.rolParaActualizar).subscribe({
        next: (rolActualizado: Rol) => {
          this.obtenerRoles();

          this.rolParaActualizar = null;

          alert('Rol actualizado con éxito.');
        },
        error: (error: any) => {
          console.error('Error al actualizar el rol', error);
        },
      });
    }
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
          alert('Error al borrar el rol. Por favor, inténtelo de nuevo.');
        },
      });
    }
  }

  descartarCambios(): void {
    this.rolParaActualizar = null; // Restablecer el rol seleccionado y ocultar el formulario de actualización
  }
}
