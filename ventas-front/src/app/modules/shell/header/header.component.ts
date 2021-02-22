import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from './../../../constants/router.constant';
import { ShellState } from '../../../states/shell/shell.state';
import { MenuItem } from 'primeng/api';
import { LabelsConstant } from 'src/app/constants/labels.constant';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

/**
 * Es el Header del shell de la aplicacion, contiene el menu de las
 * configuraciones del usuario, cierre de sesion
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('icon-open-close', [
      state('icon-open-menu', style({ 'margin-left': '241px' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class HeaderComponent implements OnInit {

  
  /** Son los items a mostrar en el menu de user-settings */
  public items: MenuItem[];

  /**
   * @param shellState, se utiliza para mostrar/ocultar el menu
   * y validar el tamanio de la pantalla
   *
   * @param router, se utiliza para redireccionar a la pagina
   * de bienvenida
   */
  constructor(
    public shellState: ShellState,
    private router: Router) {}

  /**
   * Se construye el menu de configuracion de cuenta
   */
  ngOnInit() {
  

    this.construirItemsUser();
  }

  /**
   * Metodo que soporta el evento cerrar sesion del menu
   */
  public cerrarSesion(): void {
    this.shellState.cerrarSesion();
  }

  /**
   * Metodo que soporta el evento click del menu Pagina de inicio
   */
  public goToBienvenida(): void {
    this.router.navigate([RouterConstant.NAVIGATE_BIENVENIDA]);
  }

  /**
   * Metodo que soporta el evento click del menu Configuración de Cuenta
   */
  public goToConfiguracionCuenta(): void {
    this.router.navigate([RouterConstant.NAVIGATE_CUENTA_USER]);
  }

  /**
   * Metodo que permite construir los items del menu
   * de configuraciones para el Usuario
   */
  private construirItemsUser(): void {
    this.items = [
      {
        label: LabelsConstant.MENU_PAGINA_INICIO,
        icon: 'fa fa-fw fa-home font-size-18 mr-1',
        command: (click) => this.goToBienvenida()
      },
      {
        label: LabelsConstant.MENU_CUENTA_USER,
        icon: 'fa fa-fw fa-gear font-size-18 mr-1',
        command: (click) => this.goToConfiguracionCuenta()
      },
      { label: LabelsConstant.CERRAR_SESION,
        icon: 'fa fa-fw fa-power-off font-size-18 mr-1',
        command: (click) => this.cerrarSesion()
      }
    ];
  }
}
