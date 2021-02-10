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

  chanceForm = new FormGroup({
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
    if(this.obtenerLoteriasSeleccionadas()){
      
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
    } else {
      this.loterias[keyResponse].checked = false
      let ele = document.getElementById("loteriaid"+loteria.idLoteria) as HTMLInputElement;
      ele.checked = false;
    }
    
  }



  obtenerLoteriasSeleccionadas(){

    let cant = 0

    this.loterias.forEach(element => {

      if(element.checked){
        cant = cant + 1;
      }
    });


    if(cant < 2){
      return true;
    } else {
      return false;
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
      let aleatorio= Math.round(Math.random() * (this.loterias.length-1 - 0) + 0);
      this.loterias[aleatorio].checked=true;
      aleatorio=aleatorio= Math.round(Math.random() * (this.loterias.length-1 - 0) + 0);
      this.loterias[aleatorio].checked=true;
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


}
