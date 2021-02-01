import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, AfterContentChecked } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ProductosService } from '../../productos.service';
import { MessageService } from 'primeng/api';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonComponent } from 'src/app/utilities/common.component';
import { FechaUtil } from 'src/app/utilities/fecha-util';
import { CommonService } from 'src/app/utilities/common.service';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { CrearClienteComponent } from '../../genericos/crear-cliente/crear-cliente.component';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';
import { ShellState } from '../../../../states/shell/shell.state';

@Component({
  selector: 'app-apuesta-millonaria',
  templateUrl: './apuesta-millonaria.component.html',
  styleUrls: ['./apuesta-millonaria.component.css'],
  providers: [ProductosService, CommonService]
})
export class ApuestaMillonariaComponent extends CommonComponent implements OnInit  {

  @Output() agregarLoterias: EventEmitter<any> = new EventEmitter();
  @Output() reiniciarEdit: EventEmitter<any> = new EventEmitter();
  @Output() agregarNumeros: EventEmitter<any> = new EventEmitter();
  @Output() agregarCliente: EventEmitter<any> = new EventEmitter();

  stateDisabeld = false;

  numeroUno = false;
  numeroDos = false;
  numeroTres = false;
  numeroCuatro = false;
  numeroCinco = false;

  subscription: any;
  lengEspanol = {}


  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;

  pCalendarioValor: Date;

  displayModalBuscarCliente = true;


  /** Es el correo del cliente quien hace la compra */
  private correoCustomer: string;
  enabledCustomer = false;
  idCustomer = '';
  displayModalCreate = false;
  edit = false;
  infoEdit: any;
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


  group: FormGroup;

  

