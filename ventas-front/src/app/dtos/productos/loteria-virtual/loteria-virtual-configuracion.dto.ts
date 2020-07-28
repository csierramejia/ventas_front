/**
 * DTO que contiene los atributos de las configuraciones para las loterias virtual
 */
export class LoteriaVirtualConfiguracionDTO {

  /** Identificador de la configuracion */
  public id: number;

  /** Nombre de la loteria */
  public loteria: string;

  /** Identificador de la loteria */
  public idLoteria: number;

  /** Cantidad de fracciones de la loteria */
  public cantidadFracciones: number;

  /** Premio mayor de la loteria */
  public premioMayor: number;

  /** Estado de la configuracion */
  public idEstado: string;

  /** Estado en la que se encuentra la configuracion */
  public estado: boolean;

  /** Fecha inicial de la configuracion */
  public fechaInicio: Date;

  /** Fecha final de la configuracion */
  public fechaFinal: Date;

  /** Son las series concatenadas por coma */
  public series: string;

  /** Indica si los datos de la configuracion fueron modificados */
  public datosGeneralesModificados: boolean;

  /** Indica si las series de la configuracion fueron modificados */
  public seriesModificados: boolean;
}
