import { NgModule } from '@angular/core';
import { ChanceComponent } from './chance/chance.component';
import { SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { RouterConstant } from '../../constants/router.constant';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: RouterConstant.ROUTER_CHANCE,
        component: ChanceComponent
      }
    ]),
    SharedModule
  ],
  declarations: [
    ChanceComponent
  ]
})
export class VentasModule { }
