import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-apuesta',
  templateUrl: './apuesta.component.html',
  styleUrls: ['./apuesta.component.css']
})
export class ApuestaComponent implements OnInit {

  @Output() chanceNumero: EventEmitter<any> = new EventEmitter();


  enabledThree = false;
  enabledTwo   = false;
  enabledOne   = false;


  chanceFormApuesta = new FormGroup({
    numero: new FormControl(''),
    numeroTres: new FormControl({value: '', disabled: true}),
    numeroDos: new FormControl({value: '', disabled: true}),
    numeroUno: new FormControl({value: '', disabled: true}),
    valorNumero: new FormControl(''),
    valorNumeroTres: new FormControl({value: '', disabled: true}),
    valorNumeroDos: new FormControl({value: '', disabled: true}),
    valorNumeroUno: new FormControl({value: '', disabled: true})
  });

  constructor() { }

  ngOnInit(): void {
  }

  validNumber(): void {
    if (String(this.chanceFormApuesta.get('numero').value).length === 4) {
      this.chanceNumero.emit(4);
    } else if (String(this.chanceFormApuesta.get('numero').value).length === 3) {
      this.chanceNumero.emit(3);
    }
  }

  /**
   * @author Luis Hernandez
   * @param isChecked
   * @description Metodo que se encarga activar
   * y desactivar los campos de apuesta para 3 cifras
   */
  /*activateThree(isChecked: boolean): void {
    if (isChecked) {
      this.chanceFormApuesta.controls.numeroTres.enable();
      this.chanceFormApuesta.controls.valorNumeroTres.enable();
    } else {
      this.chanceFormApuesta.controls.numeroTres.disable();
      this.chanceFormApuesta.controls.valorNumeroTres.disable();
    }
  }*/


  /**
   * @author Luis Hernandez
   * @param isChecked
   * @description Metodo que se encarga activar
   * y desactivar los campos de apuesta para 2 cifras
   */
  /*activateTwo(isChecked: boolean): void {
    if (isChecked) {
      this.chanceFormApuesta.controls.numeroDos.enable();
      this.chanceFormApuesta.controls.valorNumeroDos.enable();
    } else {
      this.chanceFormApuesta.controls.numeroDos.disable();
      this.chanceFormApuesta.controls.valorNumeroDos.disable();
    }
  }*/


  /**
   * @author Luis Hernandez
   * @param isChecked
   * @description Metodo que se encarga activar
   * y desactivar los campos de apuesta para 1 cifra
   */
  /*activateOne(isChecked: boolean): void {
    if (isChecked) {
      this.chanceFormApuesta.controls.numeroUno.enable();
      this.chanceFormApuesta.controls.valorNumeroUno.enable();
    } else {
      this.chanceFormApuesta.controls.numeroUno.disable();
      this.chanceFormApuesta.controls.valorNumeroUno.disable();
    }
  }*/

}
