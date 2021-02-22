import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para el modulo de seguridad
 */
export class AutenticacionAPIConstant {

  /** Nombre del REST para el modulo AUTENTICACION */
  static readonly AUTENTICACION_API: string = 'seguridad/';

   /** PATH que contiene los procesos de negocio para el inventario de papeleria */
   static readonly PAPELERIA: string = 'admin/papeleria/';


  /** URL del recurso para la autenticacion en el sistema */
  static readonly URL_LOGIN: string =
    AppDomainConstant.URI_GATEWAY +
    AutenticacionAPIConstant.AUTENTICACION_API +
    'login';

  /** URL del recurso para obtener los datos de bienvenida */
  static readonly URL_BIENVENIDA: string =
    AppDomainConstant.URI_GATEWAY +
    AutenticacionAPIConstant.AUTENTICACION_API +
    'bienvenida';


   /** URL del recurso para obtener los datos de bienvenida */
   static readonly URL_SERIES_VENDEDOR: string =
   AppDomainConstant.URI_GATEWAY +
   AutenticacionAPIConstant.PAPELERIA +
   'obtenerSeriesVendedor';
}
