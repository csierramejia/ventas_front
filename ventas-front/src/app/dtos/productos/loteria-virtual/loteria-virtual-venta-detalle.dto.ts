/**
 * DTO que contiene los atributos del detalle de la venta
 */
export class LoteriaVirtualVentaDetalleDTO {

  /** Identificador del sorteo */
  public idSorteo: number;

  /** Es el numero del sorteo */
  public numeroSorteo: string;

  /** Es el nombre de la loteria */
  public nombreLoteria: string;

  /** Numero de serie a jugar */
  public serie: string;

  /** Numero de la loteria a jugar */
  public numero: string;

  /** Cantidad de fracciones de la venta */
  public fracciones: number;

  /** Es el valor de este detalle */
  public valor: number;

  /** Son las fracciones vendidas */
  public fraccionesVendidas: number;

  /** Son las fracciones disponibles */
  public fraccionesDisponibles: number;

  /** Indica si se agrego todo el billete */
  public todoBillete: boolean;

  /** Es el valor de la fraccion */
  public valorFraccion: number;

  /** Es la cantidad de fracciones que tiene el sorteo */
  public cantidadFracciones: number;
}
