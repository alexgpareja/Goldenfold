// validators/rol-name-exists.validator.ts
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

export const asyncRolNameExistsValidator = (
  apiService: ApiService
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const nombreRol = control.value?.trim();

    if (!nombreRol) {
      return of(null); // No hacer validación si el campo está vacío
    }

    return of(nombreRol).pipe(
      debounceTime(300), // Evitar múltiples llamadas rápidas
      switchMap((value) =>
        apiService.getRoles(value).pipe(
          map((roles) => (roles.length > 0 ? { rolExists: true } : null)),
          catchError(() => of(null)) // Si la API falla, no detener la validación
        )
      )
    );
  };
};
