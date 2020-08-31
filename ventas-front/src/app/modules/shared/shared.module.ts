import { NgModule } from '@angular/core';
import { SharedCommonModule } from './shared-common.module';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { PrimengModule } from './primeng.module';
import { Hora24Pipe } from './../../pipes/hora-24.pipe';

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
    PrimengModule,
    Hora24Pipe
  ],
  providers: [
    DatePipe,
    CurrencyPipe
  ],
  declarations: [
    Hora24Pipe
  ],
})
export class SharedModule {}
