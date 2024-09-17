import { Component } from '@angular/core';
import { ApiService, Consulta, Ingreso, Paciente } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-consultas-programadas',
  templateUrl: './consultas-programadas.component.html',
  styleUrls: ['./consultas-programadas.component.css']
})
export class ConsultasProgramadasComponent {
  consultasPendientes: Consulta[] = [];
  errorMensaje: string | null = null;
  consultaSeleccionada: Consulta | null = null; // Para seleccionar la consulta a evaluar
  tipoCamaSeleccionado: string = 'General'; // Opción por defecto

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.obtenerConsultasPendientes();
  }

  obtenerConsultasPendientes() {
    const idMedico = 8; // ID fijo del médico, que puede cambiar más tarde
    this.apiService.getConsultas(undefined, idMedico, 'pendiente de consultar').subscribe({
      next: (consultas: Consulta[]) => {
        this.consultasPendientes = consultas;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMensaje = 'Error al cargar las consultas. Por favor, inténtalo de nuevo.';
      }
    });
  }

  // Seleccionar una consulta para evaluar
  evaluar(consulta: Consulta) {
    this.consultaSeleccionada = consulta;
  }

  darAlta(idPaciente: number) {
    if (this.consultaSeleccionada && this.consultaSeleccionada.IdConsulta !== undefined) {
      // Obtenemos todos los pacientes
      this.apiService.getPacientes().subscribe({
        next: (pacientes: Paciente[]) => {
          // Buscamos el paciente con el id especificado
          const paciente = pacientes.find(p => p.IdPaciente === idPaciente);

          if (paciente) {
            // Modificamos el estado del paciente a 'Alta'
            paciente.Estado = 'Alta';

            // Actualizamos el paciente
            this.apiService.updatePaciente(paciente).subscribe({
              next: () => {
                // Agregamos un nuevo registro al historial de altas
                this.apiService.addHistorialAlta({
                  IdHistorial: 0,
                  IdPaciente: idPaciente,
                  FechaAlta: new Date(),
                  Diagnostico: 'Alta médica sin ingreso',
                  Tratamiento: 'Seguimiento ambulatorio'
                }).subscribe(() => {
                  // Ahora eliminamos la consulta de la base de datos usando el ID de la consulta
                  this.apiService.deleteConsulta(this.consultaSeleccionada!.IdConsulta).subscribe({
                    next: () => {
                      // Mostrar mensaje de éxito
                      alert('Paciente dado de alta y consulta eliminada con éxito.');

                      // Primero eliminamos la consulta de la lista local
                      this.consultasPendientes = this.consultasPendientes.filter(
                        consulta => consulta.IdConsulta !== this.consultaSeleccionada!.IdConsulta
                      );

                      // Después limpiamos la consulta seleccionada para ocultar el formulario
                      this.consultaSeleccionada = null;
                    },
                    error: (error: HttpErrorResponse) => {
                      this.errorMensaje = 'Error al eliminar la consulta de la base de datos.';
                    }
                  });
                });
              },
              error: (error: HttpErrorResponse) => {
                this.errorMensaje = 'Error al actualizar el paciente.';
              }
            });
          } else {
            this.errorMensaje = 'Paciente no encontrado.';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al obtener los pacientes.';
        }
      });
    } else {
      this.errorMensaje = 'Consulta no seleccionada o ID de consulta indefinido.';
    }
  }


  solicitarIngreso(idPaciente: number, tipoCama: string) {
    if (this.consultaSeleccionada) {
      // Actualizar el estado de la consulta y la fecha de consulta
      this.consultaSeleccionada.Estado = 'pendiente de ingreso';
      this.consultaSeleccionada.FechaConsulta = new Date(); // Asignamos la fecha actual
  
      // Actualizamos la consulta en la base de datos
      this.apiService.updateConsulta(this.consultaSeleccionada).subscribe({
        next: () => {
          // Si la actualización fue exitosa, agregamos el ingreso
          const nuevoIngreso: Ingreso = {
            IdIngreso: 0,
            IdPaciente: idPaciente,
            IdMedico: 8, // Este valor puede ser dinámico según el médico de la sesión
            Motivo: 'Requiere ingreso en ' + tipoCama,
            FechaSolicitud: new Date(),
            Estado: 'pendiente',
            IdAsignacion: null  // La cama aún no ha sido asignada
          };
  
          this.apiService.addIngreso(nuevoIngreso).subscribe({
            next: () => {
              alert('Ingreso solicitado con éxito y estado actualizado.');
              this.consultaSeleccionada = null; // Limpiamos la selección de la consulta
              this.obtenerConsultasPendientes(); // Recargamos la lista de consultas
            },
            error: (error: HttpErrorResponse) => {
              this.errorMensaje = 'Error al solicitar el ingreso.';
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          this.errorMensaje = 'Error al actualizar la consulta.';
        }
      });
    }
  }
  


}
