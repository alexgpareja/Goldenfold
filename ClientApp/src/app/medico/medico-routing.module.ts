import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicoDashboardComponent } from './pages/medico-dashboard/medico-dashboard.component';
import { BuscarPacienteComponent } from './pages/buscar-paciente/buscar-paciente.component';
import { MedicoInicioComponent } from './pages/medico-inicio/medico-inicio.component';
import { EvaluarPacienteComponent } from './pages/evaluar-paciente/evaluar-paciente.component';
import { SolicitarIngresoComponent } from './pages/solicitar-ingreso/solicitar-ingreso.component';
import { HistorialMedicoComponent } from './pages/historial-medico/historial-medico.component';
import { ConsultasProgramadasComponent } from './pages/consultas-programadas/consultas-programadas.component';
import { SolicitarPruebasMedicasComponent } from './pages/solicitar-pruebas-medicas/solicitar-pruebas-medicas.component';
import { GenerarDiagnosticoComponent } from './pages/generar-diagnostico/generar-diagnostico.component';
import { VerResultadosPruebasComponent } from './pages/ver-resultados-pruebas/ver-resultados-pruebas.component';
import { SeguimientoPacientesComponent } from './pages/seguimiento-pacientes/seguimiento-pacientes.component';
import { RevisarIngresosPendientesComponent } from './pages/revisar-ingresos-pendientes/revisar-ingresos-pendientes.component';

const routes: Routes = [
  {
    path: '',
    component: MedicoDashboardComponent,  // Dashboard principal con sidebar
    children: [
      { path: 'medico-inicio', component: MedicoInicioComponent },
      { path: 'buscar-paciente', component: BuscarPacienteComponent },  // Carga dentro del dashboard
      { path: 'evaluar-paciente', component: EvaluarPacienteComponent },
      { path: 'solicitar-ingreso', component: SolicitarIngresoComponent },
      { path: 'historial-medico', component: HistorialMedicoComponent },
      { path: 'consultas-programadas', component: ConsultasProgramadasComponent },
      { path: 'solicitar-pruebas-medicas', component: SolicitarPruebasMedicasComponent },
      { path: 'generar-diagnostico', component: GenerarDiagnosticoComponent },
      { path: 'ver-resultados-pruebas', component: VerResultadosPruebasComponent },
      { path: 'seguimiento-pacientes', component: SeguimientoPacientesComponent },
      { path: 'revisar-ingresos-pendientes', component: RevisarIngresosPendientesComponent },
      { path: '', redirectTo: 'medico-inicio', pathMatch: 'full' }, // Página por defecto
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoRoutingModule { }
 