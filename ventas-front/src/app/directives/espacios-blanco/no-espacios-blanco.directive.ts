import { Directive } from '@angular/core';
import {
  Validator,
  AbstractControl,
  ValidatorFn,
  NG_VALIDATORS
} from '@angular/forms';

/**
 * Directiva que permite validar el requerido de un input,
 * teniendo en cuenta los espacios en blanco
 */
@Directive({
  selector: '[appRequired]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoEspaciosBlancoDirective,
      multi: true
    }
  ]
})
export class NoEspaciosBlancoDirective implements Validator {
  private valFn = validarEspaciosBlanco();
  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }
}

/**
 * Function que es invocado por la directiva que valida
 * el requerido de un input teniendo en cuenta los espacios
 */
export function validarEspaciosBlanco(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: 'value is only whitespace' };
  };
}
