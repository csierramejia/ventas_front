import { NgModule } from '@angular/core';
import { ChanceComponent } from './chance/chance.component';
import { RouterModule } from '@angular/router';
import { RouterConstant } from './../../constants/router.constant';
import { SharedModule} from '../shared/shared.module';
import { ApuestaComponent } from './chance/apuesta/apuesta.component';
import {CardModule} from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule} from 'primeng/sidebar';
import { BolsaComponent } from './chance/bolsa/bolsa.component';


@NgModule({
  declarations: [ChanceComponent, ApuestaComponent, BolsaComponent],
  imports: [
    RouterModule.forChild([
      {
        path: RouterConstant.ROUTER_CHANCE,
        component: ChanceComponent
      }
    ]),
    SharedModule,
    CardModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class ProductosModule { }
