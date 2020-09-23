/**
 * Clase constante que contiene los valores estandar para el
 * paginador de consultas masivas del sistema
 */
export class PaginadorConstant {

  /** son las opciones para el paginador de las tablas */
  public static readonly ROWS_PER_PAGE_OPTIONS: Array<number> = [10, 20, 30, 40, 50];

  /** son las opciones para el paginador de las tablas */
  public static readonly ROWS_PER_PAGE_OPTIONS_MOVIENTOS: Array<number> = [10, 50, 100, 150, 200];

  /** Filas por pagina por default */
  public static readonly ROWS_PAGE_DEFAULT = '10';

  /** Es el salto inicial de la paginador */
  public static readonly SKIP_DEFAULT = '0';
}
