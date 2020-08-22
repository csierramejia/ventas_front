import { LoteriaVirtualVentaDetalleDTO } from './loteria-virtual-venta-detalle.dto';

/**
 * DTO que contiene los atributos para la venta de loterias virtual
 */
export class LoteriaVirtualVentaDTO {

  /** Identificador del cliente que hace la compra */
  public idCliente: number;

  /** Es el valor total de la venta */
  public valorTotal: number;

  /** Es el valor total del IVA */
  public valorTotalIVA: number;

  /** Es el detalle de la venta */
  public detalles: Array<LoteriaVirtualVentaDetalleDTO>;
}
