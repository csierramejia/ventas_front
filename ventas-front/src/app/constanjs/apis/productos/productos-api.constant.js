import { AppDomainConstant } from '../app-domain.constant';
/**
 * Clase que contiene todas las constantes de la API para el modulo de seguridad
 */
var ProductosAPIConstant = /** @class */ (function () {
    function ProductosAPIConstant() {
    }
    /** Nombre del REST para consultar loterias */
    ProductosAPIConstant.LOTERIAS_API = 'apuestas/apuesta/';
    /** Nombre del REST para el modulo Clientes (Productos) */
    ProductosAPIConstant.CLIENTES_API = 'apuestas/clientes/';
    /** Nombre del REST para el modulo impuestos (Productos) */
    ProductosAPIConstant.IMPUESTOS_API = 'apuestas/impuestos/';
    ProductosAPIConstant.MODALIDADES_API = 'apuestas/modalidades/';
    ProductosAPIConstant.MODALIDADES_RECARGAS = 'recargas/recarga/';
    /** Nombre del REST para la administracion de loterias virtual */
    ProductosAPIConstant.LOTERIAS_VIRTUAL = 'loteria/virtual/';
    /** URL del recurso para para obtener las loterias virtual */
    ProductosAPIConstant.URL_GET_LOTERIAS_VIRTUAL = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.LOTERIAS_VIRTUAL +
        'getLoteriasVirtual';
    /** URL del recurso para obtener fracciones disponibles */
    ProductosAPIConstant.URL_GET_FRACCIONES_DISPONIBLES = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.LOTERIAS_VIRTUAL +
        'getFraccionesDisponiblesNumeroLoteria';
    /** URL del recurso para obtener un numero loteria aleatorio */
    ProductosAPIConstant.URL_GET_NUMERO_ALEATORIO = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.LOTERIAS_VIRTUAL +
        'getSerieNumeroAleatorio';
    /** URL del recurso para comprar loteria virtual */
    ProductosAPIConstant.URL_GET_COMPRAR_LOTERIA_VIRTUAL = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.LOTERIAS_VIRTUAL +
        'comprarLoteriaVirtual';
    /** URL del recurso para obtener las loterias */
    ProductosAPIConstant.URL_CONSULTAR_LOTERIAS = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.LOTERIAS_API +
        'consultarLoteriasSorteo';
    /** URL del recurso para obtener existencia del cliente */
    ProductosAPIConstant.URL_CONSULTAR_CLIENTE = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.CLIENTES_API +
        'clienteApuesta';
    /** URL del recurso para registrar el cliente */
    ProductosAPIConstant.URL_REGISTRAR_CLIENTE = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.CLIENTES_API +
        'crearCliente';
    /** URL del recurso para obtener el iva */
    ProductosAPIConstant.URL_IMPUESTO_IVA = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.IMPUESTOS_API +
        'consultarImpuestoNombre';
    /** URL del recurso para hacer compra */
    ProductosAPIConstant.URL_REGISTRAR_APUESTA = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.LOTERIAS_API +
        'registrarApuesta';
    /** URL del recurso para hacer compra version 2 */
    ProductosAPIConstant.URL_REGISTRAR_APUESTAS = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.LOTERIAS_API +
        'registrarApuestas';
    /** URL del recurso para obtener el iva */
    ProductosAPIConstant.URL_REGISTRAR_RECARGA = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.MODALIDADES_RECARGAS +
        'registrarRecarga';
    /** URL del recurso para obtener las loterias */
    ProductosAPIConstant.URL_CONSULTAR_MODALIDADES_VALORES = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.MODALIDADES_API +
        'consultarInfoModalidad';
    /** URL del recurso para obtener las loterias */
    ProductosAPIConstant.URL_CONSULTAR_SIGNOS = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.MODALIDADES_API +
        'consultarSignos';
    /** URL del recurso para obtener las loterias */
    ProductosAPIConstant.URL_CONSULTAR_SERIE_APUESTAS = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.MODALIDADES_API +
        'consultarSerieApuesta';
    /** URL del recurso para obtener las loterias */
    ProductosAPIConstant.URL_CONSULTAR_SEMANA = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.LOTERIAS_API +
        'consultarSemanaActual';
    /** URL del recurso para obtener las loterias */
    ProductosAPIConstant.URL_CONSULTAR_RUTA_IMAGENES = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.MODALIDADES_API +
        'consultarRutaServidor';
    ProductosAPIConstant.URL_CONSULTAR_PAQUETES = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.MODALIDADES_RECARGAS +
        'consultarPaquetes';
    ProductosAPIConstant.URL_CONSULTAR_OPERADORES = AppDomainConstant.URI_GATEWAY +
        ProductosAPIConstant.MODALIDADES_RECARGAS +
        'consultarOperadores';
    return ProductosAPIConstant;
}());
export { ProductosAPIConstant };
