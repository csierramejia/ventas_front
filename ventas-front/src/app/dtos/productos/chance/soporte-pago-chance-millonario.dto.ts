import { SoportePagoChanceDTO } from './soporte-pago-chance.dto';

/**
 * Contiene la informacion para generar el PDF soporte de pago chance
 */
export class SoportePagoChanceMillonarioDTO extends SoportePagoChanceDTO {

  /** Tipo de jugada seleccionado para chance millonario */
  public jugadaUno: string;
  public jugadaDos: string;
  public jugadaTres: string;
  public jugadaCuatro: string;
  public jugadaCinco: string;

  /** Tipo de modalidad seleccionado para el chance millonario */
  public modalidad: string;
}
