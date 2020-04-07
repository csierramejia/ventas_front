/**
 * DTO que contiene los atributos de un dia calendario
 */
export class CalendarioDiaDTO {

  /** Es el nombre del dia correspondiente al calendario */
  public dia: string;

  /** Es la descripcion del dia festivo */
  public descripcion: string;

  /** Es la fecha a visualizar en pantalla */
  public fecha: string;

  /** Es la hora del dia en que se va realizar el sorteo */
  public horaSorteo: string;

  /** Indica si el dia aplica para el calendario */
  public aplica: boolean;

  /** Indica si el dia es requerido */
  public requerido: boolean;
}
