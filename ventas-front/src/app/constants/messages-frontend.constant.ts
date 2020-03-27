/**
 * Clase constante que contiene los mensajes personalizados
 * para las interfaces graficas, tales como mensajes de
 * confirmacion, seguridad etc
 */
export class MsjFrontConstant {

  /** Titulo de EXITOSO */
  static readonly EXITOSO: string = 'Exitoso:';

  /** Titulo de ERROR */
  static readonly ERROR: string = 'Error:';

  /** Titulo de INFORMACION */
  static readonly INFORMACION: string = 'Información:';

  /** Titulo de ADVERTENCIA */
  static readonly ADVERTENCIA: string = 'Advertencia:';

  /** Titulo de CONFIRMACION */
  static readonly CONFIRMACION: string = 'Ventana de Confirmación';

  /** Mensaje cuando quieren salir de una pagina de creacion o edicion */
  static readonly SEGURO_SALIR: string = '¿Está seguro que desea salir?';

  /** Mensaje cuando quieren salir sin aplicar cambios */
  static readonly SEGURO_SALIR_EDICION: string = '¿Seguro que desea salir sin aplicar los cambios?';

  /** Mensaje cuando se crea un nuevo sorteo */
  static readonly EXITO_CREACION_SORTEO: string = 'La solicitud de autorización para la creación de sorteos ha sido enviada con éxito';

  /** Mensaje cuando se cancela un sorteo */
  static readonly EXITO_CANCELACION_SORTEO: string = 'Solicitud de cancelación enviada con éxito';

  /** Mensaje de confirmacion para aplicar los cambios */
  static readonly APLICAR_CAMBIOS: string = '¿Está seguro que desea aplicar los cambios?';

  /** Mensaje cuando se edita un sorteo */
  static readonly EXITO_EDICION_SORTEO: string = 'Solicitud de modificación enviada con éxito';

  /** Mensaje cuando la fecha inicial solictud es mayor que la fecha final */
  static readonly FECHA_INICIAL_MAYOR: string = 'La fecha inicio debe ser menor o igual que la fecha final';

  /** Mensaje se debe seleccionar al menos un dia para el calendario sorteo */
  static readonly DIA_REQUERIDO: string = 'Seleccione los día(s) qué juega el sorteo con su hora';

  /** Mensaje se debe seleccionar la hora para el dia seleccionado */
  static readonly HORA_REQUERIDO: string = 'La hora del día qué juega el sorteo es obligatorio';

  static readonly PRODUCTOS_POR_LOTERIAS: string = 'Debe seleccionar por lo menos un producto';

  static readonly EXITO_CREACION_LOTERIAS: string = 'Lotería creada exitosamente';

  static readonly EXITO_ACTUALIZACION_LOTERIAS: string = 'Solicitud de actualización enviada con exito';

  static readonly NO_SELECCION_EMPRESA: string = 'Se debe seleccionar una empresa para la  busqueda de productos';

  static readonly EXITO_CREACION_NUMERO_GANADOR: string = 'Número ganador registrado exitosamente';

  static readonly NO_ASIGNO_VALOR_COMISION: string = 'Debe ingresar porcentaje o valor fijo de la comisión';

   /** Mensaje cuando se crea o modifica una nueva asociación empresa, producto, comisión, cuenta */
   static readonly EXITO_ASOCIAR_CONFIGURACION_EMP_PRO_COM_CUE: string = 'La asociación  ha sido enviada con éxito';
   static readonly EXITO_ASOCIAR_PRODUCTO_EMPRESA: string = 'La asociación  del producto ha sido enviada con éxito';
   static readonly EXITO_ASOCIAR_COMISION_PRODUCTO_EMPRESA: string = 'La asociación de la comisión ha sido enviada con éxito';
   static readonly EXITO_ASOCIAR_CUENTA_PRODUCTO_EMPRESA: string = 'La asociación de la cuenta ha sido enviada con éxito';

 
  static readonly VALIDACION_NUMEROS_LOTERIA: string = 'Los números ingresados no coinciden';

  static readonly NO_SELECCION_LOTERIA: string = 'Debe seleccionar una loteria';

  static readonly NO_SELECCION_FECHA: string = 'Debe seleccionar una fecha de sorteo';


}

