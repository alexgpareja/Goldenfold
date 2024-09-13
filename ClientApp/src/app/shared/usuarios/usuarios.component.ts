import { Component, OnInit } from '@angular/core';
import { ApiService, Usuario } from '../../services/api.service';
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
  nuevoUsuario: Usuario = {
    IdUsuario: 0,
    Nombre: '',
    NombreUsuario: '',
    Contrasenya: '',
    IdRol: 0,
  };
  usuarioParaActualizar: Usuario | null = null;
  mostrarContrasenas: { [key: number]: boolean } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
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
          const index = this.usuarios.findIndex(
            (u) => u.IdUsuario === usuarioActualizado.IdUsuario
          );
          if (index !== -1) {
            this.usuarios[index] = usuarioActualizado;
          }
          this.obtenerUsuarios();
          this.usuarioParaActualizar = null;
        },
        error: (error: any) => {
          console.error('Error al actualizar el usuario', error);
        },
      });
    }
  }

  borrarUsuario(id: number): void {
    this.apiService.deleteUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((u) => u.IdUsuario !== id);
      },
      error: (error: any) => {
        console.error('Error al borrar el usuario', error);
      },
    });
  }

  mostrarContrasena(id: number): void {
    this.mostrarContrasenas[id] = true;
  }

  ocultarContrasena(id: number): void {
    this.mostrarContrasenas[id] = false;
  }
}
