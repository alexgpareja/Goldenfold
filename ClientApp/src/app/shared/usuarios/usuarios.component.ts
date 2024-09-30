import { Component, OnInit } from '@angular/core';
import { ApiService, Rol, Usuario } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/whitespace.validator';
import { UserValidators } from '../../validators/usuarios.validators';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  usuarioForm!: FormGroup;
  usuarioParaActualizar: Usuario | null = null;
  mostrarContrasenas: { [key: number]: boolean } = {};

  searchTerm: string = ''; // Para la caja de búsqueda
  noResultsFound: boolean = false; // Indicador de resultados no encontrados

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerRoles();
    this.crearFormularioUsuario();
    this.configurarValidaciones();
  }

  crearFormularioUsuario(): void {
    this.usuarioForm = new FormGroup({
      IdUsuario: new FormControl({ value: '', disabled: true }),
      Nombre: new FormControl('',[UserValidators.noWhitespaceValidator(),Validators.pattern(' *[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+)+ *')]), //no puede estar en blanco y tiene que tener minimo 2 palabras
      NombreUsuario: new FormControl('',[UserValidators.noWhitespaceValidator()]),
      Contrasenya: new FormControl('',[Validators.required]),
      IdRol: new FormControl('',[Validators.required])
    });

  }

  configurarValidaciones(): void{
    if(!this.usuarioParaActualizar){
      this.usuarioForm.get('NombreUsuario')?.setAsyncValidators(UserValidators.asyncFieldExisting(this.apiService));
    }
    else{
      this.usuarioForm.get('NombreUsuario')?.clearAsyncValidators();
    }
    this.usuarioForm.get('NombreUsuario')?.updateValueAndValidity();
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
    if(this.usuarioForm.valid) {
      const nuevoUsuario: Usuario = this.usuarioForm.value; //obtener los datos del formulario
      this.apiService.addUsuario(nuevoUsuario).subscribe({
        next: (usuario: Usuario) => {
          this.usuarios.push(usuario);
          this.usuarioForm.reset(); //despues de agregarlo, reseteas el formulario
          alert('Usuario creado con exito');
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

  toggleActualizarUsuario(usuario: Usuario): void {
    if (
      this.usuarioParaActualizar &&
      this.usuarioParaActualizar.IdUsuario === usuario.IdUsuario
    ) {
      this.usuarioParaActualizar = null;
      this.usuarioForm.reset();
    } else {
      this.usuarioParaActualizar = { ...usuario };
      this.configurarValidaciones();
      this.usuarioForm.patchValue(this.usuarioParaActualizar); //rellenar el formulario con los datos del usuario
    }
  }

  actualizarUsuario(): void {
    if(this.usuarioParaActualizar && this.usuarioForm.valid) {
      const usuarioActualizado: Usuario = { ...this.usuarioParaActualizar,...this.usuarioForm.value};
      this.apiService.updateUsuario(usuarioActualizado).subscribe({
        next: () => {
          this.obtenerUsuarios();
          this.usuarioParaActualizar = null;
          this.usuarioForm.reset();
          alert('Usuario actualizado con éxito.');
        },
        error: (error: any) =>{
          console.error('Error al actualizar el usuario',error)
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
    this.usuarioForm.reset(); // Resetea los campos
  }

  cancelarActualizarUsuario(): void {
    this.usuarioParaActualizar = null; // Oculta el formulario y resetea los datos
    this.usuarioForm.reset();
  }
}
