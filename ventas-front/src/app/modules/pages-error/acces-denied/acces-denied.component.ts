import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../constants/router.constant';

/**
 * Pagina de error cuando el usuario intenta ingresar
 * a una pagina que no tiene privilegios
 */
@Component({
  templateUrl: './acces-denied.component.html'
})
export class AccesDeniedComponent {
  constructor(private router: Router) { }

  /**
   * Metodo que soporta el evento de ir a la pagina de bienvenida
   */
  public goHome(): void {
    this.router.navigate([RouterConstant.NAVIGATE_BIENVENIDA]);
  }
}
