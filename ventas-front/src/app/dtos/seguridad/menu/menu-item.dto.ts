import { MenuItemAccionDTO } from './menu-item-accion.dto';
import { MenuItem } from 'primeng/api/menuitem';

/**
 * DTO para encapsular los datos de un item del menu
 */
export interface MenuItemDTO extends MenuItem {

    /** son las acciones que tiene este item */
    acciones: Array<MenuItemAccionDTO>;
}
