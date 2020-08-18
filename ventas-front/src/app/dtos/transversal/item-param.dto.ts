import { ItemFiltroDTO } from './item-filtro.dto';
import { SelectItemApp } from './select-item-app';

/**
 * DTO que contiene los parametros para consultar los selectitems
 */
export class ItemParamDTO {

  /** Es el tipo de select item a consultar */
  public tipoItem: number;

  /** Filtro de busqueda al momento de capturar los items */
  public filtro: ItemFiltroDTO;

  /** Son los items consultador para este tipo de selecitems */
  public items: Array<SelectItemApp>;
}
