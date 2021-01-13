import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoEspaciosBlancoDirective } from 'src/app/directives/espacios-blanco/no-espacios-blanco.directive';
import { AutofocusDirective } from 'src/app/directives/focus/autofocus.directive';
import { AutofocusAsyncDirective } from 'src/app/directives/focus/autofocus-async.directive';
import { BlockCopyPasteDirective } from 'src/app/directives/block-copy/block-copy-paste.directive';

/**
 * Modulo que contiene los artefactos comunes,
 * CommonModule, FormsModule y directivas, este modulo
 * no puede contener mas artefactos, dado que es utilizado
 * en el login y esta debe ser liviano en descargar en el browser
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NoEspaciosBlancoDirective,
    AutofocusDirective,
    AutofocusAsyncDirective,
    BlockCopyPasteDirective
  ],
  declarations: [
    NoEspaciosBlancoDirective,
    AutofocusDirective,
    AutofocusAsyncDirective,
    BlockCopyPasteDirective
  ]
})
export class SharedCommonModule {}
