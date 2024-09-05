import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControladorCamasRoutingModule } from './controlador-camas-routing.module';
import { ControladorCamasDashboardComponent } from './pages/controlador-camas-dashboard/controlador-camas-dashboard.component';
import { ControladorCamasInicioComponent } from './pages/controlador-camas-inicio/controlador-camas-inicio.component';

@NgModule({
  declarations: [
    ControladorCamasDashboardComponent,
    ControladorCamasInicioComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ControladorCamasRoutingModule
  ]
})
export class ControladorCamasModule { }
