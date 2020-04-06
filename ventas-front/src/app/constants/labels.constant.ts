/**
 * Clase constante que contiene todas las etiquetas tales como
 * titulos del menu, label para botones, items del menu etc
 */
export class LabelsConstant {

  /** Titulo para el componente Administracion de sorteos */
  public static readonly TITLE_CALENDARIO_SORTEOS: string = 'Calendario Sorteos';

  /** subtitulo para el componente Administracion de sorteos */
  public static readonly SUBTITLE_CALENDARIO_SORTEOS: string =
  'Página que permite al usuario configurar o parametrizar los sorteos para cada lotería';

  /** Titulo configuracion de cuenta para el menu */
  public static readonly MENU_CUENTA_USER: string = 'Configuración de Cuenta';

  /** Label cerrar sesion */
  public static readonly CERRAR_SESION: string = 'Cerrar Sesión';

  /** Titulo pagina de inicio para el menu */
  public static readonly MENU_PAGINA_INICIO: string = 'Página de Inicio';

  /** Es el KEY para identificar el componente mensajes debajo del titulo */
  public static readonly KEY_MESSAGE: string = 'msj';

  /** Es el KEY para identificar el componente mensajes debajo del titulo informativo */
  public static readonly KEY_MESSAGE_INFO: string = 'inf';

  /** Es el KEY para identificar el componente tipo TOAST */
  public static readonly KEY_TOAST: string = 'toast';

  /** Es el KEY para identificar el componente tipo TOAST extra long */
  public static readonly KEY_TOAST_EXLONGER: string = 'toastExtraLong';

  /** Es el KEY para identificar el componente tipo TOAST LONGER */
  public static readonly KEY_TOAST_LONGER: string = 'toastLonger';

  /** Es el KEY para identificar el componente tipo TOAST MEDIUM */
  public static readonly KEY_TOAST_MEDIUM: string = 'toastMedium';

  /** Son los tipos de severity */
  public static readonly SUCCESS: string = 'success';
  public static readonly INFO: string = 'info';
  public static readonly WARN: string = 'warn';
  public static readonly ERROR: string = 'error';

  /** constante para el idioma espaniol para los calendar */
  public static readonly CALENDAR_SPANISH: any = {
    firstDayOfWeek: 1,
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
      'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Borrar'
  };

  /** Formato de fecha estandar para aplicacion web */
  public static readonly FECHA_FORMATO: string = 'yyyy-MM-dd';
}
