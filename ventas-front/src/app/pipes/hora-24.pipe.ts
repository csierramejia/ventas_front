import { Pipe, PipeTransform } from '@angular/core';
import { FechaUtil } from '../utilities/fecha-util';

/**
 * Pipe para visualizar la hora en formato de 24 a partir
 * de una hora en base militar
 */
@Pipe({ name: 'hora24' })
export class Hora24Pipe implements PipeTransform {

  /**
   * Metodo que permite transformar la hora en 24
   * @param value , es la hora a dar formato
   */
  transform(value: any): string {
    if (value) {
      return FechaUtil.getRegularTime(value);
    }
  }
}
