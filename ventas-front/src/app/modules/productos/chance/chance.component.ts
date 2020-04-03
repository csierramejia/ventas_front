import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-chance',
  templateUrl: './chance.component.html',
  styleUrls: ['./chance.component.css']
})
export class ChanceComponent implements OnInit {

  // variable calendario configuración idioma
  // es: any;

  loterias = [];
  apuestas = [];

  cartItems = [
     { numberPlayed: '1234', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     { numberPlayed: '2736', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
    // { numberPlayed: '1525', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
    // { numberPlayed: '6252', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
    // { numberPlayed: '2615', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
    // { numberPlayed: '1291', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
    // { numberPlayed: '8171', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
    // { numberPlayed: '1711', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
    // { numberPlayed: '1716', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
    // { numberPlayed: '3625', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 }
  ];

  enabledThree = false;
  enabledTwo = false;
  enabledOne = false;


  chanceForm = new FormGroup({
    fecha: new FormControl(''),
    numero: new FormControl(''),
    tipoChanceDirecto: new FormControl({value: '', disabled: true}),
    tipoChanceCombinado: new FormControl({value: '', disabled: true}),
    tresCifras: new FormControl({value: '', disabled: true}),
    dosCifras: new FormControl({value: '', disabled: true}),
    unaCifras: new FormControl({value: '', disabled: true}),
    valorNumero: new FormControl(''),
    valorNumeroTres: new FormControl({value: '', disabled: true}),
    valorNumeroDos: new FormControl({value: '', disabled: true}),
    valorNumeroUna: new FormControl({value: '', disabled: true})
  });

  constructor() { }

  ngOnInit(): void {
    // this.configInit();
  }

  /**
   * @author Luis Hernandez
   * @description Validamos de cuantas cifras es el
   * numero para saber que tipo de chance se va a realizar
   */
  validNumber(): void {
    if (String(this.chanceForm.get('numero').value).length === 4) {
      this.chanceForm.controls.tipoChanceDirecto.enable();
      this.chanceForm.controls.tipoChanceCombinado.enable();
    } else if (String(this.chanceForm.get('numero').value).length === 3) {
      this.chanceForm.controls.tipoChanceDirecto.disable();
      this.chanceForm.controls.tipoChanceCombinado.disable();

      this.enabledThree = false;
      this.enabledTwo = true;
      this.enabledOne = true;


    }
  }


  /**
   * @author Luis Hernandez
   * @description si el usuario selecciona modalidad
   * directo habilitamos los cambos de tres, dos y una cifra
   */
  enabledInputsMore(isChecked: boolean): void {
    if (this.chanceForm.controls.tipoChanceDirecto.status === 'VALID' && isChecked) {
      this.enabledThree = true;
      this.enabledTwo = true;
      this.enabledOne = true;
    } else {
      this.enabledThree = false;
      this.enabledTwo = false;
      this.enabledOne = false;
    }
  }


  enabledTresCifras(isChecked: boolean): void {
    if (isChecked) {


      console.log(String(this.chanceForm.controls.numero.value).substr(-3));

      this.chanceForm.controls.tresCifras.enable();
      this.chanceForm.controls.valorNumeroTres.enable();
    } else {
      this.chanceForm.controls.tresCifras.disable();
      this.chanceForm.controls.valorNumeroTres.disable();
    }
  }

  /**
   * @author Luis Hernandez
   * @description Metodo que se encargar de realizar
   * la preparación inicial del componente
   */
  /*configInit(): void {
    this.configCalendar();
  }*/


  /**
   * @author Luis Hernandez
   * @description Metodo que se encargar de inicializar
   * la configuración del calendario
   */
  /*configCalendar(): void {
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
      monthNamesShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'mm/dd/yy',
      weekHeader: 'Wk'
    };
  }*/

  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 3 cifras
   */
  /*getNumberThree(): void {
    console.log(Math.round(Math.random() * (100 - 999) + 999 ));
  }*/


  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 4 cifras
   */
  /*getNumberFour(): void {
    console.log(Math.round(Math.random() * (1000 - 9999) + 9999 ));
  }*/



  /*chanceNumero(e): void {
    console.log('llego el numero');
    console.log(e);
    console.log('llego el numero');
  }*/



}
