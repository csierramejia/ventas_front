import { NgModule } from '@angular/core';
import { SharedCommonModule } from './shared-common.module';
import { DatePipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { PrimengModule } from './primeng.module';

/**
 * Modulo que contiene los artefactos para ser compartidos
 * para los modulos que se visualizan despues de la autenticacion
 */
@NgModule({
  imports: [
    SharedCommonModule,
    MaterialModule,
    PrimengModule
  ],
  exports: [
    SharedCommonModule,
    MaterialModule,
    PrimengModule
  ],
  providers: [
    DatePipe
  ],
  declarations: [
  ],
})
export class SharedModule {}
