import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductosService } from '../../productos.service';
import { MessageService } from 'primeng/api';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonComponent } from 'src/app/utilities/common.component';
import { FechaUtil } from 'src/app/utilities/fecha-util';
import { CommonService } from 'src/app/utilities/common.service';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { CrearClienteComponent } from '../../genericos/crear-cliente/crear-cliente.component';
import * as moment from 'moment';

@Component({
  selector: 'app-apuesta-chance',
  templateUrl: './apuesta-chance.component.html',
  styleUrls: ['./apuesta-chance.component.css'],
  providers: [ProductosService, CommonService]
})
export class ApuestaChanceComponent extends CommonComponent implements OnInit  {

  @Output() agregarLoterias: EventEmitter<any> = new EventEmitter();
  @Output() agregarNumeros: EventEmitter<any> = new EventEmitter();
  @Output() agregarCliente: EventEmitter<any> = new EventEmitter();

  

  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;

  pCalendarioValor: Date;

  /** Es el correo del cliente quien hace la compra */
  private correoCustomer: string;
  enabledCustomer = false;
  idCustomer = '';
  displayModalCreate = false;
  edit = false;
  infoEdit:any;
  dayBet: Date;
  fechaActual: Date;
  loterias = [];
  rutaServidor: string;
  loteriasSeleccionadas = [];
  checked = false;
  days = [
    { text: 'L', name: 'lun', date: null },
    { text: 'M', name: 'mar', date: null },
    { text: 'M', name: 'mie', date: null },
    { text: 'J', name: 'jue', date: null },
    { text: 'V', name: 'vie', date: null },
    { text: 'S', name: 'sab', date: null },
    { text: 'D', name: 'dom', date: null }
  ];


