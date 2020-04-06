import { Component } from '@angular/core';
import { ShellState } from './../../../states/shell/shell.state';

/**
 * Componente para el titulo de cada pagina
 */
@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {

  /**
   * @param shellState, se utiliza para tomar los
   * titulos y subtitulos a visualizar
   */
  constructor(public shellState: ShellState) {}
}
