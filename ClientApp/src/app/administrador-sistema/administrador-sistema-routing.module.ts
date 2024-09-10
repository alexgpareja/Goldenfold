import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorSistemaDashboardComponent } from './pages/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { AdministradorSistemaInicioComponent } from './pages/administrador-sistema-inicio/administrador-sistema-inicio.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { GestionRolesComponent } from './pages/gestion-roles/gestion-roles.component';
// Importamos los componentes de las tablas
import { CamasComponent } from '../shared/camas/camas.component';
import { AsignacionesComponent } from '../shared/asignaciones/asignaciones.component';
import { HabitacionesComponent } from '../shared/habitaciones/habitaciones.component';
import { HistorialAltasComponent } from '../shared/historial-altas/historial-altas.component';
import { PacientesComponent } from '../shared/pacientes/pacientes.component';
import { RolesComponent } from '../shared/roles/roles.component';
import { UsuariosComponent } from '../shared/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: AdministradorSistemaDashboardComponent,  // Dashboard principal con sidebar
    children: [
      // Tablas añadidas primero
      { path: 'camas', component: CamasComponent },
      { path: 'asignaciones', component: AsignacionesComponent },
      { path: 'habitaciones', component: HabitacionesComponent },
      { path: 'historial-altas', component: HistorialAltasComponent },
      { path: 'pacientes', component: PacientesComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'usuarios', component: UsuariosComponent },

      // Funciones de gestión
      { path: 'gestion-usuarios', component: GestionUsuariosComponent },
      { path: 'administrador-sistema-inicio', component: AdministradorSistemaInicioComponent },
      { path: 'gestion-roles', component: GestionRolesComponent },
      // Otras funcionalidades
      { path: '', redirectTo: 'administrador-sistema-inicio', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorSistemaRoutingModule { }
