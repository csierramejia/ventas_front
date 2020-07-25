import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ScreenST } from './screen.st';
import { BreadCrumbST } from './breadcrumb.st';
import { RouterConstant } from '../../../constants/router.constant';
import { TipoEventoConstant } from './../../../constants/tipo-evento.constant';
import { SessionStoreUtil } from 'src/app/utilities/session-store.util';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { LabelsConstant } from 'src/app/constants/labels.constant';
import { MenuItemDTO } from 'src/app/dtos/seguridad/menu/menu-item.dto';
import { MenuItem } from 'primeng/api/menuitem';

/**
 * Se utiliza para administrar el estado del Menu
 */
export class MenuST {

  /** Se utiliza para mostrar/ocultar el menu */
  public isMenuOpen = false;

  /** Indica si el toogle del menu se visualiza por primera vez */
  public isToogleMenuFirstTime = true;

  /** Son los modulos a visualizar en el menu */
  public modulos: Array<MenuItemDTO>;

  /** Contiene la subscripcion del router */
  private subscriptionRouter: Subscription;

  /**
   * Cuando se carga la pagina se crea la instancia del estado del menu,
   * se debe tomar los datos del session-store, ya que en este punto son nulos
   *
   * @param screen, se utiliza para validar el tamanio de la pantalla
   * @param bread, se utliza para configurar los datos de la miga de pan
   * @param router, se utiliza para ser notificado cuando el router cambia
   */
  constructor(
    public screen: ScreenST,
    private bread: BreadCrumbST,
    private router: Router) {
    this.init();
  }

  /**
   * Metodo que es invocado del constructor de este State
   */
  private init(): void {

    // se obtiene los datos de la autenticacion del session-store
    const auth: AutenticacionResponseDTO = SessionStoreUtil.auth(TipoEventoConstant.GET);

    // se valida que el user si este autenticado
    if (auth && auth.usuario && auth.usuario.idUsuario) {

      // se obtiene los items asociados al usuario del session store
      const items: Array<MenuItemDTO> = SessionStoreUtil.menu(TipoEventoConstant.GET);
      if (items && items.length > 0) {

        // se configura los items
        this.modulos = items;

        // se obtiene la suscripcion del router para ser notificado
        this.getSuscribeRouter();
      }
    }
  }

  /**
   * Metodo que permite inicializar el Menu, construyendo
   * sus items dependiendo de los privilegios del usuario
   *
   * @param itemsMenu, son los items del menu
   */
  public initMenu(itemsMenu: Array<MenuItemDTO>): void {

    // se configura los items del menu con su pagina de inicio
    this.modulos = itemsMenu;

    // se obtiene la suscripcion del router para ser notificado
    this.getSuscribeRouter();

    // se configura los items del menu en el localstore
    SessionStoreUtil.menu(TipoEventoConstant.SET, this.modulos);
  }

  /**
   * Metodo que permite destruir el Menu liberando memoria,
   * es llamado cuando se cierra la sesion del usuario
   */
  public destroyMenu(): void {
    this.isMenuOpen = false;
    this.isToogleMenuFirstTime = true;
    this.modulos = null;
    if (this.subscriptionRouter) {
      this.subscriptionRouter.unsubscribe();
    }
  }

  /**
   * Metodo que soporta el evento click del boton
   * toogle del menu que se visualiza en el header
   */
  public toggleMenu(): void {
    if (this.isToogleMenuFirstTime && this.screen.isBigScreen()) {
      this.isMenuOpen = true;
    }
    this.isMenuOpen = !this.isMenuOpen;
    this.isToogleMenuFirstTime = false;
  }

  /**
   * Se hace la suscripcion con el router para ser notificado
   * cada vez que el router cambie su navegacion
   */
  private getSuscribeRouter(): void {
    this.subscriptionRouter = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.notificarItemSeleccionado(val.url);
      }
    });
  }

  /**
   * Metodo que permite notificar el cambio de navegacion
   * al componente miga de pan, para asi pintar la ubicacion
   *
   * @param url, es la nueva url donde el usuario va navegar
   */
  private notificarItemSeleccionado(url: string): void {

    // miga de pan para la pagina de inicio
    if (url.includes(RouterConstant.NAVIGATE_BIENVENIDA)) {
      this.bread.modulo = LabelsConstant.MENU_PAGINA_INICIO;
      this.bread.icono = 'fa-home';
      this.bread.url = null;
      return;
    }

    // miga de pan para la pagina de configuracion cuenta
    if (url.includes(RouterConstant.ROUTER_CUENTA_USER)) {
      this.bread.modulo = LabelsConstant.MENU_CUENTA_USER;
      this.bread.icono = 'fa-gear';
      this.bread.url = null;
      return;
    }

    // programacion defensiva para los modulos
    if (this.modulos) {

      // se recorre todos los modulos para validar el router de sus items
      let itemFound: MenuItem;
      for (const modulo of this.modulos) {

        // se recorre los items de este modulo validando su router
        itemFound = this.findItemRecursive(modulo.items as MenuItemDTO[], url);
        if (itemFound) {
          this.bread.icono = modulo.icon;
          this.bread.modulo = modulo.label;
          this.bread.url = ' / ' + this.bread.url;
        }
      }
    }
  }

  /**
   * Metodo recursivo para buscar el item seleccionado en el menu
   *
   * @param items, lista de items asociados a un modulo
   * @param url, es la nueva url donde el usuario va navegar
   */
  private findItemRecursive(items: MenuItem[], url: string): MenuItem {
    let itemFound: MenuItem = null;

    // se recorre todos los items
    for (const item of items) {

      // se verifica si este item tiene mas items
      if (item.items) {

        // si hay item seleccionado se configura la miga de pan
        if (itemFound) {
          this.findItemRecursive(item.items as MenuItemDTO[], url);
        } else {
          itemFound = this.findItemRecursive(item.items as MenuItemDTO[], url);
          if (itemFound) {
            this.bread.url = item.label + '/' + this.bread.url;
          }
        }
      }

      // se verifica si este item fue seleccionado por el user
      if (item.routerLink === url) {
        itemFound = item;
        this.bread.url = itemFound.label;
      }
    }
    return itemFound;
  }
}
