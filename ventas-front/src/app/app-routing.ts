import { Routes } from '@angular/router';
import { RouterConstant } from './constants/router.constant';
import { AutenticacionGuard } from './auth-guard/autenticacion.guard';

/**
 * Constante que contiene todos los router de cada modulo del
 * core de la aplicacion, esta constante es importado solamente
 * del modulo core o principal 'app.module.ts'
 */
export const ROUTES: Routes = [
  {
    path: RouterConstant.ROUTER_LOGIN,
    canActivate: [AutenticacionGuard],
    data: { preload: true },
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: RouterConstant.ROUTER_AUTENTICADO,
    canActivate: [AutenticacionGuard],
    data: { preload: true },
    loadChildren: () => import('./modules/autenticado/autenticado.module').then(m => m.AutenticadoModule)
  },
  {
    path: RouterConstant.ROUTER_ERROR,
    loadChildren: () => import('./modules/pages-error/pages-error.module').then(m => m.PagesErrorModule)
  },
  {
    path: '',
    redirectTo: RouterConstant.ROUTER_LOGIN,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: RouterConstant.ROUTER_ERROR,
    pathMatch: 'full'
  }
];
