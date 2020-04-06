import { MenuItemDTO } from '../menu/menu-item.dto';

/**
 * DTO que contiene los datos del RESPONSE de bienvenida
 */
export class BienvenidaResponseDTO {

    /** son los items del menu */
    public itemsMenu: Array<MenuItemDTO>;
}
