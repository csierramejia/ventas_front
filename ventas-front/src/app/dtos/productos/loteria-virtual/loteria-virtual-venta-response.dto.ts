import { InformacionSoportePagoDTO } from '../../transversal/informacion-soporte-pago.dto';

/**
 * DTO que contiene los atributos de la respuesta cuando se hace la venta
 */
export class LoteriaVirtualVentaResponseDTO {

  /** Es la informacion para la generacion del PDF soporte pago */
  public informacionSoportePago: Array<InformacionSoportePagoDTO>;

  /** Numero de unico que representa la transaccion */
  public nroTransaccion: string;
}
