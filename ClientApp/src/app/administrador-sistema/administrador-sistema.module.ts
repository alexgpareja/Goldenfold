import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministradorSistemaRoutingModule } from './administrador-sistema-routing.module';
import { AdministradorSistemaDashboardComponent } from './pages/administrador-sistema-dashboard/administrador-sistema-dashboard.component';
import { AdministradorSistemaInicioComponent } from './pages/administrador-sistema-inicio/administrador-sistema-inicio.component';

@NgModule({
  declarations: [
    AdministradorSistemaDashboardComponent,
    AdministradorSistemaInicioComponent  // Declarar el componente aquí
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdministradorSistemaRoutingModule
  ]
})
export class AdministradorSistemaModule { }
