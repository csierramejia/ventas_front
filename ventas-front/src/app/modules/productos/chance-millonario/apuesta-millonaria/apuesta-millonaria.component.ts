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
  @Output() agregarModalidad: EventEmitter<any> = new EventEmitter();
  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;

  stateDisabeld = false;
  subscription: any;
  lengEspanol = {}
  selectedCifras: any;
  arrayCifrasSeleted = [
      {name: '4 Cifras', code: '4C'},
      {name: '3 Cifras', code: '3C'}
  ];
  pCalendarioValor: Date;
  displayModalBuscarCliente = true;
  valoresModalidades:any;
  // valoresModalidades = [2000,5000,6000]

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
  maxlengthV = 0
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
    numeroFilaUno: new FormControl({ value: '', disabled: true }),
    numeroFilaDos: new FormControl({ value: '', disabled: true }),
    numeroFilaTres: new FormControl({ value: '', disabled: true }),
    numeroFilaCuatro: new FormControl({ value: '', disabled: true }),
    numeroFilaCinco: new FormControl({ value: '', disabled: true }),
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombreCliente: new FormControl(''),
    valoresModalidades: new FormControl([]),
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


  obtenerNumeroModalidad(){
    this.borrarTodo(4);
    if(this.selectedCifras.code === '4C'){
      this.maxlengthV = 4;
      this.consultarValoresModalidad(1);
    } else if(this.selectedCifras.code === '3C'){
      this.maxlengthV = 3;
      this.consultarValoresModalidad(3);
    }
    this.chanceForm.get('numeroFilaUno').enable();
    this.chanceForm.get('numeroFilaDos').enable();
    this.chanceForm.get('numeroFilaTres').enable();
    this.chanceForm.get('numeroFilaCuatro').enable();
    this.chanceForm.get('numeroFilaCinco').enable();
  }

  consultarValoresModalidad(evento){
    this.valoresModalidades=[];
      this.productosService.consultarValoresModalidad("CHANCE MILLONARIO",evento).subscribe(
        valoresData => {
         this.valoresModalidades=valoresData;
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
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
    let lotSelec = this.obtenerLoteriasSeleccionadas()
    if(lotSelec < 2){
      
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
      
      
    } else {
      this.loterias[keyResponse].checked = false
      let ele = document.getElementById("loteriaid"+loteria.idLoteria) as HTMLInputElement;
      ele.checked = false;
    }

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
      // Limpiamos las loterias seleccionadas
      this.limpiaLoterias();
      const ls = this.getRandomValues();
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < ls.length; index++) {
        this.randomSelected(ls[index]);
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
   * @description Metodo que se encarga
   * de devolver los values aletorios
   * que se van a usar para marcar las
   * dos loterias
   */
  getRandomValues() {
    const array = [];
    const max = this.loterias.length - 1;
    array.push(this.getAletorio(max));
    return this.validExistRandom(array, max, max);
  }

  getAletorio(max) {
    return Math.round(Math.random() * (max - 0) + 0);
  }

  /**
   * @author Luis Hernandez
   * @description Metodo que
   * se encarga de validar
   * que no se repita un
   * value para garantizar
   * que se marcar dos loterias
   * diferentes
   * @param array
   * @param max
   * @param loteriasLen
   */
  validExistRandom(array, max, loteriasLen) {
    const newl = this.getAletorio(max);
    const found = array.find(element => element === newl);
    if (found === undefined) {
      array.push(newl);
    } else {
      const newMore = newl + 1;
      if (newMore <= loteriasLen) {
        array.push(newMore);
      } else {
        const newMin = newl - 1;
        array.push(newMin);
      }
    }
    return array;
  }



  /**
   * @author Luis Hernandez
   * @description Metodo que
   * se encarga de ir pintando
   * las dos loterias aletorias
   * @param index
   */
  randomSelected(index): void {
    if (this.loterias[index].checked) {
      this.loterias[index].checked = false;
    } else {
      this.loterias[index].checked = true;
    }
    let valid = true;
    this.loterias.forEach(element => { if (!element.checked) { valid = false; } });
  }



  // generarAletorio(){
  //   return Math.round(Math.random() * (this.loterias.length-1 - 0) + 0);
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


  emitirModalidad(modalidad){
    let modalidadEmitir = {
      modalidad:modalidad,
      selectedCifras:this.selectedCifras
    }
    this.agregarModalidad.emit(modalidadEmitir);
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



  
  borrarTodo(event) {

    if(event === 3){
      delete this.selectedCifras;
    }
    
    delete this.valoresModalidades;

    this.chanceForm.controls.numeroFilaUno.setValue('');
    this.chanceForm.controls.numeroFilaDos.setValue('');
    this.chanceForm.controls.numeroFilaTres.setValue('');
    this.chanceForm.controls.numeroFilaCuatro.setValue('');
    this.chanceForm.controls.numeroFilaCinco.setValue('');
    this.chanceForm.controls.valoresModalidades.setValue([]);

    
    if(event === 1){
      this.reiniciarEdit.emit(false);
    }
    
    this.emitirNumeros();


    document.getElementById('numeroFilaUno').focus();
    
    if(event != 4){
      this.loterias = [];
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
      this.agregarLoterias.emit(this.loterias);
    }
    
  }



  


  generarAletorios(event, numeroCifras, fila){

    if(numeroCifras){
      if(event == 'all'){
        let arrayAletorios = []
        if(numeroCifras == '3C'){
          for (let index = 0; index < 5; index++) {
            arrayAletorios.push(Math.round(Math.random() * (100 - 999) + 999))
          }
        } else if(numeroCifras == '4C'){
          for (let index = 0; index < 5; index++) {
            arrayAletorios.push(Math.round(Math.random() * (1000 - 9999) + 9999))
          }
        }
        this.chanceForm.controls.numeroFilaUno.setValue(arrayAletorios[0]);
        this.chanceForm.controls.numeroFilaDos.setValue(arrayAletorios[1]);
        this.chanceForm.controls.numeroFilaTres.setValue(arrayAletorios[2]);
        this.chanceForm.controls.numeroFilaCuatro.setValue(arrayAletorios[3]);
        this.chanceForm.controls.numeroFilaCinco.setValue(arrayAletorios[4]);
      } else if(event == 'one'){
        let aletorio = 0;
        if(numeroCifras == '3C'){
          aletorio = Math.round(Math.random() * (100 - 999) + 999);
          this.printFilaAletorio(aletorio, fila);
        } else if(numeroCifras == '4C'){
          aletorio = Math.round(Math.random() * (1000 - 9999) + 9999);
          this.printFilaAletorio(aletorio, fila);
        }
      }
    }
    this.emitirNumeros();
  }


  printFilaAletorio(numero, fila){
    switch (fila) {
      case 1:
        this.chanceForm.controls.numeroFilaUno.setValue(numero);
        break;
      case 2:
        this.chanceForm.controls.numeroFilaDos.setValue(numero);
        break;
      case 3:
        this.chanceForm.controls.numeroFilaTres.setValue(numero);
        break;
      case 4:
        this.chanceForm.controls.numeroFilaCuatro.setValue(numero);
        break;
      case 5:
        this.chanceForm.controls.numeroFilaCinco.setValue(numero);
        break;
      default:
        break;
    }
  }


  editarProducto(event) {
    this.borrarTodo(2)

    this.edit = true;
    const buscarApuestasEditar = JSON.parse(localStorage.getItem('chanceApuestaMillonario'))
    const apuestaEditar = buscarApuestasEditar.filter(buscarApuestaEditar => buscarApuestaEditar._id == event._id);
    this.dayBet = FechaUtil.stringToDate(apuestaEditar[0].fechaSeleccionApuesta);

    if (apuestaEditar[0].clienteOperacion.nombreCliente) {
      this.enabledCustomer = true;
      this.chanceForm.controls.nombreCliente.setValue(apuestaEditar[0].clienteOperacion.nombreCliente);
      this.chanceForm.controls.tipoDocumento.setValue(apuestaEditar[0].clienteOperacion.tipoDocumento);
      this.chanceForm.controls.numeroDocumento.setValue(apuestaEditar[0].clienteOperacion.numeroDocumento);
    }

    if(apuestaEditar[0].selectedCifras){
      this.selectedCifras = apuestaEditar[0].selectedCifras
      if(apuestaEditar[0].selectedCifras.code === '4C'){
        this.maxlengthV = 4;
        this.consultarValoresModalidad(4);
      } else if(apuestaEditar[0].selectedCifras.code === '3C'){
        this.maxlengthV = 3;
        this.consultarValoresModalidad(3);
      }
      this.chanceForm.get('valoresModalidades').setValue(apuestaEditar[0].total);
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

  borrarFilaUno() {
    this.chanceForm.get('numeroFilaUno').setValue('');
    this.emitirNumeros()
    document.getElementById('numeroFilaUno').focus();
  }


  borrarFilaDos() {
    this.chanceForm.get('numeroFilaDos').setValue('');
    this.emitirNumeros()
    document.getElementById('numeroFilaDos').focus();
  }


  borrarFilaTres() {
    this.chanceForm.get('numeroFilaTres').setValue('');
    this.emitirNumeros();
    document.getElementById('numeroFilaTres').focus();
  }


  borrarFilaCuatro() {
    this.chanceForm.get('numeroFilaCuatro').setValue('');
    this.emitirNumeros()
    document.getElementById('numeroFilaCuatro').focus();
  }


  borrarFilaCinco() {
    this.chanceForm.get('numeroFilaCinco').setValue('');
    this.emitirNumeros();
    document.getElementById('numeroFilaCinco').focus();
  }




  setNumerosEvento(numeros){
    numeros.forEach(element => {
      if (element.numeroFilaUno) {
        this.chanceForm.get('numeroFilaUno').setValue(element.numeroFilaUno);
      }
      if (element.numeroFilaDos) {
        this.chanceForm.get('numeroFilaDos').setValue(element.numeroFilaDos);
      }
      if (element.numeroFilaTres) {
        this.chanceForm.get('numeroFilaTres').setValue(element.numeroFilaTres);
      }
      if (element.numeroFilaCuatro) {
        this.chanceForm.get('numeroFilaCuatro').setValue(element.numeroFilaCuatro);
      }
      if (element.numeroFilaCinco) {
        this.chanceForm.get('numeroFilaCinco').setValue(element.numeroFilaCinco);
      }
    });
    this.emitirNumeros();
  }





}
