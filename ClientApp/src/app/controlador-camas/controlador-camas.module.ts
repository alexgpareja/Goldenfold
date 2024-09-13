import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControladorCamasRoutingModule } from './controlador-camas-routing.module';
import { ControladorCamasDashboardComponent } from './pages/controlador-camas-dashboard/controlador-camas-dashboard.component';
import { ControladorCamasInicioComponent } from './pages/controlador-camas-inicio/controlador-camas-inicio.component';
import { AsignarCamaComponent } from './pages/asignar-cama/asignar-cama.component';
import { EstadoCamasComponent } from './pages/estado-camas/estado-camas.component';

@NgModule({
  declarations: [
    ControladorCamasDashboardComponent,
    ControladorCamasInicioComponent,
    AsignarCamaComponent,
    EstadoCamasComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ControladorCamasRoutingModule
  ]
})
export class ControladorCamasModule { }
