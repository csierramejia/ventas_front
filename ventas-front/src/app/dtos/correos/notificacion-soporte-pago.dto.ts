import { ArchivoAdjuntoDTO } from './archivo-adjunto.dto';

/**
 * DTO para la notificacion de los soportes de pagos
 */
export class NotificacionSoportePagoDTO {

  /** Es el PDF del soporte de pago */
  public sportePagoPDF: ArchivoAdjuntoDTO;

  /** Es el total pagado por el usuario */
  public totalPagado: number;

  /** Numero de unico que representa la transaccion */
  public nroTransaccion: string;

  /** Es el correo de destino a notificar */
  public correoDestino: string;

  /** Identificador del usuario quien hace la notificacion */
  public idUsuario: number;
}
