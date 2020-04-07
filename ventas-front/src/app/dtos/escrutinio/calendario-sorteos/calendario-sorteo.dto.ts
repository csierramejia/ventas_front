import { CalendarioDTO } from './calendario.dto';
import { CalendarioDiaDTO } from './calendario-dia.dto';

/**
 * DTO que contiene los atributos para la programacion de los sorteos
 */
export class CalendarioSorteoDTO extends CalendarioDTO {

  /** identificador del detalle del sorteo */
  public idSorteoDetalle: number;

  /** identificador del sorteo */
  public idSorteo: number;

  /** dia del sorteo */
  public dia: string;

  /** fecha del sorteo */
  public fechaSorteo: string;

  /** fecha de la serie inicial para ser visualizado en pantalla */
  public fechaSerieInicio: string;

  /** fecha de la serie final para ser visualizado en pantalla */
  public fechaSerieFinal: string;

  /** nombre de la loteria */
  public nombreLoteria: string;

  /** Son los dias normales seleccionados para la programacion */
  public dias: Array<CalendarioDiaDTO>;

  /** Son los festivos seleccionados para la programacion */
  public festivos: Array<CalendarioDiaDTO>;
}
