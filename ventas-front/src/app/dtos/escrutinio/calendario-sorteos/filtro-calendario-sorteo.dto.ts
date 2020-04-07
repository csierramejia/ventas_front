import { PaginadorDTO } from '../../transversal/paginador.dto';
import { CalendarioDTO } from './calendario.dto';

/**
 * DTO que contiene los atributos para los filtros de busqueda para la
 * programacion de los sorteos parametrizados
 */
export class FiltroCalendarioSorteoDTO extends CalendarioDTO {

  /** paginador para la consulta de los sorteos */
  public paginador: PaginadorDTO;

  /** Este es el valor que apunta el componente hora */
  public horaSorteoFormat: string;

  /** filtro por el dia de programacion lunes */
  public filtroLunes: boolean;

  /** filtro por el dia de programacion martes */
  public filtroMartes: boolean;

  /** filtro por el dia de programacion miercoles */
  public filtroMiercoles: boolean;

  /** filtro por el dia de programacion jueves */
  public filtroJueves: boolean;

  /** filtro por el dia de programacion viernes */
  public filtroViernes: boolean;

  /** filtro por el dia de programacion sabado */
  public filtroSabado: boolean;

  /** filtro por el dia de programacion domingo */
  public filtroDomingo: boolean;
}
