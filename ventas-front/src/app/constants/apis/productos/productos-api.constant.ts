import { AppDomainConstant } from '../app-domain.constant';

/**
 * Clase que contiene todas las constantes de la API para el modulo de seguridad
 */
export class ProductosAPIConstant {

  /** Nombre del REST para consultar loterias */
  static readonly LOTERIAS_API: string = 'apuesta/';
  /** Nombre del REST para el modulo Clientes (Productos) */
  static readonly CLIENTES_API: string = 'clientes/';
  /** Nombre del REST para el modulo impuestos (Productos) */
  static readonly IMPUESTOS_API: string = 'impuestos/';

  static readonly MODALIDADES_API: string = 'modalidades/';


  /** URL del recurso para obtener las loterias */
  static readonly URL_CONSULTAR_LOTERIAS: string =
    AppDomainConstant.APUESTAS +
    ProductosAPIConstant.LOTERIAS_API +
    'consultarLoteriasSorteo';


  /** URL del recurso para obtener existencia del cliente */
  static readonly URL_CONSULTAR_CLIENTE: string =
    AppDomainConstant.APUESTAS +
    ProductosAPIConstant.CLIENTES_API +
    'clienteApuesta';


  /** URL del recurso para registrar el cliente */
  static readonly URL_REGISTRAR_CLIENTE: string =
    AppDomainConstant.APUESTAS +
    ProductosAPIConstant.CLIENTES_API +
    'crearCliente';



  /** URL del recurso para obtener el iva */
  static readonly URL_IMPUESTO_IVA: string =
    AppDomainConstant.APUESTAS +
    ProductosAPIConstant.IMPUESTOS_API +
    'consultarImpuestoNombre';


  /** URL del recurso para obtener el iva */
  static readonly URL_REGISTRAR_APUESTA: string =
  AppDomainConstant.APUESTAS +
  ProductosAPIConstant.LOTERIAS_API +
  'registrarApuesta';

    /** URL del recurso para obtener las loterias */
    static readonly URL_CONSULTAR_MODALIDADES_VALORES: string =
    AppDomainConstant.APUESTAS +
    ProductosAPIConstant.MODALIDADES_API +
    'consultarInfoModalidad';


        /** URL del recurso para obtener las loterias */
        static readonly URL_CONSULTAR_SIGNOS: string =
        AppDomainConstant.APUESTAS +
        ProductosAPIConstant.MODALIDADES_API +
        'consultarSignos';

}
