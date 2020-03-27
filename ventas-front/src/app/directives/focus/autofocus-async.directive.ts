import { Directive, AfterViewInit, ElementRef } from '@angular/core';

/**
 * Directiva que permite configurar el focus para el input que lo requiera
 * dando una espera de n segundos, se utiliza cuando el input no es visible
 * de inmediato
 */
@Directive({
  selector: '[appAutofocusAsync]'
})
export class AutofocusAsyncDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 100);
  }
}
