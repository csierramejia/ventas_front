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

  /** Nombre del REST para la administracion de loterias virtual */
  static readonly LOTERIAS_VIRTUAL: string = 'loteria/virtual/';

  /** PATH que contiene los procesos de negocio para los horarios */
  static readonly HORARIO: string = 'admin/horario/';  


  /** URL del recurso para para obtener las loterias virtual */
  static readonly URL_GET_LOTERIAS_VIRTUAL: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.LOTERIAS_VIRTUAL +
    'getLoteriasVirtual';

  /** URL del recurso para obtener fracciones disponibles */
  static readonly URL_GET_FRACCIONES_DISPONIBLES: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.LOTERIAS_VIRTUAL +
    'getFraccionesDisponiblesNumeroLoteria';

  /** URL del recurso para obtener un numero loteria aleatorio */
  static readonly URL_GET_NUMERO_ALEATORIO: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.LOTERIAS_VIRTUAL +
    'getSerieNumeroAleatorio';

  /** URL del recurso para comprar loteria virtual */
  static readonly URL_GET_COMPRAR_LOTERIA_VIRTUAL: string =
    AppDomainConstant.URI_GATEWAY +
    ProductosAPIConstant.LOTERIAS_VIRTUAL +
    'comprarLoteriaVirtual';

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


  /** URL del recurso para hacer compra */
  // static readonly URL_REGISTRAR_APUESTA: string =
  // AppDomainConstant.URI_GATEWAY +
  // ProductosAPIConstant.LOTERIAS_API +
  // 'registrarApuesta';

  static readonly URL_REGISTRAR_APUESTA: string =
  'http://localhost:8181/' +
  ProductosAPIConstant.LOTERIAS_API +
  'registrarApuesta';


  /** URL del recurso para hacer compra version 2 */
  // static readonly URL_REGISTRAR_APUESTAS: string =
  // AppDomainConstant.URI_GATEWAY +
  // ProductosAPIConstant.LOTERIAS_API +
  // 'registrarApuestas';

  static readonly URL_REGISTRAR_APUESTAS: string =
  'http://localhost:8181/' +
  ProductosAPIConstant.LOTERIAS_API +
  'registrarApuestas';


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

       static readonly URL_EXISTE_PROGRAMACION: string =
       AppDomainConstant.URI_GATEWAY +
       ProductosAPIConstant.HORARIO +
       'obtenerProgramacion';

}
