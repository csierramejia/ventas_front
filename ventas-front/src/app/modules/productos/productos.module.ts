import { NgModule } from '@angular/core';
import { ChanceComponent } from './chance/chance.component';
import { RevisaPagoComponent } from './revisa-pago/revisa-pago.component';
import { ChanceMillonarioComponent } from './chance-millonario/chance-millonario.component';
import { RouterModule } from '@angular/router';
import { RouterConstant } from './../../constants/router.constant';
import { SharedModule} from '../shared/shared.module';
// OJOS QUITAR ESTE COMPONENTE
import { ApuestaChanceComponent } from './chance/apuesta-chance/apuesta-chance.component';
import {CardModule} from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';
import { SelectButtonModule } from 'primeng/selectbutton';
import {OverlayPanelModule} from 'primeng/overlaypanel';

// OJOS QUITAR ESTE COMPONENTE
import { BolsaComponent } from './genericos/bolsa/bolsa.component';
import { SummaryFooterComponent } from './genericos/summary-footer/summary-footer.component';
import { ConfirmacionAgregarCarritoComponent } from './genericos/confirmacion-agregar-carrito/confirmacion-agregar-carrito.component';


import { CrearClienteComponent } from './genericos/crear-cliente/crear-cliente.component';
import { BuscarClienteComponent } from './genericos/buscar-cliente/buscar-cliente.component';
import { ApuestaMillonariaComponent } from './chance-millonario/apuesta-millonaria/apuesta-millonaria.component';
import { SuperChanceComponent } from './super-chance/super-chance.component';
import { ApuestaSuperComponent } from './super-chance/apuesta-super/apuesta-super.component';
import { SuperAstroComponent } from './super-astro/super-astro.component';
import { ApuestaSuperAstroComponent } from './super-astro/apuesta-super-astro/apuesta-super-astro.component';
import { LoteriaVirtualComponent } from './loteria-virtual/loteria-virtual.component';
import { RecargasComponent } from './recargas/recargas.component';
import { RecargasOperadorComponent } from './recargas/regargas-operador/recargas-operador.component';
import { BolsaRecargasComponent } from './recargas/bolsa-recargas/bolsa-recargas.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuCarritoComponent } from './genericos/menu-carrito/menu-carrito.component';





@NgModule({
  declarations: [
    ChanceComponent,
    RevisaPagoComponent,
    ChanceMillonarioComponent,
    ApuestaChanceComponent,
    BolsaComponent,
    ConfirmacionAgregarCarritoComponent,
    SummaryFooterComponent,
    CrearClienteComponent,
    BuscarClienteComponent,
    ApuestaMillonariaComponent,
    SuperChanceComponent,
    ApuestaSuperComponent,
    SuperAstroComponent,
    ApuestaSuperAstroComponent,
    LoteriaVirtualComponent,
    RecargasComponent,
    RecargasOperadorComponent,
    BolsaRecargasComponent,
    MenuCarritoComponent
  ],
  
  imports: [
    RouterModule.forChild([
      {
        path: RouterConstant.ROUTER_CHANCE,
        component: ChanceComponent
      },
      {
        path: RouterConstant.ROUTER_REVISA_PAGO,
        component: RevisaPagoComponent
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
      }
    ]),
    SharedModule,
    CardModule,
    DialogModule,
    SelectButtonModule,
    SidebarModule,
    OverlayPanelModule,
    InputSwitchModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    MenuCarritoComponent
  ],
})
export class ProductosModule { }
