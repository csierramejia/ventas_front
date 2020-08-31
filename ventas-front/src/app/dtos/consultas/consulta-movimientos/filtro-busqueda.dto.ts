import { PaginadorDTO } from '../../transversal/paginador.dto';


/**
 * DTO que contiene los atributos para los filtros de
 * busqueda de las solicitudes realizadas en el sistema
 */
export class FiltroBusquedaDTO {

  /** Filtro por algun identificador */
  public id: number;

  /** Paginador para obtener los resultados de la busqueda */
  public paginador: PaginadorDTO;

  /** Fecha de inicio de la solicitud */
  public fechaInicio: Date;

  /** Fecha de final de la solicitud */
  public fecha: Date;

  /** filtro indica que tipo de reporte mostrar detallado/agrupado */
  public tipoReporte: string;

   /** Son los ids de los productos */
   public idProductos: Array<number>;


}
