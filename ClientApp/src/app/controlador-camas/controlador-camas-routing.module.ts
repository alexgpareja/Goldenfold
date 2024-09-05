import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControladorCamasDashboardComponent } from './pages/controlador-camas-dashboard/controlador-camas-dashboard.component';
import { ControladorCamasInicioComponent } from './pages/controlador-camas-inicio/controlador-camas-inicio.component';

const routes: Routes = [
  {
    path: '',
    component: ControladorCamasDashboardComponent,  // Dashboard principal con sidebar
    children: [
      { path: 'controlador-camas-inicio', component: ControladorCamasInicioComponent },
      { path: '', redirectTo: 'controlador-camas-inicio', pathMatch: 'full' }, // Redirigir a la nueva página de inicio
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControladorCamasRoutingModule { }
