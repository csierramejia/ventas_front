import { SoportePagoLoteriaVirtualDTO } from '../productos/loteria-virtual/soporte-pago-loteria-virtual.dto';

/**
 * DTO para la notificacion de los soportes de pagos
 */
export class NotificacionSoportePagoDTO {

  /** Es la informacion para la generacion del PDF soporte pago para loteria virtual */
  public soportePagoLoteriaVirtual: Array<SoportePagoLoteriaVirtualDTO>;

  /** Es el total pagado por el usuario sin IVA */
  public totalPagadoSinIva: number;

  /** Es el valor total del IVA */
  public valorTotalIVA: number;

  /** Numero de unico que representa la transaccion */
  public nroTransaccion: string;

  /** Indica que tipo de soporte de pago es */
  public tipoTransaccion: string;

  /** Es el correo de destino a notificar */
  public correoDestino: string;

  /** Identificador del usuario quien hace la notificacion */
  public idUsuario: number;
}
