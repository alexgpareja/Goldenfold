import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControladorCamasRoutingModule } from './controlador-camas-routing.module';
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

@NgModule({
  declarations: [
    ControladorCamasDashboardComponent,
    ControladorCamasInicioComponent,
    AsignarCamaComponent,
    EstadoCamasComponent,
    HistorialPacientesIngresadosComponent,
    LiberarCamaComponent,
    AlertasDisponibilidadComponent,
    HistorialMovimientosCamasComponent,
    CamasMantenimientoComponent,
    AsignarPrioridadesComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ControladorCamasRoutingModule
  ]
})
export class ControladorCamasModule { }
