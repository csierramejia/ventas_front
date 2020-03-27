/**
 * Clase constante que contiene los mensajes y codigo retornados
 * por el backend al ejecutar algun proceso de negocio
 */
export class MessagesBackendConstant {

  /** Mensaje cuando el USER intenta ingresar con una credenciales incorrecta */
  static readonly AUTENTICACION_FALLIDA: string =
    'El Usuario y la Contraseña que ingresó no ha sido reconocido';

  /** Mensaje cuando Las credenciales para la autenticación son incorrectos */
  static readonly CREDENCIALES_INCORRECTOS: string =
    'Las credenciales para la autenticación son incorrectos';

  /** Mensaje cuando el usuario intenta ingresar al recurso de ADMIN sin el TOKEN */
  static readonly AUTORIZACION_FALLIDA: string =
    'No estas autorizado para acceder a este recurso';

  /** Mensaje cuando se presenta un error interno en el servidor */
  static readonly INTERNAL_SERVER_ERROR: string =
    'Se presentó un error interno en el servidor ';

    static readonly CODIGO_LOTERIA_DUPLICADO: string =
    'Ya existe una loteŕia con la información ingresada ';

    static readonly EXITO_CREAR_LOTERIA: string =
    'Lotería creada con éxito ';

    static readonly ERROR_CREAR_LOTERIA: string =
    'Ocurrio un error al momento de crear la lotería ';

    static readonly EXITO_MODIFICACION_LOTERIA: string =
    'Solicitud de actualización enviada con exito ';

    static readonly ID_FIND_NULO: string =
    'Se debe ingresar un identificador para la busqueda ';

    static readonly NO_DATA: string =
    'No se encontraron resultados para la busqueda ';

    static readonly SIN_RELACION_EMPRESA_POR_IDUSUARIO: string =
    'No hay empresas asociadas al usuario ';

    static readonly SIN_ASOCIACION_PRODUCTOS_EMPRESA_SELECCIONADA: string =
    'Sin asociación de productos para la empresa seleccionada ';

    static readonly SIN_ASOCIACION_COMISION_PRODUCTOS_EMPRESA: string =
    'Sin asociación de comisiones para los productos seleccionados de la empresa ';
}
