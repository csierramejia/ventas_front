/**
 * DTO que contiene los valores de la loterias que se
 * presenta en la pantalla para proceder con su venta
 */
export class LoteriaVirtualDTO {

  /** Identificador de la loteria virtual */
  public idLoteriaVirtual: number;

  /** Nro de sorteo habilitado para jugar */
  public idSorteo: number;

  /** Nro de sorteo a jugar */
  public numeroSorteo: string;

  /** Nombre de la loteria a jugar */
  public nombreLoteria: string;

  /** Indica cuando se juega el sorteo */
  public fechaSorteo: Date;

  /** Indica cuando inicia la venta */
  public fechaInicioVenta: Date;

  /** Premio mayor del sorteo */
  public premioMayor: number;

  /** Valor de cada fraccion */
  public valorFraccion: number;

  /** Es el rango inicial de la serie */
  public rangoInicialSerie: number;

  /** Es el rango final de la serie */
  public rangoFinalSerie: number;

  /** Cantidad de fracciones de la loteria */
  public cantidadFraccion: number;

  /** Hora en la que inicia la venta */
  public horaInicioVenta: string;

  /** Hora en la que finaliza la venta */
  public horaCierreVenta: string;
}
