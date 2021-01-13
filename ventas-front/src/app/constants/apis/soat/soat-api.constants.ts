import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para el modulo de seguridad
 */
export class SoatAPIConstant {

    /** Nombre del REST para consultar loterias */
    static readonly SOAT_API: string = 'soat/consultas/';

    /** Nombre del REST para consultar loterias */
    static readonly SOAT_API_TOMADOR: string = 'soat/tomador/';


    static readonly URL_CONSULTAR_VEHICULO: string =
        AppDomainConstant.URI_GATEWAY +
        SoatAPIConstant.SOAT_API +
        'cosultarVehiculoPorPlaca';

        static readonly URL_ALMACENAR_TOMADOR: string =
        AppDomainConstant.URI_GATEWAY +
        SoatAPIConstant.SOAT_API_TOMADOR +
        'crearTomador';


}
