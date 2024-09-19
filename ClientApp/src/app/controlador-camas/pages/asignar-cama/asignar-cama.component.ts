import { Component, OnInit } from '@angular/core';
import { ApiService, Ingreso, Cama, Asignacion } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

// Extender el modelo Ingreso para agregar camasDisponibles temporalmente
interface IngresoConCamas extends Ingreso {
  camasDisponibles?: Cama[]; // Propiedad temporal para almacenar las camas disponibles
}

@Component({
  selector: 'app-asignar-cama',
  templateUrl: './asignar-cama.component.html',
  styleUrls: ['./asignar-cama.component.css']
})
export class AsignarCamaComponent  {
  solicitudesPendientes: IngresoConCamas[] = []; // Usamos la interfaz extendida
  errorMensaje: string | null = null;

  constructor(private apiService: ApiService) { }

 
  }
