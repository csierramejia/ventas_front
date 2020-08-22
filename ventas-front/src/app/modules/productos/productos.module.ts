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
import { SuperChanceComponent } from './super-chance/super-chance.component';
import { ApuestaSuperComponent } from './super-chance/apuesta-super/apuesta-super.component';
import { SuperAstroComponent } from './super-astro/super-astro.component';
import { ApuestaSuperAstroComponent } from './super-astro/apuesta-super-astro/apuesta-super-astro.component';
import { LoteriaVirtualComponent } from './loteria-virtual/loteria-virtual.component';
import { RecargasComponent } from './recargas/recargas.component';
import { RecargasOperadorComponent } from './recargas/regargas-operador/recargas-operador.component';
import { BolsaRecargasComponent } from './recargas/bolsa-recargas/bolsa-recargas.component';

@NgModule({
  declarations: [
    ChanceComponent,
    ChanceMillonarioComponent,
    ApuestaComponent,
    BolsaComponent,
    CrearClienteComponent,
    ApuestaMillonariaComponent,
    SuperChanceComponent,
    ApuestaSuperComponent,
    SuperAstroComponent,
    ApuestaSuperAstroComponent,
    LoteriaVirtualComponent,
    RecargasComponent,
    RecargasOperadorComponent,
    BolsaRecargasComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: RouterConstant.ROUTER_CHANCE,
        component: ChanceComponent
      },
      {
        path: RouterConstant.ROUTER_CHANCE_MILLONARIO,
        component: ChanceMillonarioComponent
      },
      {
        path: RouterConstant.ROUTER_SUPER_CHANCE,
        component: SuperChanceComponent
      },
      {
        path: RouterConstant.ROUTER_SUPER_ASTRO,
        component: SuperAstroComponent
      },
      {
        path: RouterConstant.ROUTER_LOTERIA_VIRTUAL,
        component: LoteriaVirtualComponent
      },
      {
        path: RouterConstant.ROUTER_RECARGAS,
        component: RecargasComponent
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
export class ProductosModule { }
