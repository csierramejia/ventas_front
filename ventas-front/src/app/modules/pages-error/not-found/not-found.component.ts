import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../constants/router.constant';

/**
 * Pagina de error cuando el usuario ingresa a una
 * ruta que no esta configurada en el sistema
 * page not found
 */
@Component({
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  /**
   * Metodo que soporta el evento de ir a la pagina de bienvenida
   */
  public goHome(): void {
    this.router.navigate([RouterConstant.NAVIGATE_BIENVENIDA]);
  }
}
