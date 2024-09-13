import { Component, OnInit } from '@angular/core';
import { ApiService, Rol, Usuario } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  nuevoUsuario: Usuario = {
    IdUsuario: 0,
    Nombre: '',
    NombreUsuario: '',
    Contrasenya: '',
    IdRol: 0,
  };
  usuarioParaActualizar: Usuario | null = null;
  mostrarContrasenas: { [key: number]: boolean } = {};

  searchTerm: string = ''; // Para la caja de búsqueda
  noResultsFound: boolean = false; // Indicador de resultados no encontrados

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerRoles();
  }

  obtenerUsuarios(): void {
    this.apiService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (error: any) => {
        console.error('Error al obtener los usuarios', error);
      },
    });
  }

  obtenerRoles(): void {
    // Este método simplemente llama al servicio
    this.apiService.getRoles().subscribe({
      next: (data: Rol[]) => {
        this.roles = data; // Asignar los roles a la variable roles
      },
      error: (error: any) => {
        console.error('Error al cargar los roles', error);
      },
    });
  }

  filtrarUsuarios(): void {
    if (!this.searchTerm.trim()) {
      this.obtenerUsuarios(); // Si no hay término de búsqueda, obtener todos los users
    } else {
      this.apiService.getUsuarios(this.searchTerm).subscribe({
        next: (data: Usuario[]) => {
          this.usuarios = data; // Actualizar los users filtrados
        },
        error: (error: any) => {
          console.error('Error al filtrar los usuarios', error);
        },
      });
    }
  }

  agregarUsuario(): void {
    this.apiService.addUsuario(this.nuevoUsuario).subscribe({
      next: (usuario: Usuario) => {
        this.usuarios.push(usuario);
        this.nuevoUsuario = {
          IdUsuario: 0,
          Nombre: '',
          NombreUsuario: '',
          Contrasenya: '',
          IdRol: 0,
        };
        alert('Usuario creado con éxito');
      },
      error: (error: any) => {
        // Mostrar directamente el mensaje de error del backend
        const mensajeError =
          error.error || 'Error inesperado. Inténtalo de nuevo.';
        alert(mensajeError);
      },
    });
  }

  toggleActualizarUsuario(usuario: Usuario): void {
    if (
      this.usuarioParaActualizar &&
      this.usuarioParaActualizar.IdUsuario === usuario.IdUsuario
    ) {
      this.usuarioParaActualizar = null;
    } else {
      this.usuarioParaActualizar = { ...usuario };
    }
  }

  actualizarUsuario(): void {
    if (this.usuarioParaActualizar) {
      this.apiService.updateUsuario(this.usuarioParaActualizar).subscribe({
        next: (usuarioActualizado: Usuario) => {
          this.obtenerUsuarios();

          this.usuarioParaActualizar = null;

          alert('Usuario actualizado con éxito.');
        },
        error: (error: any) => {
          console.error('Error al actualizar el usuario', error);
        },
      });
    }
  }

  borrarUsuario(idUsuario: number): void {
    const confirmacion = confirm(
      '¿Estás seguro de que deseas eliminar este usuario?'
    );
    if (confirmacion) {
      this.apiService.deleteUsuario(idUsuario).subscribe({
        next: () => {
          this.obtenerUsuarios(); // Refrescar la lista de usuarios
          alert('Usuario eliminado con éxito.');
        },
        error: (error: any) => {
          console.error('Error al eliminar el usuario', error);
          alert('Error al eliminar el usuario. Por favor, inténtelo de nuevo.');
        },
      });
    }
  }

  mostrarContrasena(id: number): void {
    this.mostrarContrasenas[id] = true;
  }

  ocultarContrasena(id: number): void {
    this.mostrarContrasenas[id] = false;
  }

  resetUsuario(): Usuario {
    return {
      IdUsuario: 0,
      Nombre: '',
      NombreUsuario: '',
      Contrasenya: '',
      IdRol: 0,
    };
  }

  cancelarNuevoUsuario(): void {
    this.nuevoUsuario = this.resetUsuario(); // Resetea los campos
  }

  cancelarActualizarUsuario(): void {
    this.usuarioParaActualizar = null; // Oculta el formulario y resetea los datos
  }
}
