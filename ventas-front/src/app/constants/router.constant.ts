/**
 * Clase constante que contiene todo los ROUTER del app
 */
export class RouterConstant {

  /** Router para el modulo del LOGIN */
  public static readonly ROUTER_LOGIN: string = 'login';

  /** Router para el modulo del PRODUCTOS */
  public static readonly ROUTER_PRODUCTOS: string = 'productos';

  /** Router para el componente de chance */
  public static readonly ROUTER_CHANCE: string = 'chance';

   /** Router para el componente de chance */
   public static readonly ROUTER_CHANCE_MILLONARIO: string = 'chance-millonario';

  /** Router para el modulo del PAGINAS DE ERRORES */
  public static readonly ROUTER_ERROR: string = 'error';

  /** Router para la pagina de error cuando el usuario no tiene permisos */
  public static readonly ROUTER_DENEGADO: string = 'denegado';

  /** Router que se utiliza cuando el user esta autenticado */
  public static readonly ROUTER_AUTENTICADO: string = 'autenticado';

  /** Router para la pagina BIENVENIDA */
  public static readonly ROUTER_BIENVENIDA: string = 'bienvenida';

  /** Nombre del Router para la pagina de admin cuenta del user */
  public static readonly ROUTER_CUENTA_USER: string = 'cuentauser';

  /** Router para el modulo de LOTERIAS */
  // public static readonly ROUTER_CHANCE: string = 'chance';

  /** Router para el modulo de ESCRUTINIO */
  public static readonly ROUTER_VENTAS: string = 'ventas';

  /** Constante para navegar al modulo de LOGIN */
  public static readonly NAVIGATE_LOGIN: string = `/${RouterConstant.ROUTER_LOGIN}`;

  /** Constante para navegar a la pagina de PERMISOS DENEGADO */
  public static readonly NAVIGATE_DENEGADO: string = `/${RouterConstant.ROUTER_ERROR}/${RouterConstant.ROUTER_DENEGADO}`;

  /** Constante para navegar a la pagina de BIENVENIDA */
  public static readonly NAVIGATE_BIENVENIDA: string = `/${RouterConstant.ROUTER_AUTENTICADO}/${RouterConstant.ROUTER_BIENVENIDA}`;

  /** Constante para navegar a la pagina de ADMIN CUENTA USER */
  public static readonly NAVIGATE_CUENTA_USER: string = `/${RouterConstant.ROUTER_AUTENTICADO}/${RouterConstant.ROUTER_CUENTA_USER}`;

  /** Constante para navegar a la pagina de BIENVENIDA */
  public static readonly NAVIGATE_CHANCE: string = `/${RouterConstant.ROUTER_CHANCE}/${RouterConstant.ROUTER_BIENVENIDA}`;

} 
