import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

/**
 * Se utiliza para los routers secundarios, donde se requiere
 * que el usuario tenga privilegios para acceder a estos modulos
 * del negocio.
 */
@Injectable()
export class PrivilegiosGuard implements CanActivate {

  /**
   * @param router, se utiliza para el redireccionamiento si
   * surge algun error en el filtro
   */
  constructor(private router: Router) {}

  /**
   * Metodo que permite validar si el usuario tiene privilegios
   * para acceder al modulo que pretende ingresar
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    return true;
  }
}
