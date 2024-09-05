import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControladorCamasDashboardComponent } from './pages/controlador-camas-dashboard/controlador-camas-dashboard.component';
import { ControladorCamasInicioComponent } from './pages/controlador-camas-inicio/controlador-camas-inicio.component';
import { AsignarCamaComponent } from './pages/asignar-cama/asignar-cama.component';
import { EstadoCamasComponent } from './pages/estado-camas/estado-camas.component';
import { HistorialPacientesIngresadosComponent } from './pages/historial-pacientes-ingresados/historial-pacientes-ingresados.component';
import { LiberarCamaComponent } from './pages/liberar-cama/liberar-cama.component';
import { AlertasDisponibilidadComponent } from './pages/alertas-disponibilidad/alertas-disponibilidad.component';
import { HistorialMovimientosCamasComponent } from './pages/historial-movimientos-camas/historial-movimientos-camas.component';
import { CamasMantenimientoComponent } from './pages/camas-mantenimiento/camas-mantenimiento.component';
import { AsignarPrioridadesComponent } from './pages/asignar-prioridades/asignar-prioridades.component';

const routes: Routes = [
  {
    path: '',
    component: ControladorCamasDashboardComponent,  // Dashboard principal con sidebar
    children: [
      { path: 'controlador-camas-inicio', component: ControladorCamasInicioComponent },
      { path: 'asignar-cama', component: AsignarCamaComponent },
      { path: 'estado-camas', component: EstadoCamasComponent },
      { path: 'historial-pacientes-ingresados', component: HistorialPacientesIngresadosComponent },
      { path: 'liberar-cama', component: LiberarCamaComponent },
      { path: 'alertas-disponibilidad', component: AlertasDisponibilidadComponent },
      { path: 'historial-movimientos-camas', component: HistorialMovimientosCamasComponent },
      { path: 'camas-mantenimiento', component: CamasMantenimientoComponent },
      { path: 'asignar-prioridades', component: AsignarPrioridadesComponent },
      { path: '', redirectTo: 'asignar-cama', pathMatch: 'full' },  // Página por defecto
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControladorCamasRoutingModule { }
