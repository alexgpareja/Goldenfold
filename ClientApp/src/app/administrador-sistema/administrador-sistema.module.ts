import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministradorSistemaRoutingModule } from './administrador-sistema-routing.module';
import { AdministradorSistemaDashboardComponent } from './pages/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { AdministradorSistemaInicioComponent } from './pages/administrador-sistema-inicio/administrador-sistema-inicio.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { GestionRolesComponent } from './pages/gestion-roles/gestion-roles.component';
import { AuditoriaActividadesComponent } from './pages/auditoria-actividades/auditoria-actividades.component';
import { GestionPermisosComponent } from './pages/gestion-permisos/gestion-permisos.component';
import { MonitorizacionSistemaComponent } from './pages/monitorizacion-sistema/monitorizacion-sistema.component';
import { GestionCuentasPacientesComponent } from './pages/gestion-cuentas-pacientes/gestion-cuentas-pacientes.component';
import { ConfiguracionSistemaComponent } from './pages/configuracion-sistema/configuracion-sistema.component';
import { NotificacionesAlertasSistemaComponent } from './pages/notificaciones-alertas-sistema/notificaciones-alertas-sistema.component';
import { LogsAccesoErroresComponent } from './pages/logs-acceso-errores/logs-acceso-errores.component';
import { EstadisticasUsoComponent } from './pages/estadisticas-uso/estadisticas-uso.component';
import { GestionMantenimientoComponent } from './pages/gestion-mantenimiento/gestion-mantenimiento.component';
import { GestionNotificacionesGlobalesComponent } from './pages/gestion-notificaciones-globales/gestion-notificaciones-globales.component';
import { ConfiguracionSeguridadComponent } from './pages/configuracion-seguridad/configuracion-seguridad.component';

@NgModule({
  declarations: [
    AdministradorSistemaDashboardComponent,
    AdministradorSistemaInicioComponent,
    GestionUsuariosComponent,
    GestionRolesComponent,
    AuditoriaActividadesComponent,
    GestionPermisosComponent,
    MonitorizacionSistemaComponent,
    GestionCuentasPacientesComponent,
    ConfiguracionSistemaComponent,
    NotificacionesAlertasSistemaComponent,
    LogsAccesoErroresComponent,
    EstadisticasUsoComponent,
    GestionMantenimientoComponent,
    GestionNotificacionesGlobalesComponent,
    ConfiguracionSeguridadComponent  // Declarar el componente aquí
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdministradorSistemaRoutingModule
  ]
})
export class AdministradorSistemaModule { }