  chanceForm = new FormGroup({
    numeroFilaUno: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaUno: new FormControl({value: '', disabled: true}),
    combinadoFilaUno: new FormControl({value: '', disabled: true}),
    dosCifrasFilaUno: new FormControl({value: '', disabled: true}),
    unaCifraFilaUno: new FormControl({value: '', disabled: true}),

    numeroFilaDos: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaDos: new FormControl({value: '', disabled: true}),
    combinadoFilaDos: new FormControl({value: '', disabled: true}),
    dosCifrasFilaDos: new FormControl({value: '', disabled: true}),
    unaCifraFilaDos: new FormControl({value: '', disabled: true}),

    numeroFilaTres: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaTres: new FormControl({value: '', disabled: true}),
    combinadoFilaTres: new FormControl({value: '', disabled: true}),
    dosCifrasFilaTres: new FormControl({value: '', disabled: true}),
    unaCifraFilaTres: new FormControl({value: '', disabled: true}),


    numeroFilaCuatro: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaCuatro: new FormControl({value: '', disabled: true}),
    combinadoFilaCuatro: new FormControl({value: '', disabled: true}),
    dosCifrasFilaCuatro: new FormControl({value: '', disabled: true}),
    unaCifraFilaCuatro: new FormControl({value: '', disabled: true}),

    numeroFilaCinco: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaCinco: new FormControl({value: '', disabled: true}),
    combinadoFilaCinco: new FormControl({value: '', disabled: true}),
    dosCifrasFilaCinco: new FormControl({value: '', disabled: true}),
    unaCifraFilaCinco: new FormControl({value: '', disabled: true}),

    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombreCliente: new FormControl(''),
    
  });

  



  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private commonService: CommonService
  ) {
    super();
    // obtenemos el semanario
    this.setDaysServicio();
  }


  ngOnInit(): void {
  }


  /**
   * @author Luis Hernandez
   * @description Por medio de este metodo marcamos con color verde el dia de la apuesta y setiamos la fecha
   * @param day
   */
  get_date_bet(day) {
    console.log(day.date)
    this.dayBet = day.date;
    const fechaA = this.fechaActual;
    const fechaB = FechaUtil.stringToDate(this.dayBet.toString());
    if (fechaB < fechaA) {
      fechaB.setDate(fechaB.getDate() + 7);
      this.dayBet = fechaB;
    } else {
     this.dayBet = FechaUtil.stringToDate(this.dayBet.toString());
    }
    // colocamos color al dia seleccionamos y le quitamos a los demas
    this.days.forEach(element => {
      if (element.name === day.name) {
        const chip = document.getElementById(day.name);
        chip.style.backgroundColor = '#BE1E42';
        chip.style.color = '#fff';
      } else {
        const chip = document.getElementById(element.name);
        chip.style.backgroundColor = '#FFFFFF';
        chip.style.color = '#BE1E42';
      }
    });

    this.checked = false;

    // llamamos el metodo que se encarga de consultar las loterias
    this.getLotteries();
  }



  /**
   * @description Metodo que se encarga de traer los dias del semanario
   */
  setDaysServicio(): void {
    this.productosService.consultarSemanaServidor().subscribe(
      dias => {
        const rs: any = dias;
        this.fechaActual = FechaUtil.stringToDate(rs[7].toString());
        let contador = 0;
        rs.forEach(element => {
          if (contador >= 7) { return; }
          contador++;
          const date = FechaUtil.stringToDate(element.toString());
          if (date.getDay() === 1) {
            this.days[0].date = element;
          } else if (date.getDay() === 2) {
            this.days[1].date = element;
          } else if (date.getDay() === 3) {
            this.days[2].date = element;
          } else if (date.getDay() === 4) {
            this.days[3].date = element;
          } else if (date.getDay() === 5) {
            this.days[4].date = element;
          } else if (date.getDay() === 6) {
            this.days[5].date = element;
          } else if (date.getDay() === 0) {
            this.days[6].date = element;
          }
        });
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }




  /**
   * @author Luis Hernandez
   * @description funcion que llama al servicio
   * de loterias y trae las loterias disponibles
   * según el día
   */
  getLotteries(): void {
    this.loterias = [];
    this.productosService.consultarLoterias(this.dayBet, 2).subscribe(
      loteriasData => {
        const rs: any = loteriasData;
        rs.forEach(element => {
          this.loterias.push({
            idLoteria: element.idLoteria,
            codigo: element.codigo,
            nombre: element.nombre,
            nombreCorto: element.nombreCorto,
            telefono: element.telefono,
            idEstado: element.idEstado,
            idEmpresa: element.idEmpresa,
            idSorteo: element.idSorteo,
            idSorteoDetalle: element.idSorteoDetalle,
            checked: false,
            url: this.rutaServidor + element.nombreImagen,
            horaSorteo: element.horaSorteo
          });
        });
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );

    const emitLoterias = {
      loterias:this.loterias,
      fechaSeleccionApuesta:this.dayBet
    }
    this.agregarLoterias.emit(emitLoterias);
  }



  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de marcar
   * y desmarcar un checkbox seleccionado por el usuario
   * @param event
   * @param loteria
   */
  toggleVisibility(loteria): void {
    const keyResponse = this.getKeyObject(loteria.idLoteria);
    if (this.loterias[keyResponse].checked) {
      this.loterias[keyResponse].checked = false;
    } else {
      this.loterias[keyResponse].checked = true;
    }

    let valid = true;
    this.loterias.forEach(element => {
      if (!element.checked) { valid = false; }
    });

    if (valid) {
      this.checked = true;
    } else {
      this.checked = false;
    }

    const emitLoterias = {
      loterias:this.loterias,
      fechaSeleccionApuesta:this.dayBet
    }
    
    this.agregarLoterias.emit(emitLoterias);

    // this.agregarLoterias.emit(this.get_lotteriesSelected());
  }



  /**
   * @author Luis Hernandez
   * @description Metodo que 
   * se encarga de validar si
   * se seleccionan o no todas las loterias
   */
  cambioSeleccion(){

    if (this.checked) {
      for (let index = 0; index < this.loterias.length; index++) {
        this.loterias[index].checked = true;
      }
      this.checked = true;
    } else {
      for (let index = 0; index < this.loterias.length; index++) {
        this.loterias[index].checked = false;
      }
      this.checked = false;
    }

    const emitLoterias = {
        loterias:this.loterias,
        fechaSeleccionApuesta:this.dayBet
    }
      
    this.agregarLoterias.emit(emitLoterias);

    // this.agregarLoterias.emit(this.get_lotteriesSelected());
  }




  /**
   * @author Luis Hernandez
   * @description Metodo que se valida cuales fueron
   * las loterias seleccionadas y las manda para el carrito
   */
  // get_lotteriesSelected() {
  //   this.loteriasSeleccionadas = [];
  //   this.loterias.forEach(element => {
  //     if (element.checked) {
  //       this.loteriasSeleccionadas.push({
  //         idLoteria: element.idLoteria,
  //         codigo: element.codigo,
  //         nombre: element.nombre,
  //         nombreCorto: element.nombreCorto,
  //         telefono: element.telefono,
  //         idEstado: element.idEstado,
  //         idEmpresa: element.idEmpresa,
  //         idSorteo: element.idSorteo,
  //         idSorteoDetalle: element.idSorteoDetalle,
  //         horaSorteo:element.horaSorteo
  //       });
  //     }
  //   });
  //   return this.loteriasSeleccionadas;
  // }




  /**
   * @author Luis Hernandez
   * @description Funcion que permite valida que el usuario
   * solo ingrese numeros en los campos donde se espera solo numeros
   * @param e
   */
  permitirSoloNumeros(e) {
    const key = window.Event ? e.which : e.keyCode;
    e.key.replace(/\D|\-/, '');
    return (key >= 48 && key <= 57);
  }



  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de
   * habilitar y deshabilitar los campos de
   * apuesta de cifras y combinado segun la
   * cantidad de numeros de numero principal
   * de la apuesta
   */
  habilitarDeshabilitarSegunCifras(event, fila) {
    let value = null;
    if(event && event.value){
      value=event.value;
    } else{
      value=event;
    }
    if (fila === 1) {
      this.revisarFilaUno(value);
    } else if(fila === 2) {
      this.revisarFilaDos(value);
    } else if(fila === 3) {
      this.revisarFilaTres(value);
    } else if(fila === 4) {
      this.revisarFilaCuatro(value);
    } else if(fila === 5) {
      this.revisarFilaCinco(value);
    }

    this.emitirNumeros();
  }


 
  revisarFilaUno(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaUno').enable();
      this.chanceForm.get('combinadoFilaUno').enable();
      this.chanceForm.get('dosCifrasFilaUno').enable();
      this.chanceForm.get('unaCifraFilaUno').enable();
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaUno').disable();
      this.chanceForm.get('combinadoFilaUno').disable();
      this.chanceForm.get('dosCifrasFilaUno').enable();
      this.chanceForm.get('unaCifraFilaUno').enable();
      this.chanceForm.get('valorDirectoFilaUno').setValue('');
      this.chanceForm.get('combinadoFilaUno').setValue('');
    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaUno').disable();
      this.chanceForm.get('combinadoFilaUno').disable();
      this.chanceForm.get('dosCifrasFilaUno').disable();
      this.chanceForm.get('unaCifraFilaUno').enable();
      this.chanceForm.get('valorDirectoFilaUno').setValue('');
      this.chanceForm.get('combinadoFilaUno').setValue('');
      this.chanceForm.get('dosCifrasFilaUno').setValue('');
    }
  }


  revisarFilaDos(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaDos').enable();
      this.chanceForm.get('combinadoFilaDos').enable();
      this.chanceForm.get('dosCifrasFilaDos').enable();
      this.chanceForm.get('unaCifraFilaDos').enable();
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaDos').disable();
      this.chanceForm.get('combinadoFilaDos').disable();
      this.chanceForm.get('dosCifrasFilaDos').enable();
      this.chanceForm.get('unaCifraFilaDos').enable();
      this.chanceForm.get('valorDirectoFilaDos').setValue('');
      this.chanceForm.get('combinadoFilaDos').setValue('');
    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaDos').disable();
      this.chanceForm.get('combinadoFilaDos').disable();
      this.chanceForm.get('dosCifrasFilaDos').disable();
      this.chanceForm.get('unaCifraFilaDos').enable();
      this.chanceForm.get('valorDirectoFilaDos').setValue('');
      this.chanceForm.get('combinadoFilaDos').setValue('');
      this.chanceForm.get('dosCifrasFilaDos').setValue('');
    }
  }

  revisarFilaTres(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaTres').enable();
      this.chanceForm.get('combinadoFilaTres').enable();
      this.chanceForm.get('dosCifrasFilaTres').enable();
      this.chanceForm.get('unaCifraFilaTres').enable();
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaTres').disable();
      this.chanceForm.get('combinadoFilaTres').disable();
      this.chanceForm.get('dosCifrasFilaTres').enable();
      this.chanceForm.get('unaCifraFilaTres').enable();
      this.chanceForm.get('valorDirectoFilaTres').setValue('');
      this.chanceForm.get('combinadoFilaTres').setValue('');
    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaTres').disable();
      this.chanceForm.get('combinadoFilaTres').disable();
      this.chanceForm.get('dosCifrasFilaTres').disable();
      this.chanceForm.get('unaCifraFilaTres').enable();
      this.chanceForm.get('valorDirectoFilaTres').setValue('');
      this.chanceForm.get('combinadoFilaTres').setValue('');
      this.chanceForm.get('dosCifrasFilaTres').setValue('');
    }
  }


  revisarFilaCuatro(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaCuatro').enable();
      this.chanceForm.get('combinadoFilaCuatro').enable();
      this.chanceForm.get('dosCifrasFilaCuatro').enable();
      this.chanceForm.get('unaCifraFilaCuatro').enable();
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaCuatro').disable();
      this.chanceForm.get('combinadoFilaCuatro').disable();
      this.chanceForm.get('dosCifrasFilaCuatro').enable();
      this.chanceForm.get('unaCifraFilaCuatro').enable();
      this.chanceForm.get('valorDirectoFilaCuatro').setValue('');
      this.chanceForm.get('combinadoFilaCuatro').setValue('');
    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaCuatro').disable();
      this.chanceForm.get('combinadoFilaCuatro').disable();
      this.chanceForm.get('dosCifrasFilaCuatro').disable();
      this.chanceForm.get('unaCifraFilaCuatro').enable();
      this.chanceForm.get('valorDirectoFilaCuatro').setValue('');
      this.chanceForm.get('combinadoFilaCuatro').setValue('');
      this.chanceForm.get('dosCifrasFilaCuatro').setValue('');
    }
  }


  revisarFilaCinco(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaCinco').enable();
      this.chanceForm.get('combinadoFilaCinco').enable();
      this.chanceForm.get('dosCifrasFilaCinco').enable();
      this.chanceForm.get('unaCifraFilaCinco').enable();
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaCinco').disable();
      this.chanceForm.get('combinadoFilaCinco').disable();
      this.chanceForm.get('dosCifrasFilaCinco').enable();
      this.chanceForm.get('unaCifraFilaCinco').enable();
      this.chanceForm.get('valorDirectoFilaCinco').setValue('');
      this.chanceForm.get('combinadoFilaCinco').setValue('');
    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaCinco').disable();
      this.chanceForm.get('combinadoFilaCinco').disable();
      this.chanceForm.get('dosCifrasFilaCinco').disable();
      this.chanceForm.get('unaCifraFilaCinco').enable();
      this.chanceForm.get('valorDirectoFilaCinco').setValue('');
      this.chanceForm.get('combinadoFilaCinco').setValue('');
      this.chanceForm.get('dosCifrasFilaCinco').setValue('');
    }
  }




  borrarFilaUno() {
    this.chanceForm.get('numeroFilaUno').setValue('');
    this.chanceForm.get('valorDirectoFilaUno').setValue('');
    this.chanceForm.get('combinadoFilaUno').setValue('');
    this.chanceForm.get('dosCifrasFilaUno').setValue('');
    this.chanceForm.get('unaCifraFilaUno').setValue('');
    this.emitirNumeros()
  }

  borrarFilaDos(){
    this.chanceForm.get('numeroFilaDos').setValue('');
    this.chanceForm.get('valorDirectoFilaDos').setValue('');
    this.chanceForm.get('combinadoFilaDos').setValue('');
    this.chanceForm.get('dosCifrasFilaDos').setValue('');
    this.chanceForm.get('unaCifraFilaDos').setValue('');
    this.emitirNumeros()
  }

  borrarFilaTres(){
    this.chanceForm.get('numeroFilaTres').setValue('');
    this.chanceForm.get('valorDirectoFilaTres').setValue('');
    this.chanceForm.get('combinadoFilaTres').setValue('');
    this.chanceForm.get('dosCifrasFilaTres').setValue('');
    this.chanceForm.get('unaCifraFilaTres').setValue('');
    this.emitirNumeros()
  }

  borrarFilaCuatro(){
    this.chanceForm.get('numeroFilaCuatro').setValue('');
    this.chanceForm.get('valorDirectoFilaCuatro').setValue('');
    this.chanceForm.get('combinadoFilaCuatro').setValue('');
    this.chanceForm.get('dosCifrasFilaCuatro').setValue('');
    this.chanceForm.get('unaCifraFilaCuatro').setValue('');
    this.emitirNumeros()
  }

  borrarFilaCinco(){
    this.chanceForm.get('numeroFilaCinco').setValue('');
    this.chanceForm.get('valorDirectoFilaCinco').setValue('');
    this.chanceForm.get('combinadoFilaCinco').setValue('');
    this.chanceForm.get('dosCifrasFilaCinco').setValue('');
    this.chanceForm.get('unaCifraFilaCinco').setValue('');
    this.emitirNumeros()
  }


  aleatorioTresCifras(){
    if(this.chanceForm.get('numeroFilaUno').value == ''){
      this.chanceForm.controls.numeroFilaUno.setValue( Math.round(Math.random() * (100 - 999) + 999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaUno').value, 1);
    } else if(this.chanceForm.get('numeroFilaDos').value == '') {
      this.chanceForm.controls.numeroFilaDos.setValue( Math.round(Math.random() * (100 - 999) + 999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaDos').value, 2);
    } else if(this.chanceForm.get('numeroFilaTres').value == '') {
      this.chanceForm.controls.numeroFilaTres.setValue( Math.round(Math.random() * (100 - 999) + 999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaTres').value, 3);
    } else if(this.chanceForm.get('numeroFilaCuatro').value == '') {
      this.chanceForm.controls.numeroFilaCuatro.setValue( Math.round(Math.random() * (100 - 999) + 999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaCuatro').value, 4);
    } else if(this.chanceForm.get('numeroFilaCinco').value == '') {
      this.chanceForm.controls.numeroFilaCinco.setValue( Math.round(Math.random() * (100 - 999) + 999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaCinco').value, 4);
    }
    this.emitirNumeros();
  }

  aleatorioCuatroCifras(){
    if(this.chanceForm.get('numeroFilaUno').value == ''){
      this.chanceForm.controls.numeroFilaUno.setValue( Math.round(Math.random() * (1000 - 9999) + 9999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaUno').value, 1);
    } else if(this.chanceForm.get('numeroFilaDos').value == '') {
      this.chanceForm.controls.numeroFilaDos.setValue( Math.round(Math.random() * (1000 - 9999) + 9999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaDos').value, 2);
    } else if(this.chanceForm.get('numeroFilaTres').value == '') {
      this.chanceForm.controls.numeroFilaTres.setValue( Math.round(Math.random() * (1000 - 9999) + 9999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaTres').value, 3);
    } else if(this.chanceForm.get('numeroFilaCuatro').value == '') {
      this.chanceForm.controls.numeroFilaCuatro.setValue( Math.round(Math.random() * (1000 - 9999) + 9999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaCuatro').value, 4);
    } else if(this.chanceForm.get('numeroFilaCinco').value == '') {
      this.chanceForm.controls.numeroFilaCinco.setValue( Math.round(Math.random() * (1000 - 9999) + 9999 ) );
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaCinco').value, 5);
    }
    this.emitirNumeros();
  }



  repetirNumeroSiguientFila(){
    if(
      this.chanceForm.get('numeroFilaUno').value != '' &&
      this.chanceForm.get('numeroFilaDos').value == '' &&
      this.chanceForm.get('numeroFilaTres').value == '' &&
      this.chanceForm.get('numeroFilaCuatro').value == '' &&
      this.chanceForm.get('numeroFilaCinco').value == '') {
        this.chanceForm.controls.numeroFilaDos.setValue( this.chanceForm.get('numeroFilaUno').value);
        this.chanceForm.controls.valorDirectoFilaDos.setValue( this.chanceForm.get('valorDirectoFilaUno').value);
        this.chanceForm.controls.combinadoFilaDos.setValue( this.chanceForm.get('combinadoFilaUno').value);
        this.chanceForm.controls.dosCifrasFilaDos.setValue( this.chanceForm.get('dosCifrasFilaUno').value);
        this.chanceForm.controls.unaCifraFilaDos.setValue( this.chanceForm.get('unaCifraFilaUno').value);
    } else if(
      this.chanceForm.get('numeroFilaUno').value != '' &&
      this.chanceForm.get('numeroFilaDos').value != '' &&
      this.chanceForm.get('numeroFilaTres').value == '' &&
      this.chanceForm.get('numeroFilaCuatro').value == '' &&
      this.chanceForm.get('numeroFilaCinco').value == '') {
        this.chanceForm.controls.numeroFilaTres.setValue( this.chanceForm.get('numeroFilaDos').value);
        this.chanceForm.controls.valorDirectoFilaTres.setValue( this.chanceForm.get('valorDirectoFilaDos').value);
        this.chanceForm.controls.combinadoFilaTres.setValue( this.chanceForm.get('combinadoFilaDos').value);
        this.chanceForm.controls.dosCifrasFilaTres.setValue( this.chanceForm.get('dosCifrasFilaDos').value);
        this.chanceForm.controls.unaCifraFilaTres.setValue( this.chanceForm.get('unaCifraFilaDos').value);
    } else if(
    
      this.chanceForm.get('numeroFilaUno').value != '' &&
      this.chanceForm.get('numeroFilaDos').value != '' &&
      this.chanceForm.get('numeroFilaTres').value != '' &&
      this.chanceForm.get('numeroFilaCuatro').value == '' &&
      this.chanceForm.get('numeroFilaCinco').value == '') {
        this.chanceForm.controls.numeroFilaCuatro.setValue( this.chanceForm.get('numeroFilaTres').value);
        this.chanceForm.controls.valorDirectoFilaCuatro.setValue( this.chanceForm.get('valorDirectoFilaTres').value);
        this.chanceForm.controls.combinadoFilaCuatro.setValue( this.chanceForm.get('combinadoFilaTres').value);
        this.chanceForm.controls.dosCifrasFilaCuatro.setValue( this.chanceForm.get('dosCifrasFilaTres').value);
        this.chanceForm.controls.unaCifraFilaCuatro.setValue( this.chanceForm.get('unaCifraFilaTres').value);
    } else if(
      this.chanceForm.get('numeroFilaUno').value != '' &&
      this.chanceForm.get('numeroFilaDos').value != '' &&
      this.chanceForm.get('numeroFilaTres').value != '' &&
      this.chanceForm.get('numeroFilaCuatro').value != '' &&
      this.chanceForm.get('numeroFilaCinco').value == '') {
        this.chanceForm.controls.numeroFilaCinco.setValue( this.chanceForm.get('numeroFilaCuatro').value);
        this.chanceForm.controls.valorDirectoFilaCinco.setValue( this.chanceForm.get('valorDirectoFilaCuatro').value);
        this.chanceForm.controls.combinadoFilaCinco.setValue( this.chanceForm.get('combinadoFilaCuatro').value);
        this.chanceForm.controls.dosCifrasFilaCinco.setValue( this.chanceForm.get('dosCifrasFilaCuatro').value);
        this.chanceForm.controls.unaCifraFilaCinco.setValue( this.chanceForm.get('unaCifraFilaCuatro').value);
    }

    this.emitirNumeros();
  }



  borrarTodo() {
    this.chanceForm.controls.numeroFilaUno.setValue('');
    this.chanceForm.controls.valorDirectoFilaUno.setValue('');
    this.chanceForm.controls.combinadoFilaUno.setValue('');
    this.chanceForm.controls.dosCifrasFilaUno.setValue('');
    this.chanceForm.controls.unaCifraFilaUno.setValue('');
    this.chanceForm.controls.numeroFilaDos.setValue('');
    this.chanceForm.controls.valorDirectoFilaDos.setValue('');
    this.chanceForm.controls.combinadoFilaDos.setValue('');
    this.chanceForm.controls.dosCifrasFilaDos.setValue('');
    this.chanceForm.controls.unaCifraFilaDos.setValue('');
    this.chanceForm.controls.numeroFilaTres.setValue('');
    this.chanceForm.controls.valorDirectoFilaTres.setValue('');
    this.chanceForm.controls.combinadoFilaTres.setValue('');
    this.chanceForm.controls.dosCifrasFilaTres.setValue('');
    this.chanceForm.controls.unaCifraFilaTres.setValue('');
    this.chanceForm.controls.numeroFilaCuatro.setValue('');
    this.chanceForm.controls.valorDirectoFilaCuatro.setValue('');
    this.chanceForm.controls.combinadoFilaCuatro.setValue('');
    this.chanceForm.controls.dosCifrasFilaCuatro.setValue('');
    this.chanceForm.controls.unaCifraFilaCuatro.setValue('');
    this.chanceForm.controls.numeroFilaCinco.setValue('');
    this.chanceForm.controls.valorDirectoFilaCinco.setValue('');
    this.chanceForm.controls.combinadoFilaCinco.setValue('');
    this.chanceForm.controls.dosCifrasFilaCinco.setValue('');
    this.chanceForm.controls.unaCifraFilaCinco.setValue('');

    this.chanceForm.controls.tipoDocumento.setValue('');
    this.chanceForm.controls.numeroDocumento.setValue('');
    this.chanceForm.controls.nombreCliente.setValue('');
    this.correoCustomer = '';
    this.idCustomer = '';

    this.loterias = [];
    this.agregarLoterias.emit(this.loterias);
    this.emitirNumeros();
  }


  emitirNumeros() {
    const numerosValores = [
      { 
        numeroFilaUno : this.chanceForm.get('numeroFilaUno').value, 
        valorDirectoFilaUno : this.chanceForm.get('valorDirectoFilaUno').value, 
        combinadoFilaUno: this.chanceForm.get('combinadoFilaUno').value,
        dosCifrasFilaUno: this.chanceForm.get('dosCifrasFilaUno').value,
        unaCifraFilaUno: this.chanceForm.get('unaCifraFilaUno').value
      },
      { 
        numeroFilaDos : this.chanceForm.get('numeroFilaDos').value, 
        valorDirectoFilaDos : this.chanceForm.get('valorDirectoFilaDos').value, 
        combinadoFilaDos: this.chanceForm.get('combinadoFilaDos').value,
        dosCifrasFilaDos: this.chanceForm.get('dosCifrasFilaDos').value,
        unaCifraFilaDos: this.chanceForm.get('unaCifraFilaDos').value
      },
      { 
        numeroFilaTres : this.chanceForm.get('numeroFilaTres').value, 
        valorDirectoFilaTres : this.chanceForm.get('valorDirectoFilaTres').value, 
        combinadoFilaTres: this.chanceForm.get('combinadoFilaTres').value,
        dosCifrasFilaTres: this.chanceForm.get('dosCifrasFilaTres').value,
        unaCifraFilaTres: this.chanceForm.get('unaCifraFilaTres').value
      },
      { 
        numeroFilaCuatro : this.chanceForm.get('numeroFilaCuatro').value, 
        valorDirectoFilaCuatro : this.chanceForm.get('valorDirectoFilaCuatro').value, 
        combinadoFilaCuatro: this.chanceForm.get('combinadoFilaCuatro').value,
        dosCifrasFilaCuatro: this.chanceForm.get('dosCifrasFilaCuatro').value,
        unaCifraFilaCuatro: this.chanceForm.get('unaCifraFilaCuatro').value
      },
      { 
        numeroFilaCinco : this.chanceForm.get('numeroFilaCinco').value, 
        valorDirectoFilaCinco : this.chanceForm.get('valorDirectoFilaCinco').value, 
        combinadoFilaCinco: this.chanceForm.get('combinadoFilaCinco').value,
        dosCifrasFilaCinco: this.chanceForm.get('dosCifrasFilaCinco').value,
        unaCifraFilaCinco: this.chanceForm.get('unaCifraFilaCinco').value
      }
    ]

    this.agregarNumeros.emit(numerosValores);

  }



  editarProducto(event){
    this.edit = true;
    const buscarApuestasEditar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const apuestaEditar = buscarApuestasEditar.filter(buscarApuestaEditar => buscarApuestaEditar._id == event._id);
    
    this.loterias = apuestaEditar[0].loterias;
    const emitLoterias = {
      loterias:this.loterias,
      fechaSeleccionApuesta:apuestaEditar[0].fechaSeleccionApuesta
    }
    
    this.agregarLoterias.emit(emitLoterias);
    this.infoEdit = apuestaEditar;
    apuestaEditar[0].listaNumeros.forEach(element => {

      if(element.numeroFilaUno) { 
        this.chanceForm.get('numeroFilaUno').setValue(element.numeroFilaUno);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaUno, 1);
      }
      if(element.valorDirectoFilaUno) { this.chanceForm.get('valorDirectoFilaUno').setValue(element.valorDirectoFilaUno); }
      if(element.combinadoFilaUno) { this.chanceForm.get('combinadoFilaUno').setValue(element.combinadoFilaUno); }
      if(element.dosCifrasFilaUno) { this.chanceForm.get('dosCifrasFilaUno').setValue(element.dosCifrasFilaUno); }
      if(element.unaCifraFilaUno) { this.chanceForm.get('unaCifraFilaUno').setValue(element.unaCifraFilaUno); }

      if(element.numeroFilaDos) { 
        this.chanceForm.get('numeroFilaDos').setValue(element.numeroFilaDos);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaDos, 2);
      }
      if(element.valorDirectoFilaDos) { this.chanceForm.get('valorDirectoFilaDos').setValue(element.valorDirectoFilaDos); }
      if(element.combinadoFilaDos) { this.chanceForm.get('combinadoFilaDos').setValue(element.combinadoFilaDos); }
      if(element.dosCifrasFilaDos) { this.chanceForm.get('dosCifrasFilaDos').setValue(element.dosCifrasFilaDos); }
      if(element.unaCifraFilaDos) { this.chanceForm.get('unaCifraFilaDos').setValue(element.unaCifraFilaDos); }

      if(element.numeroFilaTres) { 
        this.chanceForm.get('numeroFilaTres').setValue(element.numeroFilaTres);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaTres, 3);
      }
      if(element.valorDirectoFilaTres) { this.chanceForm.get('valorDirectoFilaTres').setValue(element.valorDirectoFilaTres); }
      if(element.combinadoFilaTres) { this.chanceForm.get('combinadoFilaTres').setValue(element.combinadoFilaTres); }
      if(element.dosCifrasFilaTres) { this.chanceForm.get('dosCifrasFilaTres').setValue(element.dosCifrasFilaTres); }
      if(element.unaCifraFilaTres) { this.chanceForm.get('unaCifraFilaTres').setValue(element.unaCifraFilaTres); }

      if(element.numeroFilaCuatro) { 
        this.chanceForm.get('numeroFilaCuatro').setValue(element.numeroFilaCuatro);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaCuatro, 4);
      }
      if(element.valorDirectoFilaCuatro) { this.chanceForm.get('valorDirectoFilaCuatro').setValue(element.valorDirectoFilaCuatro); }
      if(element.combinadoFilaCuatro) { this.chanceForm.get('combinadoFilaCuatro').setValue(element.combinadoFilaCuatro); }
      if(element.dosCifrasFilaCuatro) { this.chanceForm.get('dosCifrasFilaCuatro').setValue(element.dosCifrasFilaCuatro); }
      if(element.unaCifraFilaCuatro) { this.chanceForm.get('unaCifraFilaCuatro').setValue(element.unaCifraFilaCuatro); }

      if(element.numeroFilaCinco) { 
        this.chanceForm.get('numeroFilaCinco').setValue(element.numeroFilaCinco); 
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaCinco, 5);
      }
      if(element.valorDirectoFilaCinco) { this.chanceForm.get('valorDirectoFilaCinco').setValue(element.valorDirectoFilaCinco); }
      if(element.combinadoFilaCinco) { this.chanceForm.get('combinadoFilaCinco').setValue(element.combinadoFilaCinco); }
      if(element.dosCifrasFilaCinco) { this.chanceForm.get('dosCifrasFilaCinco').setValue(element.dosCifrasFilaCinco); }
      if(element.unaCifraFilaCinco) { this.chanceForm.get('unaCifraFilaCinco').setValue(element.unaCifraFilaCinco); }

    });
    this.emitirNumeros();
  }



  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de validar si
   * existe o no el cliente, si este no existe se
   * levanta un popup para su posterior creación
   */
  validExistClient(): void {

    if (this.chanceForm.get('tipoDocumento').value && this.chanceForm.get('numeroDocumento').value) {
      const clientesDTO: ClientesDTO = new ClientesDTO();
      this.enabledCustomer = false;
      this.chanceForm.controls.nombreCliente.setValue('');
      clientesDTO.numeroDocumento = this.chanceForm.get('numeroDocumento').value;
      clientesDTO.tipoDocumento = this.chanceForm.get('tipoDocumento').value;
      this.productosService.clienteApuesta(clientesDTO).subscribe(
        clienteData => {
          const responseCliente: any = clienteData;
          if (responseCliente.existe) {
            const name = responseCliente.primerNombre + ' ' + responseCliente.segundoNombre + ' ' + responseCliente.primerApellido;
            this.idCustomer = responseCliente.idCliente;
            this.correoCustomer = responseCliente.correo;
            this.chanceForm.controls.nombreCliente.setValue(name);
            this.enabledCustomer = true;
            this.emitirCliente(1);
          } else {
            this.crearClienteChild.clienteForm.get('tipoDocumento').setValue(this.chanceForm.get('tipoDocumento').value);
            this.crearClienteChild.clienteForm.get('numeroDocumento').setValue(this.chanceForm.get('numeroDocumento').value);
            this.displayModalCreate = true;
            this.emitirCliente(2);
          }
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

  }


  emitirCliente(event){
    if(event === 1){
      let clienteInfo = { 
        tipoDocumento : this.chanceForm.get('tipoDocumento').value, 
        numeroDocumento : this.chanceForm.get('numeroDocumento').value, 
        nombreCliente: this.chanceForm.get('nombreCliente').value,
        idCustomer: this.idCustomer,
        correoCustomer: this.correoCustomer
      }
      this.agregarCliente.emit(clienteInfo);
    } else if(event === 2) {
      let clienteInfo = {tipoDocumento:null, numeroDocumento:null, nombreCliente:null, idCustomer:null, correoCustomer:null}
      this.agregarCliente.emit(clienteInfo);
    }
  }

  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se encarga de
   * recibir el false que emite el componente
   * que contiene el html del fomulario de
   * creación (popup)
   */
  closeModal(event): void {
    this.displayModalCreate = event;
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se encarga de recibir
   * el cliente creado y mostrarlo en pantalla
   */
  createCustomer(event): void {
    this.displayModalCreate = false;
    const name = event.primerNombre + ' ' + event.segundoNombre + ' ' + event.primerApellido;
    this.idCustomer = event.idPersona;
    this.correoCustomer = event.correo;
    this.chanceForm.controls.nombreCliente.setValue(name);
    this.enabledCustomer = true;
    this.emitirCliente(1)
  }


  /**
   * @author Luis Fernando Hernandez
   * @description Metodo que se encarga 
   */
  obtenerFechaCalendario(event){
    let FormatoMomentFecha = moment(new Date(event.toString())).format();
    this.dayBet = FechaUtil.stringToDate(FormatoMomentFecha.toString());
    this.getLotteries()
  }



  /**
   * @author Luis Hernandez
   * @param id
   * @description metodo que se encarga
   * de buscar el punto dentro del array
   * de una loteria
   */
  getKeyObject(idLoteria) {
    return this.loterias.map((e) => {
      return e.idLoteria;
    }).indexOf(idLoteria);
  }


}