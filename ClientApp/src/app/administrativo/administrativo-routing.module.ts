import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarPacienteComponent } from './pages/registrar-paciente/registrar-paciente.component';
import { BuscarPacienteComponent } from './pages/buscar-paciente/buscar-paciente.component';
import { AdministrativoDashboardComponent } from './pages/administrativo-dashboard/administrativo-dashboard.component';
import { SolicitarConsultaComponent } from './pages/solicitar-consulta/solicitar-consulta.component';
import { VerConsultasProgramadasComponent } from './pages/ver-consultas-programadas/ver-consultas-programadas.component';
import { ActualizarInformacionPacienteComponent } from './pages/actualizar-informacion-paciente/actualizar-informacion-paciente.component';
import { HistorialConsultasComponent } from './pages/historial-consultas/historial-consultas.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { DocumentosPacienteComponent } from './pages/documentos-paciente/documentos-paciente.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { AdministrativoInicioComponent } from './pages/administrativo-inicio/administrativo-inicio.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrativoDashboardComponent,
    children: [
      { path: 'administrativo-inicio', component: AdministrativoInicioComponent },
      { path: 'registrar-paciente', component: RegistrarPacienteComponent },
      { path: 'buscar-paciente', component: BuscarPacienteComponent },
      { path: 'solicitar-consulta', component: SolicitarConsultaComponent },
      { path: 'ver-consultas-programadas', component: VerConsultasProgramadasComponent },
      { path: 'actualizar-informacion-paciente', component: ActualizarInformacionPacienteComponent },
      { path: 'historial-consultas', component: HistorialConsultasComponent },
      { path: 'notificaciones', component: NotificacionesComponent },
      { path: 'documentos-paciente', component: DocumentosPacienteComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: '', redirectTo: 'administrativo-inicio', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
