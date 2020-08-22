import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para el modulo de seguridad
 */
export class ConsultasAPIConstant {
  /** Nombre del REST para consultar loterias */
  static readonly   CONSULTA_MOVIMIENTOS: string = 'cartera/consultas/';

  static readonly URL_CONSULTAR_MOVIMIENTOS: string =
    AppDomainConstant.URI_GATEWAY +
    ConsultasAPIConstant.CONSULTA_MOVIMIENTOS +
    'consulta-movimientos';
}
