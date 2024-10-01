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

      const id = control.value;
  
      return of(control.value).pipe(
        debounceTime(300), 
        switchMap((id) =>
          apiService.getPacienteById(id).pipe(
            map((paciente) => {
              if (paciente) {
                return null; //pacient existeix
              } else {
                return { patientIdNotFound: true }; 
              }
            }),
            catchError(() => of({ patientIdNotFound: true }))
          )
        )
      );
    };
  };
  