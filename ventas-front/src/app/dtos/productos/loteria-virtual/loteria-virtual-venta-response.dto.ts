import { ArchivoAdjuntoDTO } from '../../correos/archivo-adjunto.dto';

/**
 * DTO que contiene los atributos de la respuesta cuando se hace la venta
 */
export class LoteriaVirtualVentaResponseDTO {

  /** Es el PDF del soporte de pago */
  public sportePagoPDF: ArchivoAdjuntoDTO;

  /** Numero de unico que representa la transaccion */
  public nroTransaccion: string;
}
