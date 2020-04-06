import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { RouterConstant } from './../../constants/router.constant';
import { ShellComponent } from '../shell/shell/shell.component';
import { PrivilegiosGuard } from 'src/app/auth-guard/privilegios.guard';


/**
 * Constante que contiene todos los routers que el usuario
 * puede acceder despues de que se autentique en la app
 */
export const ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: RouterConstant.ROUTER_BIENVENIDA,
        component: BienvenidaComponent
      },
      {
        path: RouterConstant.ROUTER_PRODUCTOS,
        canActivate: [PrivilegiosGuard],
        data: { preload: true},
        loadChildren: () => import('../productos/productos.module').then(m => m.ProductosModule)
      },
    ]
  }
];
