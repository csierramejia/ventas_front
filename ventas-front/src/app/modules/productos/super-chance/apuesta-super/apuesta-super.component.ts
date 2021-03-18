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
  selector: 'app-apuesta-super',
  templateUrl: './apuesta-super.component.html',
  styleUrls: ['./apuesta-super.component.css'],
  providers: [ProductosService, CommonService]
})
export class ApuestaSuperComponent extends CommonComponent implements OnInit  {

  @Output() agregarLoterias: EventEmitter<any> = new EventEmitter();
  @Output() reiniciarEdit: EventEmitter<any> = new EventEmitter();
  @Output() agregarNumeros: EventEmitter<any> = new EventEmitter();
  @Output() agregarModalidades: EventEmitter<any> = new EventEmitter();
  @Output() agregarCliente: EventEmitter<any> = new EventEmitter();
  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;


  valoresModalidadesUno = []
  valoresModalidadesDos = []
  valoresModalidadesTres = []
  valoresModalidadesCuatro = []
  valoresModalidadesCinco = []



  numeroUno = false;
  numeroDos = false;
  numeroTres = false;
  numeroCuatro = false;
  numeroCinco = false;

  stateDisabeld = false;
  subscription: any;
  lengEspanol = {}

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
  maxlengthV = 4
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
    numeroFilaDos: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    numeroFilaTres: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    numeroFilaCuatro: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    numeroFilaCinco: new FormControl('', [Validators.required, Validators.maxLength(4)]),


