import { Component, OnInit } from '@angular/core';
import { ShellState } from '../../../states/shell/shell.state';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

/**
 * Componente que contiene el router para incluir los demas componentes
 * dependiendo de la navegacion, este componente tambien contiene los menus
 * para dispositivos con resolucion grande y pequenia
 */
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger('openClose', [
      state('open-menu', style({ left: '0px' })),
      state('closed-menu', style({ left: '-240px', 'min-width': '0px', width: '0px' })),
      state('open-menu-content', style({ 'margin-left' : '241px' })),
      state('closed-menu-content', style({ 'margin-left' : '0px' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class ContentComponent implements OnInit {

  /**
   * @param shellState, se utiliza para mostrar/ocultar el menu
   * y validar el tamanio de la pantalla
   */
  constructor(public shellState: ShellState) {}

  /**
   * Se utiliza para pasar la instancia de este shell content
   */
  ngOnInit() {
    this.shellState.contentComponent = this;
  }

  /**
   * Metodo que permite fijar el scroll del DIV content
   * main en una posicion determinada con un tiempo delay
   */
  public setPositionScrollDelay(position: number) {
    setTimeout(() => {
      (function setPositionScrollFunction() {
        const div = document.getElementById('maincontent');
        if (div) {
          div.scrollTop = position;
        }
      })();
    }, 10);
  }

  /**
   * Metodo que permite fijar el scroll del DIV content
   * main en una posicion determinada
   */
  public setPositionScroll(position: number) {
    (function setPositionScrollFunction() {
      const div = document.getElementById('maincontent');
      if (div) {
        div.scrollTop = position;
      }
    })();
  }

  /**
   * Metodo que permite retornar la posicion del scroll del DIV content main
   */
  public getPositionScroll(): number {
    let response;
    (function getPositionScrollFunction() {
      const div = document.getElementById('maincontent');
      if (div) {
        response = div.scrollTop;
      }
    })();
    return response;
  }

  /**
   * Metodo que permite fijar el scroll del DIV content
   * en la parte de abajo del navegador
   */
  public setPositionScrollBottomDelay() {
    setTimeout(() => {
      (function setPositionScrollFunction() {
        const div = document.getElementById('maincontent');
        if (div) {
          div.scrollTop = div.scrollHeight;
        }
      })();
    }, 10);
  }

}
