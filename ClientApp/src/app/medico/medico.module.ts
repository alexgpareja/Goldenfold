import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoRoutingModule } from './medico-routing.module';

import { MedicoDashboardComponent } from './pages/medico-dashboard/medico-dashboard.component';
import { MedicoInicioComponent } from './pages/medico-inicio/medico-inicio.component';
import { BuscarPacienteComponent } from './pages/buscar-paciente/buscar-paciente.component';
import { EvaluarPacienteComponent } from './pages/evaluar-paciente/evaluar-paciente.component';
import { SolicitarIngresoComponent } from './pages/solicitar-ingreso/solicitar-ingreso.component';
import { HistorialMedicoComponent } from './pages/historial-medico/historial-medico.component';
import { ConsultasProgramadasComponent } from './pages/consultas-programadas/consultas-programadas.component';
import { SolicitarPruebasMedicasComponent } from './pages/solicitar-pruebas-medicas/solicitar-pruebas-medicas.component';
import { GenerarDiagnosticoComponent } from './pages/generar-diagnostico/generar-diagnostico.component';
import { VerResultadosPruebasComponent } from './pages/ver-resultados-pruebas/ver-resultados-pruebas.component';
import { SeguimientoPacientesComponent } from './pages/seguimiento-pacientes/seguimiento-pacientes.component';
import { RevisarIngresosPendientesComponent } from './pages/revisar-ingresos-pendientes/revisar-ingresos-pendientes.component';

@NgModule({
  declarations: [
    MedicoDashboardComponent,
    MedicoInicioComponent,
    BuscarPacienteComponent,
    EvaluarPacienteComponent,
    SolicitarIngresoComponent,
    HistorialMedicoComponent,
    ConsultasProgramadasComponent,
    SolicitarPruebasMedicasComponent,
    GenerarDiagnosticoComponent,
    VerResultadosPruebasComponent,
    SeguimientoPacientesComponent,
    RevisarIngresosPendientesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MedicoRoutingModule
  ]
})
export class MedicoModule { }
