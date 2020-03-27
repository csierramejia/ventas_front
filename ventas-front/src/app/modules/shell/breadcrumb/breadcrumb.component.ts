import { Component } from '@angular/core';
import { ShellState } from './../../../states/shell/shell.state';

/**
 * Miga de pan que se visualiza en el Shell de la aplicacion
 */
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {

  /**
   * @param shellState , se utiliza para obtener
   * los valores de la miga de pan
   */
  constructor(public shellState: ShellState) {}
}
