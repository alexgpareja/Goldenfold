import {
    AbstractControl,
    ValidationErrors,
    AsyncValidatorFn,
  } from '@angular/forms';
  import { Observable, of } from 'rxjs';
  import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';
  import { ApiService } from '../services/api.service';
  
  export const asyncPatientIdExistsValidator = (
    apiService: ApiService
  ): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // si no hi ha res escrit no fer validació
      if (!control.value) {
        return of(null);
      }
  
      return of(control.value).pipe(
        debounceTime(300), //esperar que l'usuari escrigui
        switchMap((value) =>
          apiService.getPacientes(value).pipe(
            map((pacientes) => {
              const pacientesFiltrados = pacientes.filter(
                (paciente) => paciente.IdPaciente === value
              );
              if (pacientesFiltrados.length === 0) {
                return { patientIdNotFound: true };
              }
              //si el pacient existeix
              return null;
            }),
            catchError(() => of(null))
          )
        )
      );
    };
  };
  