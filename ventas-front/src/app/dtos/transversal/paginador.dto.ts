/**
 * DTO que contiene los atributos del paginador, se debe
 * utilizar este DTO para las consultas masivas del sistema
 * que se muestran en un p-table
 */
export class PaginadorDTO {

  /** cantidad total de los registros */
  public cantidadTotal: number;

  /** es la cantidad de filas por paginas (0-10rowsPage, 10-10rowsPage, 20-10rowsPage) */
  public rowsPage: string;

  /** indica que cantidad va saltar en la consulta (skip0-10, skip10-10, skip20-10) */
  public skip: string;
}
