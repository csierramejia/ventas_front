import { LoteriaVirtualVentaDetalleDTO } from './loteria-virtual-venta-detalle.dto';

/**
 * DTO que contiene los atributos para la venta de loterias virtual
 */
export class LoteriaVirtualVentaDTO {

  /** Identificador del usuario que hace la compra */
  public idUsuario: number;

  /** Identificador del cliente que hace la compra */
  public idCliente: number;

  /** Es el valor total de la venta */
  public valorTotal: number;

  /** Es el valor total del IVA */
  public valorTotalIVA: number;

  /** Es el canal donde se hace la venta */
  public canal: number;

  /** Es el detalle de la venta */
  public detalles: Array<LoteriaVirtualVentaDetalleDTO>;

  /** Id de la oficina a la que pertenece el usuario */
  public idOficina: number;

  /** ID del punto de venta al que pertence el usuario */
  public idPuntoVenta: number;
}