  chanceForm = new FormGroup({
    numeroFilaUno: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaUno: new FormControl({ value: '', disabled: true }),
    combinadoFilaUno: new FormControl({ value: '', disabled: true }),
    dosCifrasFilaUno: new FormControl({ value: '', disabled: true }),
    unaCifraFilaUno: new FormControl({ value: '', disabled: true }),

    numeroFilaDos: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaDos: new FormControl({ value: '', disabled: true }),
    combinadoFilaDos: new FormControl({ value: '', disabled: true }),
    dosCifrasFilaDos: new FormControl({ value: '', disabled: true }),
    unaCifraFilaDos: new FormControl({ value: '', disabled: true }),

    numeroFilaTres: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaTres: new FormControl({ value: '', disabled: true }),
    combinadoFilaTres: new FormControl({ value: '', disabled: true }),
    dosCifrasFilaTres: new FormControl({ value: '', disabled: true }),
    unaCifraFilaTres: new FormControl({ value: '', disabled: true }),


    numeroFilaCuatro: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaCuatro: new FormControl({ value: '', disabled: true }),
    combinadoFilaCuatro: new FormControl({ value: '', disabled: true }),
    dosCifrasFilaCuatro: new FormControl({ value: '', disabled: true }),
    unaCifraFilaCuatro: new FormControl({ value: '', disabled: true }),

    numeroFilaCinco: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    valorDirectoFilaCinco: new FormControl({ value: '', disabled: true }),
    combinadoFilaCinco: new FormControl({ value: '', disabled: true }),
    dosCifrasFilaCinco: new FormControl({ value: '', disabled: true }),
    unaCifraFilaCinco: new FormControl({ value: '', disabled: true }),

    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombreCliente: new FormControl(''),

  });


  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private fb: FormBuilder,
    public shellState: ShellState,
    private currencyPipe: CurrencyPipe
  ) {
    super();
    // obtenemos el semanario
    this.setDaysServicio();

    this.productosService.consultarRutaImagenes().subscribe(
      responseDTO => {
        if(responseDTO){
          this.rutaServidor = responseDTO.codigo;
        }
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );

    // subscribe evento busqueda de cliente
    this.subscription = this.shellState.getEventoClienteBorrar().subscribe(evento => { 
      if(evento){
        this.obtenerInfoClienteBorrado()
      }
    });

    // subscribe evento busqueda de cliente
    this.subscription = this.shellState.getEventoClienteAgregar().subscribe(evento => { 
      if(evento){
        this.validExistenciaClienteLocalStorage()
      }
    });

  }


  ngOnInit(): void {
    this.lengEspanol = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'mm/dd/yy',
      weekHeader: 'Wk'
    };

    this.validExistenciaClienteLocalStorage();

  }

  obtenerInfoClienteBorrado() {
    this.idCustomer = '';
    this.correoCustomer = '';
    this.chanceForm.controls.nombreCliente.setValue('');
    this.chanceForm.controls.tipoDocumento.setValue('');
    this.chanceForm.controls.numeroDocumento.setValue('');
    this.displayModalBuscarCliente = false;
    this.emitirCliente(2)
  }


  validExistenciaClienteLocalStorage(){
    let clienteOperacion = JSON.parse(localStorage.getItem('clienteOperacion'))
    if(clienteOperacion){
      if (clienteOperacion.idCustomer) {
        this.idCustomer = clienteOperacion.idCustomer;
        this.correoCustomer = clienteOperacion.correoCustomer;
        this.chanceForm.controls.nombreCliente.setValue(clienteOperacion.nombreCliente);
        this.chanceForm.controls.tipoDocumento.setValue(clienteOperacion.tipoDocumento);
        this.chanceForm.controls.numeroDocumento.setValue(clienteOperacion.numeroDocumento);
        this.displayModalBuscarCliente = false;
        this.emitirCliente(1)
      } else {
        this.displayModalBuscarCliente = true;
        this.emitirCliente(2)
      }
    } else {
      this.displayModalBuscarCliente = true;
      this.emitirCliente(2)
    }
  }
  

  /**
   * @author Luis Hernandez
   * @description Por medio de este metodo marcamos con color verde el dia de la apuesta y setiamos la fecha
   * @param day
   */
  get_date_bet(day) {
    delete this.pCalendarioValor
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
      loterias: this.loterias,
      fechaSeleccionApuesta: this.dayBet
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

    if (this.loterias[keyResponse].checked === true) {
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
      loterias: this.loterias,
      fechaSeleccionApuesta: this.dayBet
    }

    this.agregarLoterias.emit(emitLoterias);
  }



  /**
   * @author Luis Hernandez
   * @description Metodo que 
   * se encarga de validar si
   * se seleccionan o no todas las loterias
   */
  cambioSeleccion(event) {

    if(event === 1){
      if(this.checked === false){
        this.checked = true;
      } else {
        this.checked = false;
      }
    }

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
      loterias: this.loterias,
      fechaSeleccionApuesta: this.dayBet
    }

    this.agregarLoterias.emit(emitLoterias);
  }

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
    if (event && event.value) {
      value = event.value;
    } else {
      value = event;
    }
    if (fila === 1) {
      this.revisarFilaUno(value);
    } else if (fila === 2) {
      this.revisarFilaDos(value);
    } else if (fila === 3) {
      this.revisarFilaTres(value);
    } else if (fila === 4) {
      this.revisarFilaCuatro(value);
    } else if (fila === 5) {
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

      document.getElementById('valorDirectoFilaUno').focus();
      document.getElementById('valorDirectoFilaUno').style.backgroundColor = '#FFFFFF';
      document.getElementById('combinadoFilaUno').style.backgroundColor = '#FFFFFF';
      document.getElementById('dosCifrasFilaUno').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaUno').style.backgroundColor = '#FFFFFF';
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaUno').disable();
      this.chanceForm.get('combinadoFilaUno').disable();
      this.chanceForm.get('dosCifrasFilaUno').enable();
      this.chanceForm.get('unaCifraFilaUno').enable();
      this.chanceForm.get('valorDirectoFilaUno').setValue('');
      this.chanceForm.get('combinadoFilaUno').setValue('');

      document.getElementById('dosCifrasFilaUno').focus();
      document.getElementById('valorDirectoFilaUno').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaUno').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaUno').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaUno').style.backgroundColor = '#FFFFFF';
    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaUno').disable();
      this.chanceForm.get('combinadoFilaUno').disable();
      this.chanceForm.get('dosCifrasFilaUno').disable();
      this.chanceForm.get('unaCifraFilaUno').enable();
      this.chanceForm.get('valorDirectoFilaUno').setValue('');
      this.chanceForm.get('combinadoFilaUno').setValue('');
      this.chanceForm.get('dosCifrasFilaUno').setValue('');

      document.getElementById('unaCifraFilaUno').focus();
      document.getElementById('valorDirectoFilaUno').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaUno').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaUno').style.backgroundColor = '#EFEFEF';
      document.getElementById('unaCifraFilaUno').style.backgroundColor = '#FFFFFF';
    }
  }


  revisarFilaDos(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaDos').enable();
      this.chanceForm.get('combinadoFilaDos').enable();
      this.chanceForm.get('dosCifrasFilaDos').enable();
      this.chanceForm.get('unaCifraFilaDos').enable();

      document.getElementById('valorDirectoFilaDos').focus();
      document.getElementById('valorDirectoFilaDos').style.backgroundColor = '#FFFFFF';
      document.getElementById('combinadoFilaDos').style.backgroundColor = '#FFFFFF';
      document.getElementById('dosCifrasFilaDos').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaDos').style.backgroundColor = '#FFFFFF';

    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaDos').disable();
      this.chanceForm.get('combinadoFilaDos').disable();
      this.chanceForm.get('dosCifrasFilaDos').enable();
      this.chanceForm.get('unaCifraFilaDos').enable();
      this.chanceForm.get('valorDirectoFilaDos').setValue('');
      this.chanceForm.get('combinadoFilaDos').setValue('');

      document.getElementById('dosCifrasFilaDos').focus();
      document.getElementById('valorDirectoFilaDos').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaDos').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaDos').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaDos').style.backgroundColor = '#FFFFFF';

    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaDos').disable();
      this.chanceForm.get('combinadoFilaDos').disable();
      this.chanceForm.get('dosCifrasFilaDos').disable();
      this.chanceForm.get('unaCifraFilaDos').enable();
      this.chanceForm.get('valorDirectoFilaDos').setValue('');
      this.chanceForm.get('combinadoFilaDos').setValue('');
      this.chanceForm.get('dosCifrasFilaDos').setValue('');

      document.getElementById('unaCifraFilaDos').focus();
      document.getElementById('valorDirectoFilaDos').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaDos').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaDos').style.backgroundColor = '#EFEFEF';
      document.getElementById('unaCifraFilaDos').style.backgroundColor = '#FFFFFF';
    }
  }


  revisarFilaTres(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaTres').enable();
      this.chanceForm.get('combinadoFilaTres').enable();
      this.chanceForm.get('dosCifrasFilaTres').enable();
      this.chanceForm.get('unaCifraFilaTres').enable();

      document.getElementById('valorDirectoFilaTres').focus();
      document.getElementById('valorDirectoFilaTres').style.backgroundColor = '#FFFFFF';
      document.getElementById('combinadoFilaTres').style.backgroundColor = '#FFFFFF';
      document.getElementById('dosCifrasFilaTres').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaTres').style.backgroundColor = '#FFFFFF';
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaTres').disable();
      this.chanceForm.get('combinadoFilaTres').disable();
      this.chanceForm.get('dosCifrasFilaTres').enable();
      this.chanceForm.get('unaCifraFilaTres').enable();
      this.chanceForm.get('valorDirectoFilaTres').setValue('');
      this.chanceForm.get('combinadoFilaTres').setValue('');

      document.getElementById('dosCifrasFilaTres').focus();
      document.getElementById('valorDirectoFilaTres').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaTres').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaTres').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaTres').style.backgroundColor = '#FFFFFF';

    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaTres').disable();
      this.chanceForm.get('combinadoFilaTres').disable();
      this.chanceForm.get('dosCifrasFilaTres').disable();
      this.chanceForm.get('unaCifraFilaTres').enable();
      this.chanceForm.get('valorDirectoFilaTres').setValue('');
      this.chanceForm.get('combinadoFilaTres').setValue('');
      this.chanceForm.get('dosCifrasFilaTres').setValue('');

      document.getElementById('unaCifraFilaTres').focus();
      document.getElementById('valorDirectoFilaTres').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaTres').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaTres').style.backgroundColor = '#EFEFEF';
      document.getElementById('unaCifraFilaTres').style.backgroundColor = '#FFFFFF';
    }
  }


  revisarFilaCuatro(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaCuatro').enable();
      this.chanceForm.get('combinadoFilaCuatro').enable();
      this.chanceForm.get('dosCifrasFilaCuatro').enable();
      this.chanceForm.get('unaCifraFilaCuatro').enable();

      document.getElementById('valorDirectoFilaCuatro').focus();
      document.getElementById('valorDirectoFilaCuatro').style.backgroundColor = '#FFFFFF';
      document.getElementById('combinadoFilaCuatro').style.backgroundColor = '#FFFFFF';
      document.getElementById('dosCifrasFilaCuatro').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaCuatro').style.backgroundColor = '#FFFFFF';
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaCuatro').disable();
      this.chanceForm.get('combinadoFilaCuatro').disable();
      this.chanceForm.get('dosCifrasFilaCuatro').enable();
      this.chanceForm.get('unaCifraFilaCuatro').enable();
      this.chanceForm.get('valorDirectoFilaCuatro').setValue('');
      this.chanceForm.get('combinadoFilaCuatro').setValue('');

      document.getElementById('dosCifrasFilaCuatro').focus();
      document.getElementById('valorDirectoFilaCuatro').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaCuatro').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaCuatro').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaCuatro').style.backgroundColor = '#FFFFFF';
    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaCuatro').disable();
      this.chanceForm.get('combinadoFilaCuatro').disable();
      this.chanceForm.get('dosCifrasFilaCuatro').disable();
      this.chanceForm.get('unaCifraFilaCuatro').enable();
      this.chanceForm.get('valorDirectoFilaCuatro').setValue('');
      this.chanceForm.get('combinadoFilaCuatro').setValue('');
      this.chanceForm.get('dosCifrasFilaCuatro').setValue('');

      document.getElementById('unaCifraFilaCuatro').focus();
      document.getElementById('valorDirectoFilaCuatro').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaCuatro').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaCuatro').style.backgroundColor = '#EFEFEF';
      document.getElementById('unaCifraFilaCuatro').style.backgroundColor = '#FFFFFF';
    }
  }


  revisarFilaCinco(value): void {
    if (String(value).length === 4 || String(value).length === 3) {
      this.chanceForm.get('valorDirectoFilaCinco').enable();
      this.chanceForm.get('combinadoFilaCinco').enable();
      this.chanceForm.get('dosCifrasFilaCinco').enable();
      this.chanceForm.get('unaCifraFilaCinco').enable();

      document.getElementById('valorDirectoFilaCinco').focus();
      document.getElementById('valorDirectoFilaCinco').style.backgroundColor = '#FFFFFF';
      document.getElementById('combinadoFilaCinco').style.backgroundColor = '#FFFFFF';
      document.getElementById('dosCifrasFilaCinco').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaCinco').style.backgroundColor = '#FFFFFF';
    } else if (String(value).length === 2) {
      this.chanceForm.get('valorDirectoFilaCinco').disable();
      this.chanceForm.get('combinadoFilaCinco').disable();
      this.chanceForm.get('dosCifrasFilaCinco').enable();
      this.chanceForm.get('unaCifraFilaCinco').enable();
      this.chanceForm.get('valorDirectoFilaCinco').setValue('');
      this.chanceForm.get('combinadoFilaCinco').setValue('');

      document.getElementById('dosCifrasFilaCinco').focus();
      document.getElementById('valorDirectoFilaCinco').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaCinco').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaCinco').style.backgroundColor = '#FFFFFF';
      document.getElementById('unaCifraFilaCinco').style.backgroundColor = '#FFFFFF';
    } else if (String(value).length === 1) {
      this.chanceForm.get('valorDirectoFilaCinco').disable();
      this.chanceForm.get('combinadoFilaCinco').disable();
      this.chanceForm.get('dosCifrasFilaCinco').disable();
      this.chanceForm.get('unaCifraFilaCinco').enable();
      this.chanceForm.get('valorDirectoFilaCinco').setValue('');
      this.chanceForm.get('combinadoFilaCinco').setValue('');
      this.chanceForm.get('dosCifrasFilaCinco').setValue('');

      document.getElementById('unaCifraFilaCinco').focus();
      document.getElementById('valorDirectoFilaCinco').style.backgroundColor = '#EFEFEF';
      document.getElementById('combinadoFilaCinco').style.backgroundColor = '#EFEFEF';
      document.getElementById('dosCifrasFilaCinco').style.backgroundColor = '#EFEFEF';
      document.getElementById('unaCifraFilaCinco').style.backgroundColor = '#FFFFFF';
    }
  }


  borrarFilaUno() {
    this.chanceForm.get('numeroFilaUno').setValue('');
    this.chanceForm.get('valorDirectoFilaUno').setValue('');
    this.chanceForm.get('combinadoFilaUno').setValue('');
    this.chanceForm.get('dosCifrasFilaUno').setValue('');
    this.chanceForm.get('unaCifraFilaUno').setValue('');
    this.emitirNumeros()

    document.getElementById('numeroFilaUno').focus();
    document.getElementById('numeroFilaUno').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaUno').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaUno').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaUno').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaUno').style.backgroundColor = '#EFEFEF';
  }

  borrarFilaDos() {
    this.chanceForm.get('numeroFilaDos').setValue('');
    this.chanceForm.get('valorDirectoFilaDos').setValue('');
    this.chanceForm.get('combinadoFilaDos').setValue('');
    this.chanceForm.get('dosCifrasFilaDos').setValue('');
    this.chanceForm.get('unaCifraFilaDos').setValue('');
    this.emitirNumeros()

    document.getElementById('numeroFilaDos').focus();
    document.getElementById('numeroFilaDos').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaDos').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaDos').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaDos').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaDos').style.backgroundColor = '#EFEFEF';
  }

  borrarFilaTres() {
    this.chanceForm.get('numeroFilaTres').setValue('');
    this.chanceForm.get('valorDirectoFilaTres').setValue('');
    this.chanceForm.get('combinadoFilaTres').setValue('');
    this.chanceForm.get('dosCifrasFilaTres').setValue('');
    this.chanceForm.get('unaCifraFilaTres').setValue('');
    this.emitirNumeros();

    document.getElementById('numeroFilaTres').focus();
    document.getElementById('numeroFilaTres').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaTres').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaTres').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaTres').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaTres').style.backgroundColor = '#EFEFEF';
  }

  borrarFilaCuatro() {
    this.chanceForm.get('numeroFilaCuatro').setValue('');
    this.chanceForm.get('valorDirectoFilaCuatro').setValue('');
    this.chanceForm.get('combinadoFilaCuatro').setValue('');
    this.chanceForm.get('dosCifrasFilaCuatro').setValue('');
    this.chanceForm.get('unaCifraFilaCuatro').setValue('');
    this.emitirNumeros()

    document.getElementById('numeroFilaCuatro').focus();
    document.getElementById('numeroFilaCuatro').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaCuatro').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaCuatro').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaCuatro').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaCuatro').style.backgroundColor = '#EFEFEF';
  }

  borrarFilaCinco() {
    this.chanceForm.get('numeroFilaCinco').setValue('');
    this.chanceForm.get('valorDirectoFilaCinco').setValue('');
    this.chanceForm.get('combinadoFilaCinco').setValue('');
    this.chanceForm.get('dosCifrasFilaCinco').setValue('');
    this.chanceForm.get('unaCifraFilaCinco').setValue('');
    this.emitirNumeros();

    document.getElementById('numeroFilaCinco').focus();
    document.getElementById('numeroFilaCinco').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaCinco').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaCinco').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaCinco').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaCinco').style.backgroundColor = '#EFEFEF';
  }

  onFocus(event){
    switch (event) {
      case 1:
        this.numeroUno = true;
        this.numeroDos = false;
        this.numeroTres = false;
        this.numeroCuatro = false;
        this.numeroCinco = false;
        break;
      case 2:
        this.numeroUno = false;
        this.numeroDos = true;
        this.numeroTres = false;
        this.numeroCuatro = false;
        this.numeroCinco = false;
        break;
      case 3:
        this.numeroUno = false;
        this.numeroDos = false;
        this.numeroTres = true;
        this.numeroCuatro = false;
        this.numeroCinco = false;
        break;
      case 4:
        this.numeroUno = false;
        this.numeroDos = false;
        this.numeroTres = false;
        this.numeroCuatro = true;
        this.numeroCinco = false;
        break;
      case 5:
        this.numeroUno = false;
        this.numeroDos = false;
        this.numeroTres = false;
        this.numeroCuatro = false;
        this.numeroCinco = true;
        break;
      default:
        break;
    }
  }


  aleatorioTresCifras() {
    if(this.numeroUno){
      this.chanceForm.controls.numeroFilaUno.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaUno').value, 1);
    }
    if(this.numeroDos){
      this.chanceForm.controls.numeroFilaDos.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaDos').value, 2);
    }
    if(this.numeroTres){
      this.chanceForm.controls.numeroFilaTres.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaTres').value, 3);
    }
    if(this.numeroCuatro){
      this.chanceForm.controls.numeroFilaCuatro.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaCuatro').value, 4);
    }
    if(this.numeroCinco){
      this.chanceForm.controls.numeroFilaCinco.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaCinco').value, 5);
    }
    this.emitirNumeros();
  }

  aleatorioCuatroCifras() {
    if(this.numeroUno){
      this.chanceForm.controls.numeroFilaUno.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaUno').value, 1);
    }
    if(this.numeroDos){
      this.chanceForm.controls.numeroFilaDos.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaDos').value, 2);
    }
    if(this.numeroTres){
      this.chanceForm.controls.numeroFilaTres.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaTres').value, 3);
    }
    if(this.numeroCuatro){
      this.chanceForm.controls.numeroFilaCuatro.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaCuatro').value, 4);
    }
    if(this.numeroCinco){
      this.chanceForm.controls.numeroFilaCinco.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.habilitarDeshabilitarSegunCifras(this.chanceForm.get('numeroFilaCinco').value, 5);
    }
    this.emitirNumeros();
  }



  repetir() {
    this.borrarTodo(1);
    const chanceApuesta = JSON.parse(localStorage.getItem('chanceApuesta'))

    if(chanceApuesta.length > 0){
      const apuestaRepetir = chanceApuesta.pop()
      this.loterias = apuestaRepetir.loterias;
      this.pCalendarioValor = new Date(apuestaRepetir.fechaSeleccionApuesta);
      this.setNumerosEvento(apuestaRepetir.listaNumeros)
      const emitLoterias = {
        loterias: this.loterias,
        fechaSeleccionApuesta: apuestaRepetir.fechaSeleccionApuesta
      }
      this.agregarLoterias.emit(emitLoterias);
    }

    
  }


  setNumerosEvento(numeros){
    numeros.forEach(element => {

      if (element.numeroFilaUno) {
        this.chanceForm.get('numeroFilaUno').setValue(element.numeroFilaUno);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaUno, 1);
      }
      if (element.valorDirectoFilaUno) { this.chanceForm.get('valorDirectoFilaUno').setValue(element.valorDirectoFilaUno); }
      if (element.combinadoFilaUno) { this.chanceForm.get('combinadoFilaUno').setValue(element.combinadoFilaUno); }
      if (element.dosCifrasFilaUno) { this.chanceForm.get('dosCifrasFilaUno').setValue(element.dosCifrasFilaUno); }
      if (element.unaCifraFilaUno) { this.chanceForm.get('unaCifraFilaUno').setValue(element.unaCifraFilaUno); }

      if (element.numeroFilaDos) {
        this.chanceForm.get('numeroFilaDos').setValue(element.numeroFilaDos);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaDos, 2);
      }
      if (element.valorDirectoFilaDos) { this.chanceForm.get('valorDirectoFilaDos').setValue(element.valorDirectoFilaDos); }
      if (element.combinadoFilaDos) { this.chanceForm.get('combinadoFilaDos').setValue(element.combinadoFilaDos); }
      if (element.dosCifrasFilaDos) { this.chanceForm.get('dosCifrasFilaDos').setValue(element.dosCifrasFilaDos); }
      if (element.unaCifraFilaDos) { this.chanceForm.get('unaCifraFilaDos').setValue(element.unaCifraFilaDos); }

      if (element.numeroFilaTres) {
        this.chanceForm.get('numeroFilaTres').setValue(element.numeroFilaTres);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaTres, 3);
      }
      if (element.valorDirectoFilaTres) { this.chanceForm.get('valorDirectoFilaTres').setValue(element.valorDirectoFilaTres); }
      if (element.combinadoFilaTres) { this.chanceForm.get('combinadoFilaTres').setValue(element.combinadoFilaTres); }
      if (element.dosCifrasFilaTres) { this.chanceForm.get('dosCifrasFilaTres').setValue(element.dosCifrasFilaTres); }
      if (element.unaCifraFilaTres) { this.chanceForm.get('unaCifraFilaTres').setValue(element.unaCifraFilaTres); }

      if (element.numeroFilaCuatro) {
        this.chanceForm.get('numeroFilaCuatro').setValue(element.numeroFilaCuatro);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaCuatro, 4);
      }
      if (element.valorDirectoFilaCuatro) { this.chanceForm.get('valorDirectoFilaCuatro').setValue(element.valorDirectoFilaCuatro); }
      if (element.combinadoFilaCuatro) { this.chanceForm.get('combinadoFilaCuatro').setValue(element.combinadoFilaCuatro); }
      if (element.dosCifrasFilaCuatro) { this.chanceForm.get('dosCifrasFilaCuatro').setValue(element.dosCifrasFilaCuatro); }
      if (element.unaCifraFilaCuatro) { this.chanceForm.get('unaCifraFilaCuatro').setValue(element.unaCifraFilaCuatro); }

      if (element.numeroFilaCinco) {
        this.chanceForm.get('numeroFilaCinco').setValue(element.numeroFilaCinco);
        this.habilitarDeshabilitarSegunCifras(element.numeroFilaCinco, 5);
      }
      if (element.valorDirectoFilaCinco) { this.chanceForm.get('valorDirectoFilaCinco').setValue(element.valorDirectoFilaCinco); }
      if (element.combinadoFilaCinco) { this.chanceForm.get('combinadoFilaCinco').setValue(element.combinadoFilaCinco); }
      if (element.dosCifrasFilaCinco) { this.chanceForm.get('dosCifrasFilaCinco').setValue(element.dosCifrasFilaCinco); }
      if (element.unaCifraFilaCinco) { this.chanceForm.get('unaCifraFilaCinco').setValue(element.unaCifraFilaCinco); }
    });

    this.emitirNumeros();
  }



  borrarTodo(event) {
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



    this.loterias = [];
    this.agregarLoterias.emit(this.loterias);
    if(event === 1){
      this.reiniciarEdit.emit(false);
    }
    
    this.emitirNumeros();


    document.getElementById('numeroFilaUno').focus();
    document.getElementById('numeroFilaUno').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaUno').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaUno').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaUno').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaUno').style.backgroundColor = '#EFEFEF';

    document.getElementById('numeroFilaDos').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaDos').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaDos').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaDos').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaDos').style.backgroundColor = '#EFEFEF';

    document.getElementById('numeroFilaTres').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaTres').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaTres').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaTres').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaTres').style.backgroundColor = '#EFEFEF';

    document.getElementById('numeroFilaCuatro').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaCuatro').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaCuatro').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaCuatro').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaCuatro').style.backgroundColor = '#EFEFEF';

    document.getElementById('numeroFilaCinco').style.backgroundColor = '#FFFFFF';
    document.getElementById('valorDirectoFilaCinco').style.backgroundColor = '#EFEFEF';
    document.getElementById('combinadoFilaCinco').style.backgroundColor = '#EFEFEF';
    document.getElementById('dosCifrasFilaCinco').style.backgroundColor = '#EFEFEF';
    document.getElementById('unaCifraFilaCinco').style.backgroundColor = '#EFEFEF';


    const chipL = document.getElementById('lun');
    chipL.style.backgroundColor = '#FFFFFF';
    chipL.style.color = '#BE1E42';

    const chipM = document.getElementById('mar');
    chipM.style.backgroundColor = '#FFFFFF';
    chipM.style.color = '#BE1E42';

    const chipMi = document.getElementById('mie');
    chipMi.style.backgroundColor = '#FFFFFF';
    chipMi.style.color = '#BE1E42';

    const chipJ = document.getElementById('jue');
    chipJ.style.backgroundColor = '#FFFFFF';
    chipJ.style.color = '#BE1E42';

    const chipV = document.getElementById('vie');
    chipV.style.backgroundColor = '#FFFFFF';
    chipV.style.color = '#BE1E42';

    const chipS = document.getElementById('sab');
    chipS.style.backgroundColor = '#FFFFFF';
    chipS.style.color = '#BE1E42';

    const chipD = document.getElementById('dom');
    chipD.style.backgroundColor = '#FFFFFF';
    chipD.style.color = '#BE1E42';


  }


  emitirNumeros() {
    
    let numerosValores:any = [
      {numeroFilaUno: this.chanceForm.get('numeroFilaUno').value},
      {numeroFilaDos: this.chanceForm.get('numeroFilaDos').value},
      {numeroFilaTres: this.chanceForm.get('numeroFilaTres').value},
      {numeroFilaCuatro: this.chanceForm.get('numeroFilaCuatro').value},
      {numeroFilaCinco: this.chanceForm.get('numeroFilaCinco').value}
    ]

    if(this.chanceForm.get('valorDirectoFilaUno').value){
      numerosValores[0].valorDirectoFilaUno = this.chanceForm.get('valorDirectoFilaUno').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('combinadoFilaUno').value){
      numerosValores[0].combinadoFilaUno = this.chanceForm.get('combinadoFilaUno').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('dosCifrasFilaUno').value){
      numerosValores[0].dosCifrasFilaUno = this.chanceForm.get('dosCifrasFilaUno').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('unaCifraFilaUno').value){
      numerosValores[0].unaCifraFilaUno = this.chanceForm.get('unaCifraFilaUno').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }


    if(this.chanceForm.get('valorDirectoFilaDos').value){
      numerosValores[1].valorDirectoFilaDos = this.chanceForm.get('valorDirectoFilaDos').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('combinadoFilaDos').value){
      numerosValores[1].combinadoFilaDos = this.chanceForm.get('combinadoFilaDos').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('dosCifrasFilaDos').value){
      numerosValores[1].dosCifrasFilaDos = this.chanceForm.get('dosCifrasFilaDos').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('unaCifraFilaDos').value){
      numerosValores[1].unaCifraFilaDos = this.chanceForm.get('unaCifraFilaDos').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }






    if(this.chanceForm.get('valorDirectoFilaTres').value){
      numerosValores[2].valorDirectoFilaTres = this.chanceForm.get('valorDirectoFilaTres').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('combinadoFilaTres').value){
      numerosValores[2].combinadoFilaTres = this.chanceForm.get('combinadoFilaTres').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('dosCifrasFilaTres').value){
      numerosValores[2].dosCifrasFilaDos = this.chanceForm.get('dosCifrasFilaTres').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('unaCifraFilaTres').value){
      numerosValores[2].unaCifraFilaTres = this.chanceForm.get('unaCifraFilaTres').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }



    if(this.chanceForm.get('valorDirectoFilaCuatro').value){
      numerosValores[3].valorDirectoFilaCuatro = this.chanceForm.get('valorDirectoFilaCuatro').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('combinadoFilaCuatro').value){
      numerosValores[3].combinadoFilaCuatro = this.chanceForm.get('combinadoFilaCuatro').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('dosCifrasFilaCuatro').value){
      numerosValores[3].dosCifrasFilaDos = this.chanceForm.get('dosCifrasFilaCuatro').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('unaCifraFilaCuatro').value){
      numerosValores[3].unaCifraFilaCuatro = this.chanceForm.get('unaCifraFilaCuatro').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }




    if(this.chanceForm.get('valorDirectoFilaCinco').value){
      numerosValores[4].valorDirectoFilaCinco = this.chanceForm.get('valorDirectoFilaCinco').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('combinadoFilaCinco').value){
      numerosValores[4].combinadoFilaCinco = this.chanceForm.get('combinadoFilaCinco').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('dosCifrasFilaCinco').value){
      numerosValores[4].dosCifrasFilaDos = this.chanceForm.get('dosCifrasFilaCinco').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    if(this.chanceForm.get('unaCifraFilaCinco').value){
      numerosValores[4].unaCifraFilaCinco = this.chanceForm.get('unaCifraFilaCinco').value.replace(/[^a-zA-Z 0-9.]+/g,'')
    }
    this.agregarNumeros.emit(numerosValores);
  }



  editarProducto(event) {
    this.borrarTodo(2)

    this.edit = true;
    const buscarApuestasEditar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const apuestaEditar = buscarApuestasEditar.filter(buscarApuestaEditar => buscarApuestaEditar._id == event._id);

    if (apuestaEditar[0].clienteOperacion.nombreCliente) {
      this.enabledCustomer = true;
      this.chanceForm.controls.nombreCliente.setValue(apuestaEditar[0].clienteOperacion.nombreCliente);
      this.chanceForm.controls.tipoDocumento.setValue(apuestaEditar[0].clienteOperacion.tipoDocumento);
      this.chanceForm.controls.numeroDocumento.setValue(apuestaEditar[0].clienteOperacion.numeroDocumento);
    }

    this.loterias = apuestaEditar[0].loterias;
    const emitLoterias = {
      loterias: this.loterias,
      fechaSeleccionApuesta: apuestaEditar[0].fechaSeleccionApuesta
    }

    this.agregarLoterias.emit(emitLoterias);
    this.infoEdit = apuestaEditar;

    this.setNumerosEvento(apuestaEditar[0].listaNumeros);
  }



  emitirCliente(event) {
    if (event === 1) {
      let clienteInfo = {
        tipoDocumento: this.chanceForm.get('tipoDocumento').value,
        numeroDocumento: this.chanceForm.get('numeroDocumento').value,
        nombreCliente: this.chanceForm.get('nombreCliente').value,
        idCustomer: this.idCustomer,
        correoCustomer: this.correoCustomer
      }
      this.agregarCliente.emit(clienteInfo);
    } else if (event === 2) {
      let clienteInfo = { tipoDocumento: null, numeroDocumento: null, nombreCliente: null, idCustomer: null, correoCustomer: null }
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
   * @description Metodo que se encarga de
   * recibir el false que emite el componente
   * que contiene el html del fomulario de
   * buscar cliente
   */
  closeModalCliente(event): void {
    this.displayModalBuscarCliente = event;
  }


  closeModalClienteVerCreacion(event): void {

    this.crearClienteChild.clienteForm.get('tipoDocumento').setValue(event.tipoDocumento);
    this.crearClienteChild.clienteForm.get('numeroDocumento').setValue(event.numeroDocumento);
    this.displayModalBuscarCliente = false;
    this.displayModalCreate = true;
    this.emitirCliente(event.emitirCliente);

  }

  searchCustomer(event): void {
    this.idCustomer = event.idCustomer;
    this.correoCustomer = event.correoCustomer;
    this.chanceForm.controls.nombreCliente.setValue(event.nombreCliente);
    this.chanceForm.controls.tipoDocumento.setValue(event.tipoDocumento);
    this.chanceForm.controls.numeroDocumento.setValue(event.numeroDocumento);

    let clienteOperacion = {
      correoCustomer : this.correoCustomer,
      idCustomer : this.idCustomer,
      nombreCliente: event.nombreCliente,
      numeroDocumento: event.numeroDocumento,
      tipoDocumento: event.tipoDocumento
    }
    localStorage.setItem('clienteOperacion', JSON.stringify(clienteOperacion));
    this.displayModalBuscarCliente = false;

    // llamamos evento observable que se encarga notificar al navbar nuevo cliente
    this.shellState.enviarEventoCliente(true);

    this.emitirCliente(event.emitirCliente);
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
  obtenerFechaCalendario(event) {
    let FormatoMomentFecha = moment(new Date(event.toString())).format();
    this.dayBet = FechaUtil.stringToDate(FormatoMomentFecha.toString());
    this.getLotteries()
  }



  transformAmount(event) {
    switch (event) {
      case 1:
        this.transformAmountLo('valorDirectoFilaUno');
        break;
      case 2:
        this.transformAmountLo('combinadoFilaUno');
        break;
      case 3:
        this.transformAmountLo('dosCifrasFilaUno');
        break;
      case 4:
        this.transformAmountLo('unaCifraFilaUno');
        break;
      case 5:
        this.transformAmountLo('valorDirectoFilaDos');
        break;
      case 6:
        this.transformAmountLo('combinadoFilaDos');
        break;
      case 7:
        this.transformAmountLo('dosCifrasFilaDos');
        break;
      case 8:
        this.transformAmountLo('unaCifraFilaDos');
        break;
      case 9:
        this.transformAmountLo('valorDirectoFilaTres');
        break;
      case 10:
        this.transformAmountLo('combinadoFilaTres');
        break;
      case 11:
        this.transformAmountLo('dosCifrasFilaTres');
        break;
      case 12:
        this.transformAmountLo('unaCifraFilaTres');
        break;
      case 13:
        this.transformAmountLo('valorDirectoFilaCuatro');
        break;
      case 14:
        this.transformAmountLo('combinadoFilaCuatro');
        break;
      case 15:
        this.transformAmountLo('dosCifrasFilaCuatro');
        break;
      case 16:
        this.transformAmountLo('unaCifraFilaCuatro');
        break;
      case 17:
        this.transformAmountLo('valorDirectoFilaCinco');
        break;
      case 18:
        this.transformAmountLo('combinadoFilaCinco');
        break;
      case 19:
        this.transformAmountLo('dosCifrasFilaCinco');
        break;
      case 20:
        this.transformAmountLo('unaCifraFilaCinco');
        break;
      default:
        break;
    }
    
  }


  transformAmountLo(event){
    let limpiarCadena = this.chanceForm.get(event).value.replace(/[^a-zA-Z 0-9.]+/g,'')
    let cadena = limpiarCadena;
    if (cadena && cadena.includes("$")) {
      cadena = cadena.substr(1, cadena.length);
      cadena = cadena.substr(0, cadena.indexOf(',')) + cadena.slice(cadena.indexOf(',') + 1);
      let pipe =  this.currencyPipe.transform(limpiarCadena, '$', 'symbol', '.0-0')
      if(pipe){
        this.chanceForm.get(event).setValue(pipe);
      }
    }
    else {
      let pipe = this.currencyPipe.transform(limpiarCadena, '$', 'symbol', '.0-0')
      if(pipe){
        this.chanceForm.get(event).setValue(pipe);
      }
    }
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
