import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterConstant } from './../../constants/router.constant';
import { SharedModule} from '../shared/shared.module';
import {CardModule} from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';
import { ConsultaMovimientosComponent } from './../consultas/consulta-movimientos/consulta-movimientos.component';

@NgModule({
  declarations: [
    ConsultaMovimientosComponent,

  ],
  imports: [
    RouterModule.forChild([
      {
        path: RouterConstant.ROUTER_CONSULTA_MOVIMIENTOS,
        component: ConsultaMovimientosComponent
      },
    ]),
    SharedModule,
    CardModule,
    DialogModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class ConsultasModule { }
