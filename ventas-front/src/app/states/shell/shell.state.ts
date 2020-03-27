import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ContentComponent } from '../../modules/shell/content/content.component';
import { ScreenST } from './shell-states/screen.st';
import { MenuST } from './shell-states/menu.st';
import { UserAccountST } from './shell-states/user-account.st';
import { TitleST } from './shell-states/title.st';
import { BreadCrumbST } from './shell-states/breadcrumb.st';

/**
 * Se utiliza para administrar el estado del Shell de la aplicacion
 */
@Injectable({ providedIn: 'root' })
export class ShellState {

  /** Administra el estado de la pantalla del dispositivo */
  public screen: ScreenST;

  /** Administra el estado de la miga de pan */
  public breadCrumb: BreadCrumbST;

  /** Administra el estado del menu de la aplicacion */
  public menu: MenuST;

  /** Administra el estado de la cuenta de usuario */
  public userAccount: UserAccountST;

  /** Se utiliza para la visualizacion de los titulos de las paginas */
  public title: TitleST;

  /** Componente del shell content para manipular el scroll del DIV content main */
  public contentComponent: ContentComponent;

  /**
   * Constructor donde se crea todo el modelo del estado del Shell
   * @param router, se utiliza para ser notificado cuando el router cambia
   */
  constructor(private router: Router) {
    // Estado de los titulos de las paginas
    this.title = new TitleST();

    // Estado para notificar el tamanio de la pantalla
    this.screen = new ScreenST();

    // Estado para administrar la cuenta del usuario
    this.userAccount = new UserAccountST();

    // Estado para administar la miga de pan
    this.breadCrumb = new BreadCrumbST();

    // Se utiliza para administrar el estado del Menu
    this.menu = new MenuST(this.screen, this.breadCrumb, this.router);
  }
}
