/**
 * DTO que contiene los atributos comunes para la programacion de los sorteos
 */
export class CalendarioDTO {

  /** Fecha de inicio del calendario */
  public fechaInicio: Date;

  /** Fecha de final del calendario */
  public fechaFinal: Date;

  /** Nro del sorteo del calendario */
  public nroSorteo: string;

  /** Hora del sorteo del calendario */
  public horaSorteo: string;

  /** Identificador de la loteria */
  public idLoteria: number;
}
