import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para el modulo de seguridad
 */
export class ProductosAPIConstant {

  /** Nombre del REST para el modulo Apuestas (Productos) */
  static readonly PRODUCTOS_API: string = 'loterias/';

  /** URL del recurso para obtener las loterias */
  static readonly URL_CONSULTAR_LOTERIAS: string =
    AppDomainConstant.ESCRUTINIO +
    ProductosAPIConstant.PRODUCTOS_API +
    'consultarLoterias';


  /** URL del recurso para obtener los datos de bienvenida */
  // static readonly URL_BIENVENIDA: string =
  //   AppDomainConstant.SEGURIDAD +
  //   AutenticacionAPIConstant.AUTENTICACION_API +
  //   'bienvenida';
}
