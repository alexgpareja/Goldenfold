import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorSistemaDashboardComponent } from './pages/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { PacientesComponent } from '../shared/pacientes/pacientes.component';
import { HistorialAltasComponent } from '../shared/historial-altas/historial-altas.component';
import { AsignacionesComponent } from '../shared/asignaciones/asignaciones.component';
import { RolesComponent } from '../shared/roles/roles.component';
import { UsuariosComponent } from '../shared/usuarios/usuarios.component';
import { HabitacionesComponent } from '../shared/habitaciones/habitaciones.component';
import { CamasComponent } from '../shared/camas/camas.component';
import { AdministradorSistemaInicioComponent } from './pages/administrador-sistema-inicio/administrador-sistema-inicio.component'; // Componente de inicio para administrador

const routes: Routes = [
  {
    path: '',
    component: AdministradorSistemaDashboardComponent, // Dashboard principal con sidebar
    children: [
      { path: 'administrador-inicio', component: AdministradorSistemaInicioComponent }, // Página de inicio del administrador
      { path: 'pacientes', component: PacientesComponent },
      { path: 'altas', component: HistorialAltasComponent },
      { path: 'asignaciones', component: AsignacionesComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'habitaciones', component: HabitacionesComponent },
      { path: 'camas', component: CamasComponent },
      { path: '', redirectTo: 'administrador-inicio', pathMatch: 'full' }, // Redirigir a la página de inicio del administrador
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorSistemaRoutingModule { }
