import { SoatComponent } from './soat/soat.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterConstant } from '../../constants/router.constant';
import { SharedModule} from '../shared/shared.module';
import {CardModule} from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';

@NgModule({
  declarations: [
    SoatComponent,

  ],
  imports: [
    RouterModule.forChild([
      {
        path: RouterConstant.ROUTER_SOAT,
        component: SoatComponent
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
export class RecaudosModule { }
