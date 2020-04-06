import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { ROUTES } from './autenticado-routing';
import { ShellModule } from '../shell/shell.module';


/**
 * Modulo que contiene todos los artefactos que el usuario
 * puede acceder despues de que se autentique en la app
 */
@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    ShellModule,
    SharedModule
  ],
  declarations: [
    BienvenidaComponent
  ],
  providers: [
  ]
})
export class AutenticadoModule { }
