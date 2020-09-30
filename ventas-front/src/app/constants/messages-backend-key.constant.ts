/**
 * Clase constante que contiene los identificadores
 * de los mensajes del negocio retornados del servidor
 */
export class MessagesBackendKeyConstant {

  /** 400 - El Usuario y la Contraseña que ingresó no ha sido reconocido. */
  static readonly KEY_AUTENTICACION_FALLIDA: string = 'security-0001';

  /** 400 - Las credenciales para la autenticación son incorrectos. */
  static readonly KEY_CREDENCIALES_INCORRECTOS: string = '0002';

  /** 400 - Las credenciales para la autenticación son incorrectos. */
  static readonly KEY_CODIGO_LOTERIA_DUPLICADO: string = '0003';

  /** 400 - Las credenciales para la autenticación son incorrectos. */
  static readonly KEY_CREACION_LOTERIA: string = '0004';

  /** 400 - Las credenciales para la autenticación son incorrectos. */
  static readonly KEY_MODIFICACION_LOTERIA: string = '0005';

  static readonly KEY_ERROR_CREACION_LOTERIA: string = '0006';

  static readonly KEY_ID_FIND_NULO: string = '0007';

  static readonly KEY_NO_DATA: string = '0008';

  static readonly KEY_SIN_RELACION_EMPRESA_POR_IDUSUARIO: string = '0020';
  static readonly KEY_SIN_ASOCIACION_PRODUCTOS_EMPRESA_SELECCIONADA: string = '0021';
  static readonly KEY_SIN_ASOCIACION_COMISION_PRODUCTOS_EMPRESA: string = '0022';

}


