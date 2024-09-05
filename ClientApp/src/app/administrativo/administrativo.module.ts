import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministrativoDashboardComponent } from './pages/administrativo-dashboard/administrativo-dashboard.component';
import { AdministrativoRoutingModule } from './administrativo-routing.module';

// Componentes específicos de administrativo
import { RegistrarPacienteComponent } from './pages/registrar-paciente/registrar-paciente.component';
import { BuscarPacienteComponent } from './pages/buscar-paciente/buscar-paciente.component';
import { AdministrativoInicioComponent } from './pages/administrativo-inicio/administrativo-inicio.component';
import { SolicitarConsultaComponent } from './pages/solicitar-consulta/solicitar-consulta.component';
import { VerConsultasProgramadasComponent } from './pages/ver-consultas-programadas/ver-consultas-programadas.component';
import { ActualizarInformacionPacienteComponent } from './pages/actualizar-informacion-paciente/actualizar-informacion-paciente.component';
import { HistorialConsultasComponent } from './pages/historial-consultas/historial-consultas.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { DocumentosPacienteComponent } from './pages/documentos-paciente/documentos-paciente.component';
import { ReportesComponent } from './pages/reportes/reportes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdministrativoRoutingModule
  ],
  declarations: [
    AdministrativoDashboardComponent,
    RegistrarPacienteComponent,
    BuscarPacienteComponent,
    AdministrativoInicioComponent,
    SolicitarConsultaComponent,
    VerConsultasProgramadasComponent,
    ActualizarInformacionPacienteComponent,
    HistorialConsultasComponent,
    NotificacionesComponent,
    DocumentosPacienteComponent,
    ReportesComponent
  ]
})
export class AdministrativoModule { }
