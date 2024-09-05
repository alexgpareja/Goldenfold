import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorSistemaDashboardComponent } from './pages/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { AdministradorSistemaInicioComponent } from './pages/administrador-sistema-inicio/administrador-sistema-inicio.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { GestionRolesComponent } from './pages/gestion-roles/gestion-roles.component';
import { AuditoriaActividadesComponent } from './pages/auditoria-actividades/auditoria-actividades.component';
import { GestionPermisosComponent } from './pages/gestion-permisos/gestion-permisos.component';
import { BackupRestauracionComponent } from './pages/backup-restauracion/backup-restauracion.component';
import { MonitorizacionSistemaComponent } from './pages/monitorizacion-sistema/monitorizacion-sistema.component';
import { GestionCuentasPacientesComponent } from './pages/gestion-cuentas-pacientes/gestion-cuentas-pacientes.component';
import { ConfiguracionSistemaComponent } from './pages/configuracion-sistema/configuracion-sistema.component';
import { NotificacionesAlertasSistemaComponent } from './pages/notificaciones-alertas-sistema/notificaciones-alertas-sistema.component';
import { LogsAccesoErroresComponent } from './pages/logs-acceso-errores/logs-acceso-errores.component';
import { EstadisticasUsoComponent } from './pages/estadisticas-uso/estadisticas-uso.component';
import { GestionMantenimientoComponent } from './pages/gestion-mantenimiento/gestion-mantenimiento.component';
import { GestionNotificacionesGlobalesComponent } from './pages/gestion-notificaciones-globales/gestion-notificaciones-globales.component';
import { ConfiguracionSeguridadComponent } from './pages/configuracion-seguridad/configuracion-seguridad.component';

const routes: Routes = [
  {
    path: '',
    component: AdministradorSistemaDashboardComponent,  // Dashboard principal con sidebar
    children: [
      { path: 'gestion-usuarios', component: GestionUsuariosComponent },
      {path: 'administrador-sistema-inicio', component: AdministradorSistemaInicioComponent },
      { path: 'gestion-roles', component: GestionRolesComponent },
      { path: 'auditoria-actividades', component: AuditoriaActividadesComponent },
      { path: 'gestion-permisos', component: GestionPermisosComponent },
      { path: 'backup-restauracion', component: BackupRestauracionComponent },
      { path: 'monitorizacion-sistema', component: MonitorizacionSistemaComponent },
      { path: 'gestion-cuentas-pacientes', component: GestionCuentasPacientesComponent },
      { path: 'configuracion-sistema', component: ConfiguracionSistemaComponent },
      { path: 'notificaciones-alertas-sistema', component: NotificacionesAlertasSistemaComponent },
      { path: 'logs-acceso-errores', component: LogsAccesoErroresComponent },
      { path: 'estadisticas-uso', component: EstadisticasUsoComponent },
      { path: 'gestion-mantenimiento', component: GestionMantenimientoComponent },
      { path: 'gestion-notificaciones-globales', component: GestionNotificacionesGlobalesComponent },
      { path: 'configuracion-seguridad', component: ConfiguracionSeguridadComponent },
      { path: '', redirectTo: 'administrador-sistema-inicio', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorSistemaRoutingModule { }
