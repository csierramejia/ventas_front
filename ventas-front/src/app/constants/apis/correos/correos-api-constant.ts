import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para envios de correos
 */
export class CorreosAPIConstant {

  /** Nombre del REST para el modulo envios de correos */
  static readonly CORREOS_API: string = 'correos/';

  /** URL para la notificacion de soporte de pago */
  static readonly URL_NOTIFICAR_SOPORTE_PAGO: string =
    AppDomainConstant.URI_GATEWAY +
    CorreosAPIConstant.CORREOS_API +
    'enviarNotificacionSoportePago';
}
