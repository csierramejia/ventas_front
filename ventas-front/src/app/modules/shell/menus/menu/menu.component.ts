import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api/menuitem';
import { RouterConstant } from 'src/app/constants/router.constant';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ShellState } from 'src/app/states/shell/shell.state';

/**
 * Es el Menu del shell a visualizar en la aplicacion
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('open', [
      state('open-item', style({ height: '0px' })),
      transition('* => *', animate(200))
    ])
  ]
})
export class MenuComponent implements OnInit {

  /** indica si el menu ya esta creado */
  public isStartUp = true;

  /**
   * @param shellState, se utiliza para obtener los Modulos
   * con sus items para ser visualizados en el menu
   *
   * @param router, se utiliza para redireccionar a la pagina
   * correspondiente de cada item del menu
   */
  constructor(
    public shellState: ShellState,
    private router: Router) {}

  /**
   * Se indica que el menu ya esta cargado
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.isStartUp = false;
    }, 450);
  }

  /**
   * Metodo que permite cambiar el estado expandido del menu
   */
  public toggle(item: MenuItem): void {
    item.expanded  = !item.expanded;
  }

  /**
   * Metodo que soporta el evento click del menu Pagina de inicio
   */
  public goToBienvenida(): void {
    this.router.navigate([RouterConstant.NAVIGATE_BIENVENIDA]);
  }
}
