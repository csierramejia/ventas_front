import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para los servicios comunes
 */
export class CommonAPIConstant {

  /** Nombre del REST para el modulo COMMON */
  static readonly COMMON_API: string = 'common/';

  /** URL del recurso para obtener multiple selectitems */
  static readonly URL_GET_SELECT_ITEMS: string =
    AppDomainConstant.URI_GATEWAY +
    CommonAPIConstant.COMMON_API +
    'getSelectItems';


  /** URL del recurso para obtener los items de tipo de documentos */
  static readonly URL_GET_ITEMS_TIPO_NUM_DOCUMETNO: string =
    AppDomainConstant.URI_GATEWAY +
    CommonAPIConstant.COMMON_API +
    'getItemsTiposDocumentos';


}
