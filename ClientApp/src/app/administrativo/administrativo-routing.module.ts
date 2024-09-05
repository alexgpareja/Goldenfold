import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrativoDashboardComponent } from './pages/administrativo-dashboard/administrativo-dashboard.component';
import { RegistrarPacienteComponent } from './pages/registrar-paciente/registrar-paciente.component';
import { BuscarPacienteComponent } from './pages/buscar-paciente/buscar-paciente.component';
import { AdministrativoInicioComponent } from './pages/administrativo-inicio/administrativo-inicio.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrativoDashboardComponent,  // Dashboard principal con sidebar
    children: [
      { path: 'administrativo-inicio', component: AdministrativoInicioComponent },
      { path: 'registrar-paciente', component: RegistrarPacienteComponent },  // Carga dentro del dashboard
      { path: 'buscar-paciente', component: BuscarPacienteComponent },  // Carga dentro del dashboard
      { path: '', redirectTo: 'administrativo-inicio', pathMatch: 'full' }, // Redirigir a la nueva página de inicio
    ]
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
