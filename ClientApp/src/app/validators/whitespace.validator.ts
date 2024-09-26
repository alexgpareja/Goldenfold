import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn, FormControl } from '@angular/forms';
import { catchError, debounceTime, delay, map, Observable, of, switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';

export class CustomValidators {

  // Validador para no permitir solo espacios en blanco
  static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }

  // Validador asíncrono
  static asyncFieldExisting(apiService: ApiService) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return of(control.value).pipe(
            debounceTime(300),
            switchMap(value => 
                apiService.getUsuarios(undefined, value, undefined).pipe(
                    map(usuarios => {
                        // Filtrar los usuarios en el frontend
                        const usuariosFiltrados = usuarios.filter(usuario => 
                            usuario.NombreUsuario==value
                        );

                        if (usuariosFiltrados.length > 0) {
                            return { asyncFieldExisting: true };
                        }
                        return null;
                    }),
                    catchError(() => of(null))
                )
            )
        );
    };
}


}
