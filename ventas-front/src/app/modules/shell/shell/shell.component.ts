import { Component } from '@angular/core';
import { ShellState } from 'src/app/states/shell/shell.state';

/**
 * Es el body del shell de la aplicacion, contiene toda la estructura tales como
 * header, content, footer, el modulo shell exporta unicamente este componente
 * para que los demas componentes lo pueda incluir en sus modulos
 */
@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent {

  /**
   * @param shellState, se utiliza para la manipulacion del modal timeout
   */
  constructor(public shellState: ShellState) {}
}