    valoresModalidadesUno: new FormControl(''),
    valoresModalidadesDos: new FormControl(''),
    valoresModalidadesTres: new FormControl(''),
    valoresModalidadesCuatro: new FormControl(''),
    valoresModalidadesCinco: new FormControl(''),

    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombreCliente: new FormControl(''),
  });

  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    public shellState: ShellState
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
    let lotSelec = this.obtenerLoteriasSeleccionadas()
    // if(lotSelec < 2){
      
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
      
      
    // } else {
    //   this.loterias[keyResponse].checked = false
    //   let ele = document.getElementById("loteriaid"+loteria.idLoteria) as HTMLInputElement;
    //   ele.checked = false;
    // }

    const emitLoterias = {
      loterias: this.loterias,
      fechaSeleccionApuesta: this.dayBet
    }
    this.agregarLoterias.emit(emitLoterias);
  }



  obtenerLoteriasSeleccionadas(){
    let cant = 0
    this.loterias.forEach(element => {
      if(element.checked){
        cant = cant + 1;
      }
    });
    return cant;
  }


  limpiaLoterias(){
    for (let index = 0; index < this.loterias.length; index++) {
      this.loterias[index].checked = false;
    }
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


  generarAletorio(){
    return Math.round(Math.random() * (this.loterias.length-1 - 0) + 0);
  }


  consultarValoresModalidad(numero, fila){
    //SUPER CHANCE
      this.productosService.consultarValoresModalidad("SUPER CHANCE",numero).subscribe(
        valoresData => {
          if (fila === 1) {
            this.valoresModalidadesUno = [];
            valoresData.forEach(element => {this.valoresModalidadesUno.push({label: element, value: element})});
            this.chanceForm.controls.valoresModalidadesUno.setValue(this.valoresModalidadesUno[0].value);
          } else if(fila === 2){
            this.valoresModalidadesDos = [];
            valoresData.forEach(element => {this.valoresModalidadesDos.push({label: element, value: element})});
            this.chanceForm.controls.valoresModalidadesDos.setValue(this.valoresModalidadesDos[0].value);
          } else if(fila === 3){
            this.valoresModalidadesTres = [];
            valoresData.forEach(element => {this.valoresModalidadesTres.push({label: element, value: element})});
            this.chanceForm.controls.valoresModalidadesTres.setValue(this.valoresModalidadesTres[0].value);
          } else if(fila === 4){
            this.valoresModalidadesCuatro = [];
            valoresData.forEach(element => {this.valoresModalidadesCuatro.push({label: element, value: element})});
            this.chanceForm.controls.valoresModalidadesCuatro.setValue(this.valoresModalidadesCuatro[0].value);
          } else if(fila === 5){
            this.valoresModalidadesCinco = [];
            valoresData.forEach(element => {this.valoresModalidadesCinco.push({label: element, value: element})});
            this.chanceForm.controls.valoresModalidadesCinco.setValue(this.valoresModalidadesCinco[0].value);
          }
          this.emitirModalidades();
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
  }


  chance_validar_fila_modalidad(fila, numero){
    if(String(numero).length === 3){
      if(fila === 1){
        this.consultarValoresModalidad(3,1)
      } else if(fila === 2){
        this.consultarValoresModalidad(3,2)
      } else if(fila === 3){
        this.consultarValoresModalidad(3,3)
      } else if(fila === 4){
        this.consultarValoresModalidad(3,4)
      } else if(fila === 5){
        this.consultarValoresModalidad(3,5)
      }
    } else if(String(numero).length === 4){
      if(fila === 1){
        this.consultarValoresModalidad(4,1)
      } else if(fila === 2){
        this.consultarValoresModalidad(4,2)
      } else if(fila === 3){
        this.consultarValoresModalidad(4,3)
      } else if(fila === 4){
        this.consultarValoresModalidad(4,4)
      } else if(fila === 5){
        this.consultarValoresModalidad(4,5)
      }
    }

    this.emitirNumeros();
    this.emitirModalidades();
  }


  aleatorioTresCifras() {
    if(this.numeroUno){
      this.chanceForm.controls.numeroFilaUno.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.consultarValoresModalidad(3,1)
    }
    if(this.numeroDos){
      this.chanceForm.controls.numeroFilaDos.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.consultarValoresModalidad(3,2)
    }
    if(this.numeroTres){
      this.chanceForm.controls.numeroFilaTres.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.consultarValoresModalidad(3,3)
    }
    if(this.numeroCuatro){
      this.chanceForm.controls.numeroFilaCuatro.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.consultarValoresModalidad(3,4)
    }
    if(this.numeroCinco){
      this.chanceForm.controls.numeroFilaCinco.setValue(Math.round(Math.random() * (100 - 999) + 999));
      this.consultarValoresModalidad(3,5)
    }
    this.emitirNumeros();
    this.emitirModalidades();
  }


  aleatorioCuatroCifras() {
    if(this.numeroUno){
      this.chanceForm.controls.numeroFilaUno.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.consultarValoresModalidad(4,1)
    }
    if(this.numeroDos){
      this.chanceForm.controls.numeroFilaDos.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.consultarValoresModalidad(4,2)
    }
    if(this.numeroTres){
      this.chanceForm.controls.numeroFilaTres.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.consultarValoresModalidad(4,3)
    }
    if(this.numeroCuatro){
      this.chanceForm.controls.numeroFilaCuatro.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.consultarValoresModalidad(4,4)
    }
    if(this.numeroCinco){
      this.chanceForm.controls.numeroFilaCinco.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
      this.consultarValoresModalidad(4,5)
    }
    this.emitirNumeros();
    this.emitirModalidades();
  }



  aleatorioCuatroCifrasAll() {
    this.chanceForm.controls.numeroFilaUno.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    this.consultarValoresModalidad(4,1)
    this.chanceForm.controls.numeroFilaDos.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    this.consultarValoresModalidad(4,2)
    this.chanceForm.controls.numeroFilaTres.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    this.consultarValoresModalidad(4,3)
    this.chanceForm.controls.numeroFilaCuatro.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    this.consultarValoresModalidad(4,4)
    this.chanceForm.controls.numeroFilaCinco.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    this.consultarValoresModalidad(4,5)
    this.emitirNumeros();
    this.emitirModalidades();
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


  emitirNumeros() {
    let numerosValores:any = [
      {numeroFilaUno: this.chanceForm.get('numeroFilaUno').value},
      {numeroFilaDos: this.chanceForm.get('numeroFilaDos').value},
      {numeroFilaTres: this.chanceForm.get('numeroFilaTres').value},
      {numeroFilaCuatro: this.chanceForm.get('numeroFilaCuatro').value},
      {numeroFilaCinco: this.chanceForm.get('numeroFilaCinco').value}
    ]
    this.agregarNumeros.emit(numerosValores);
  }



  emitirModalidades() {
    let modalidadesValores:any = [
      {valoresModalidadesUno: this.chanceForm.get('valoresModalidadesUno').value},
      {valoresModalidadesDos: this.chanceForm.get('valoresModalidadesDos').value},
      {valoresModalidadesTres: this.chanceForm.get('valoresModalidadesTres').value},
      {valoresModalidadesCuatro: this.chanceForm.get('valoresModalidadesCuatro').value},
      {valoresModalidadesCinco: this.chanceForm.get('valoresModalidadesCinco').value}
    ]
    this.agregarModalidades.emit(modalidadesValores);
  }



  




  borrarTodo(event) {

    this.chanceForm.controls.numeroFilaUno.setValue('');
    this.chanceForm.controls.numeroFilaDos.setValue('');
    this.chanceForm.controls.numeroFilaTres.setValue('');
    this.chanceForm.controls.numeroFilaCuatro.setValue('');
    this.chanceForm.controls.numeroFilaCinco.setValue('');

    this.chanceForm.controls.valoresModalidadesUno.setValue('');
    this.chanceForm.controls.valoresModalidadesDos.setValue('');
    this.chanceForm.controls.valoresModalidadesTres.setValue('');
    this.chanceForm.controls.valoresModalidadesCuatro.setValue('');
    this.chanceForm.controls.valoresModalidadesCinco.setValue('');

    this.valoresModalidadesUno = [];
    this.valoresModalidadesDos = [];
    this.valoresModalidadesTres = [];
    this.valoresModalidadesCuatro = [];
    this.valoresModalidadesCinco = [];

    this.loterias = [];
    this.agregarLoterias.emit(this.loterias);
    if(event === 1){
      this.reiniciarEdit.emit(false);
    }
    
    this.emitirNumeros();
    this.emitirModalidades();

    document.getElementById('numeroFilaUno').focus();
    

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


  editarProducto(event) {
    this.borrarTodo(2)

    this.edit = true;
    const buscarApuestasEditar = JSON.parse(localStorage.getItem('superChanceApuesta'))
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
    this.setNumerosEvento(apuestaEditar[0].listaNumeros, apuestaEditar[0].listaModalidades);

  }


  borrarFilaUno() {
    this.chanceForm.get('numeroFilaUno').setValue('');
    this.chanceForm.get('valoresModalidadesUno').setValue('');
    this.valoresModalidadesUno = [];
    this.emitirNumeros();
    this.emitirModalidades();
    document.getElementById('numeroFilaUno').focus();
  }


  borrarFilaDos() {
    this.chanceForm.get('numeroFilaDos').setValue('');
    this.chanceForm.get('valoresModalidadesDos').setValue('');
    this.valoresModalidadesDos = [];
    this.emitirNumeros();
    this.emitirModalidades();
    document.getElementById('numeroFilaDos').focus();
  }


  borrarFilaTres() {
    this.chanceForm.get('numeroFilaTres').setValue('');
    this.chanceForm.get('valoresModalidadesTres').setValue('');
    this.valoresModalidadesTres = [];
    this.emitirNumeros();
    this.emitirModalidades();
    document.getElementById('numeroFilaTres').focus();
  }


  borrarFilaCuatro() {
    this.chanceForm.get('numeroFilaCuatro').setValue('');
    this.chanceForm.get('valoresModalidadesCuatro').setValue('');
    this.valoresModalidadesCuatro = [];
    this.emitirNumeros();
    this.emitirModalidades();
    document.getElementById('numeroFilaCuatro').focus();
  }


  borrarFilaCinco() {
    this.chanceForm.get('numeroFilaCinco').setValue('');
    this.chanceForm.get('valoresModalidadesCinco').setValue('');
    this.valoresModalidadesCinco = [];
    this.emitirNumeros();
    this.emitirModalidades();
    document.getElementById('numeroFilaCinco').focus();
  }


  setNumerosEvento(numeros, modalidades){
    let nuevo_array_numeros_modalidades = []
    for (let index = 0; index < numeros.length; index++) {
      if(numeros[index].numeroFilaUno){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaUno, modalidad:modalidades[0].valoresModalidadesUno})}
      if(numeros[index].numeroFilaDos){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaDos, modalidad:modalidades[1].valoresModalidadesDos})}
      if(numeros[index].numeroFilaTres){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaTres, modalidad:modalidades[2].valoresModalidadesTres})}
      if(numeros[index].numeroFilaCuatro){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaCuatro, modalidad:modalidades[3].valoresModalidadesCuatro})}
      if(numeros[index].numeroFilaCinco){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaCinco, modalidad:modalidades[4].valoresModalidadesCinco})}
    }
    this.operacion_por_fila(nuevo_array_numeros_modalidades)
  }

  operacion_por_fila(nuevo_array_numeros_modalidades) {

    if(nuevo_array_numeros_modalidades[0]){
      this.chanceForm.get('numeroFilaUno').setValue(nuevo_array_numeros_modalidades[0].numero);
      this.productosService.consultarValoresModalidad("SUPER CHANCE",String(nuevo_array_numeros_modalidades[0].numero).length).subscribe(
        valoresData => {
          valoresData.forEach(element => {this.valoresModalidadesUno.push({label: element, value: element})});
          this.chanceForm.controls.valoresModalidadesUno.setValue(nuevo_array_numeros_modalidades[0].modalidad);
          this.emitirNumeros();
          this.emitirModalidades();
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );

    }

    if(nuevo_array_numeros_modalidades[1]){
      this.chanceForm.get('numeroFilaDos').setValue(nuevo_array_numeros_modalidades[1].numero);
      this.productosService.consultarValoresModalidad("SUPER CHANCE",String(nuevo_array_numeros_modalidades[1].numero).length).subscribe(
        valoresData => {
          valoresData.forEach(element => {this.valoresModalidadesDos.push({label: element, value: element})});
          this.chanceForm.controls.valoresModalidadesDos.setValue(nuevo_array_numeros_modalidades[1].modalidad);
          this.emitirNumeros();
          this.emitirModalidades();
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

    if(nuevo_array_numeros_modalidades[2]){
      this.chanceForm.get('numeroFilaTres').setValue(nuevo_array_numeros_modalidades[2].numero);
      this.productosService.consultarValoresModalidad("SUPER CHANCE",String(nuevo_array_numeros_modalidades[2].numero).length).subscribe(
        valoresData => {
          valoresData.forEach(element => {this.valoresModalidadesTres.push({label: element, value: element})});
          this.chanceForm.controls.valoresModalidadesTres.setValue(nuevo_array_numeros_modalidades[2].modalidad);
          this.emitirNumeros();
          this.emitirModalidades();
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

    if(nuevo_array_numeros_modalidades[3]){
      this.chanceForm.get('numeroFilaCuatro').setValue(nuevo_array_numeros_modalidades[3].numero);
      this.productosService.consultarValoresModalidad("SUPER CHANCE",String(nuevo_array_numeros_modalidades[3].numero).length).subscribe(
        valoresData => {
          valoresData.forEach(element => {this.valoresModalidadesCuatro.push({label: element, value: element})});
          this.chanceForm.controls.valoresModalidadesCuatro.setValue(nuevo_array_numeros_modalidades[3].modalidad);
          this.emitirNumeros();
          this.emitirModalidades();
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

    if(nuevo_array_numeros_modalidades[4]){
      this.chanceForm.get('numeroFilaCinco').setValue(nuevo_array_numeros_modalidades[4].numero);
      this.productosService.consultarValoresModalidad("SUPER CHANCE",String(nuevo_array_numeros_modalidades[4].numero).length).subscribe(
        valoresData => {
          valoresData.forEach(element => {this.valoresModalidadesCinco.push({label: element, value: element})});
          this.chanceForm.controls.valoresModalidadesCinco.setValue(nuevo_array_numeros_modalidades[4].modalidad);
          this.emitirNumeros();
          this.emitirModalidades();
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

    
    


  }




  





}