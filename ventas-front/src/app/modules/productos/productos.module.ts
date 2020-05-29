import { NgModule } from '@angular/core';
import { ChanceComponent } from './chance/chance.component';
import { ChanceMillonarioComponent } from './chance-millonario/chance-millonario.component';
import { RouterModule } from '@angular/router';
import { RouterConstant } from './../../constants/router.constant';
import { SharedModule} from '../shared/shared.module';
import { ApuestaComponent } from './chance/apuesta/apuesta.component';
import {CardModule} from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';
import { BolsaComponent } from './chance/bolsa/bolsa.component';
import { CrearClienteComponent } from './chance/crear-cliente/crear-cliente.component';
import { ApuestaMillonariaComponent } from './chance-millonario/apuesta-millonaria/apuesta-millonaria.component';


@NgModule({
  declarations: [ChanceComponent,ChanceMillonarioComponent, ApuestaComponent, BolsaComponent, CrearClienteComponent,ApuestaMillonariaComponent],
  imports: [
    RouterModule.forChild([
      {
        path: RouterConstant.ROUTER_CHANCE,
        component: ChanceComponent
      },
      {
        path: RouterConstant.ROUTER_CHANCE_MILLONARIO,
        component: ChanceMillonarioComponent
      }
    ]),
    SharedModule,
    CardModule,
    DialogModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class ProductosModule { }
