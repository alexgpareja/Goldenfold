import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministradorSistemaRoutingModule } from './administrador-sistema-routing.module';
// Importamos los componentes de las tablas
import { CamasComponent } from '../shared/camas/camas.component';
import { AsignacionesComponent } from '../shared/asignaciones/asignaciones.component';
import { HabitacionesComponent } from '../shared/habitaciones/habitaciones.component';
import { HistorialAltasComponent } from '../shared/historial-altas/historial-altas.component';
import { PacientesComponent } from '../shared/pacientes/pacientes.component';
import { RolesComponent } from '../shared/roles/roles.component';
import { UsuariosComponent } from '../shared/usuarios/usuarios.component';
// Importamos los otros componentes de administración del sistema
import { AdministradorSistemaDashboardComponent } from './pages/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { AdministradorSistemaInicioComponent } from './pages/administrador-sistema-inicio/administrador-sistema-inicio.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { GestionRolesComponent } from './pages/gestion-roles/gestion-roles.component';

@NgModule({
  declarations: [
    AdministradorSistemaDashboardComponent,
    AdministradorSistemaInicioComponent,
    GestionUsuariosComponent,
    GestionRolesComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdministradorSistemaRoutingModule,
    CamasComponent,
    AsignacionesComponent,
    HabitacionesComponent,
    HistorialAltasComponent,
    PacientesComponent,
    RolesComponent,
    UsuariosComponent
  ]
})
export class AdministradorSistemaModule { }
