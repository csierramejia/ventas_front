import { SoportePagoLoteriaVirtualDTO } from './soporte-pago-loteria-virtual.dto';


/**
 * DTO que contiene los atributos de la respuesta cuando se hace la venta
 */
export class LoteriaVirtualVentaResponseDTO {

  /** Es la informacion para la generacion del PDF soporte pago */
  public soportePagoLoteriaVirtual: Array<SoportePagoLoteriaVirtualDTO>;

  /** Numero de unico que representa la transaccion */
  public nroTransaccion: string;
}
