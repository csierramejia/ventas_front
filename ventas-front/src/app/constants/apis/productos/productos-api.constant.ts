import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para el modulo de seguridad
 */
export class ProductosAPIConstant {

  /** Nombre del REST para consultar loterias */
  static readonly LOTERIAS_API: string = 'apuestas/apuesta/';
  /** Nombre del REST para el modulo Clientes (Productos) */
  static readonly CLIENTES_API: string = 'apuestas/clientes/';
  /** Nombre del REST para el modulo impuestos (Productos) */
  static readonly IMPUESTOS_API: string = 'apuestas/impuestos/';

  static readonly MODALIDADES_API: string = 'apuestas/modalidades/';

  static readonly MODALIDADES_RECARGAS: string = 'recargas/recarga/';


  /** URL del recurso para obtener las loterias */
  static readonly URL_CONSULTAR_LOTERIAS: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.LOTERIAS_API +
    'consultarLoteriasSorteo';


  /** URL del recurso para obtener existencia del cliente */
  static readonly URL_CONSULTAR_CLIENTE: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.CLIENTES_API +
    'clienteApuesta';


  /** URL del recurso para registrar el cliente */
  static readonly URL_REGISTRAR_CLIENTE: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.CLIENTES_API +
    'crearCliente';



  /** URL del recurso para obtener el iva */
  static readonly URL_IMPUESTO_IVA: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.IMPUESTOS_API +
    'consultarImpuestoNombre';


  /** URL del recurso para obtener el iva */
  static readonly URL_REGISTRAR_APUESTA: string =
  AppDomainConstant.URI_GATEWAY +
  ProductosAPIConstant.LOTERIAS_API +
  'registrarApuesta';


  /** URL del recurso para obtener el iva */
  static readonly URL_REGISTRAR_RECARGA: string =
  AppDomainConstant.URI_GATEWAY +
  ProductosAPIConstant.MODALIDADES_RECARGAS +
  'registrarRecarga';

    /** URL del recurso para obtener las loterias */
    static readonly URL_CONSULTAR_MODALIDADES_VALORES: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.MODALIDADES_API +
    'consultarInfoModalidad';


        /** URL del recurso para obtener las loterias */
        static readonly URL_CONSULTAR_SIGNOS: string =
        AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.MODALIDADES_API +
        'consultarSignos';

     /** URL del recurso para obtener las loterias */
     static readonly URL_CONSULTAR_SERIE_APUESTAS: string =
     AppDomainConstant.URI_GATEWAY +
     ProductosAPIConstant.MODALIDADES_API +
     'consultarSerieApuesta';

     /** URL del recurso para obtener las loterias */
     static readonly URL_CONSULTAR_SEMANA: string =
     AppDomainConstant.URI_GATEWAY +
     ProductosAPIConstant.LOTERIAS_API +
     'consultarSemanaActual';

       /** URL del recurso para obtener las loterias */
       static readonly URL_CONSULTAR_RUTA_IMAGENES: string =
       AppDomainConstant.URI_GATEWAY +
       ProductosAPIConstant.MODALIDADES_API +
       'consultarRutaServidor';

       static readonly URL_CONSULTAR_PAQUETES: string =
       AppDomainConstant.URI_GATEWAY +
       ProductosAPIConstant.MODALIDADES_RECARGAS +
       'consultarPaquetes';

       static readonly URL_CONSULTAR_OPERADORES: string =
       AppDomainConstant.URI_GATEWAY +
       ProductosAPIConstant.MODALIDADES_RECARGAS +
       'consultarOperadores';

}
