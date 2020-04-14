import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para el modulo de seguridad
 */
export class ProductosAPIConstant {

  /** Nombre del REST para consultar loterias */
  static readonly LOTERIAS_API: string = 'apuesta/';
  /** Nombre del REST para el modulo Clientes (Productos) */
  static readonly CLIENTES_API: string = 'clientes/';

  /** URL del recurso para obtener las loterias */
  static readonly URL_CONSULTAR_LOTERIAS: string =
    AppDomainConstant.APUESTAS +
    ProductosAPIConstant.LOTERIAS_API +
    'consultarLoteriasSorteo';


  /** URL del recurso para obtener las loterias */
  static readonly URL_CONSULTAR_CLIENTE: string =
    AppDomainConstant.APUESTAS +
    ProductosAPIConstant.CLIENTES_API +
    'clienteApuesta';

}
