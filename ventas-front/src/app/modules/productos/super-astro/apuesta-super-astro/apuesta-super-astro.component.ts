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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-apuesta-super-astro',
  templateUrl: './apuesta-super-astro.component.html',
  styleUrls: ['./apuesta-super-astro.component.css'],
  providers: [ProductosService, CommonService]
})
export class ApuestaSuperAstroComponent extends CommonComponent implements OnInit  {

  @Output() agregarLoterias: EventEmitter<any> = new EventEmitter();
  @Output() reiniciarEdit: EventEmitter<any> = new EventEmitter();
  @Output() agregarNumeros: EventEmitter<any> = new EventEmitter();
  @Output() agregarValores: EventEmitter<any> = new EventEmitter();
  @Output() agregarModalidades: EventEmitter<any> = new EventEmitter();
  @Output() agregarCliente: EventEmitter<any> = new EventEmitter();
  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;


  valoresModalidadesUno = []
  valoresModalidadesDos = []
  valoresModalidadesTres = []
  valoresModalidadesCuatro = []

  valorUno = [
    {label: '', value:''}, {label: '$500', value:'$500'},{label: '$600', value:'$600'},{label: '$700', value:'$700'},{label: '$800', value:'$800'},{label: '$900', value:'$900'},{label: '$1000', value:'$1000'},{label: '$1100', value:'$1100'},{label: '$1200', value:'$1200'},{label: '$1300', value:'$1300'},{label: '$1400', value:'$1400'},{label: '$1500', value:'$1500'},{label: '$1600', value:'$1600'},{label: '$1700', value:'$1700'},{label: '$1800', value:'$1800'},{label: '$1900', value:'$1900'},{label: '$2000', value:'$2000'},{label: '$2100', value:'$2100'},{label: '$2200', value:'$2200'},{label: '$2300', value:'$2300'},{label: '$2400', value:'$2400'},{label: '$2500', value:'$2500'},{label: '$2600', value:'$2600'},{label: '$2700', value:'$2700'},{label: '$2800', value:'$2800'},{label: '$2900', value:'$2900'},{label: '$3000', value:'$3000'},{label: '$3100', value:'$3100'},{label: '$3200', value:'$3200'},{label: '$3300', value:'$3300'},{label: '$3400', value:'$3400'},{label: '$3500', value:'$3500'},{label: '$3600', value:'$3600'},{label: '$3700', value:'$3700'},{label: '$3800', value:'$3800'},{label: '$3900', value:'$3900'},{label: '$4000', value:'$4000'},{label: '$4100', value:'$4100'},{label: '$4200', value:'$4200'},{label: '$4300', value:'$4300'},{label: '$4400', value:'$4400'},{label: '$4500', value:'$4500'},{label: '$4600', value:'$4600'},{label: '$4700', value:'$4700'},{label: '$4800', value:'$4800'},{label: '$4900', value:'$4900'},{label: '$5000', value:'$5000'},{label: '$5100', value:'$5100'},{label: '$5200', value:'$5200'},{label: '$5300', value:'$5300'},{label: '$5400', value:'$5400'},{label: '$5500', value:'$5500'},{label: '$5600', value:'$5600'},{label: '$5700', value:'$5700'},{label: '$5800', value:'$5800'},{label: '$5900', value:'$5900'},{label: '$6000', value:'$6000'},{label: '$6100', value:'$6100'},{label: '$6200', value:'$6200'},{label: '$6300', value:'$6300'},{label: '$6400', value:'$6400'},{label: '$6500', value:'$6500'},{label: '$6600', value:'$6600'},{label: '$6700', value:'$6700'},{label: '$6800', value:'$6800'},{label: '$6900', value:'$6900'},{label: '$7000', value:'$7000'},{label: '$7100', value:'$7100'},{label: '$7200', value:'$7200'},{label: '$7300', value:'$7300'},{label: '$7400', value:'$7400'},{label: '$7500', value:'$7500'},{label: '$7600', value:'$7600'},{label: '$7700', value:'$7700'},{label: '$7800', value:'$7800'},{label: '$7900', value:'$7900'},{label: '$8000', value:'$8000'},{label: '$8100', value:'$8100'},{label: '$8200', value:'$8200'},{label: '$8300', value:'$8300'},{label: '$8400', value:'$8400'},{label: '$8500', value:'$8500'},{label: '$8600', value:'$8600'},{label: '$8700', value:'$8700'},{label: '$8800', value:'$8800'},{label: '$8900', value:'$8900'},{label: '$9000', value:'$9000'},{label: '$9100', value:'$9100'},{label: '$9200', value:'$9200'},{label: '$9300', value:'$9300'},{label: '$9400', value:'$9400'},{label: '$9500', value:'$9500'},{label: '$9600', value:'$9600'},{label: '$9700', value:'$9700'},{label: '$9800', value:'$9800'},{label: '$9900', value:'$9900'},{label: '$10000', value:'$10000'}
  ]
  valorDos = [
    {label: '', value:''}, {label: '$500', value:'$500'},{label: '$600', value:'$600'},{label: '$700', value:'$700'},{label: '$800', value:'$800'},{label: '$900', value:'$900'},{label: '$1000', value:'$1000'},{label: '$1100', value:'$1100'},{label: '$1200', value:'$1200'},{label: '$1300', value:'$1300'},{label: '$1400', value:'$1400'},{label: '$1500', value:'$1500'},{label: '$1600', value:'$1600'},{label: '$1700', value:'$1700'},{label: '$1800', value:'$1800'},{label: '$1900', value:'$1900'},{label: '$2000', value:'$2000'},{label: '$2100', value:'$2100'},{label: '$2200', value:'$2200'},{label: '$2300', value:'$2300'},{label: '$2400', value:'$2400'},{label: '$2500', value:'$2500'},{label: '$2600', value:'$2600'},{label: '$2700', value:'$2700'},{label: '$2800', value:'$2800'},{label: '$2900', value:'$2900'},{label: '$3000', value:'$3000'},{label: '$3100', value:'$3100'},{label: '$3200', value:'$3200'},{label: '$3300', value:'$3300'},{label: '$3400', value:'$3400'},{label: '$3500', value:'$3500'},{label: '$3600', value:'$3600'},{label: '$3700', value:'$3700'},{label: '$3800', value:'$3800'},{label: '$3900', value:'$3900'},{label: '$4000', value:'$4000'},{label: '$4100', value:'$4100'},{label: '$4200', value:'$4200'},{label: '$4300', value:'$4300'},{label: '$4400', value:'$4400'},{label: '$4500', value:'$4500'},{label: '$4600', value:'$4600'},{label: '$4700', value:'$4700'},{label: '$4800', value:'$4800'},{label: '$4900', value:'$4900'},{label: '$5000', value:'$5000'},{label: '$5100', value:'$5100'},{label: '$5200', value:'$5200'},{label: '$5300', value:'$5300'},{label: '$5400', value:'$5400'},{label: '$5500', value:'$5500'},{label: '$5600', value:'$5600'},{label: '$5700', value:'$5700'},{label: '$5800', value:'$5800'},{label: '$5900', value:'$5900'},{label: '$6000', value:'$6000'},{label: '$6100', value:'$6100'},{label: '$6200', value:'$6200'},{label: '$6300', value:'$6300'},{label: '$6400', value:'$6400'},{label: '$6500', value:'$6500'},{label: '$6600', value:'$6600'},{label: '$6700', value:'$6700'},{label: '$6800', value:'$6800'},{label: '$6900', value:'$6900'},{label: '$7000', value:'$7000'},{label: '$7100', value:'$7100'},{label: '$7200', value:'$7200'},{label: '$7300', value:'$7300'},{label: '$7400', value:'$7400'},{label: '$7500', value:'$7500'},{label: '$7600', value:'$7600'},{label: '$7700', value:'$7700'},{label: '$7800', value:'$7800'},{label: '$7900', value:'$7900'},{label: '$8000', value:'$8000'},{label: '$8100', value:'$8100'},{label: '$8200', value:'$8200'},{label: '$8300', value:'$8300'},{label: '$8400', value:'$8400'},{label: '$8500', value:'$8500'},{label: '$8600', value:'$8600'},{label: '$8700', value:'$8700'},{label: '$8800', value:'$8800'},{label: '$8900', value:'$8900'},{label: '$9000', value:'$9000'},{label: '$9100', value:'$9100'},{label: '$9200', value:'$9200'},{label: '$9300', value:'$9300'},{label: '$9400', value:'$9400'},{label: '$9500', value:'$9500'},{label: '$9600', value:'$9600'},{label: '$9700', value:'$9700'},{label: '$9800', value:'$9800'},{label: '$9900', value:'$9900'},{label: '$10000', value:'$10000'}
  ]
  valorTres = [
    {label: '', value:''}, {label: '$500', value:'$500'},{label: '$600', value:'$600'},{label: '$700', value:'$700'},{label: '$800', value:'$800'},{label: '$900', value:'$900'},{label: '$1000', value:'$1000'},{label: '$1100', value:'$1100'},{label: '$1200', value:'$1200'},{label: '$1300', value:'$1300'},{label: '$1400', value:'$1400'},{label: '$1500', value:'$1500'},{label: '$1600', value:'$1600'},{label: '$1700', value:'$1700'},{label: '$1800', value:'$1800'},{label: '$1900', value:'$1900'},{label: '$2000', value:'$2000'},{label: '$2100', value:'$2100'},{label: '$2200', value:'$2200'},{label: '$2300', value:'$2300'},{label: '$2400', value:'$2400'},{label: '$2500', value:'$2500'},{label: '$2600', value:'$2600'},{label: '$2700', value:'$2700'},{label: '$2800', value:'$2800'},{label: '$2900', value:'$2900'},{label: '$3000', value:'$3000'},{label: '$3100', value:'$3100'},{label: '$3200', value:'$3200'},{label: '$3300', value:'$3300'},{label: '$3400', value:'$3400'},{label: '$3500', value:'$3500'},{label: '$3600', value:'$3600'},{label: '$3700', value:'$3700'},{label: '$3800', value:'$3800'},{label: '$3900', value:'$3900'},{label: '$4000', value:'$4000'},{label: '$4100', value:'$4100'},{label: '$4200', value:'$4200'},{label: '$4300', value:'$4300'},{label: '$4400', value:'$4400'},{label: '$4500', value:'$4500'},{label: '$4600', value:'$4600'},{label: '$4700', value:'$4700'},{label: '$4800', value:'$4800'},{label: '$4900', value:'$4900'},{label: '$5000', value:'$5000'},{label: '$5100', value:'$5100'},{label: '$5200', value:'$5200'},{label: '$5300', value:'$5300'},{label: '$5400', value:'$5400'},{label: '$5500', value:'$5500'},{label: '$5600', value:'$5600'},{label: '$5700', value:'$5700'},{label: '$5800', value:'$5800'},{label: '$5900', value:'$5900'},{label: '$6000', value:'$6000'},{label: '$6100', value:'$6100'},{label: '$6200', value:'$6200'},{label: '$6300', value:'$6300'},{label: '$6400', value:'$6400'},{label: '$6500', value:'$6500'},{label: '$6600', value:'$6600'},{label: '$6700', value:'$6700'},{label: '$6800', value:'$6800'},{label: '$6900', value:'$6900'},{label: '$7000', value:'$7000'},{label: '$7100', value:'$7100'},{label: '$7200', value:'$7200'},{label: '$7300', value:'$7300'},{label: '$7400', value:'$7400'},{label: '$7500', value:'$7500'},{label: '$7600', value:'$7600'},{label: '$7700', value:'$7700'},{label: '$7800', value:'$7800'},{label: '$7900', value:'$7900'},{label: '$8000', value:'$8000'},{label: '$8100', value:'$8100'},{label: '$8200', value:'$8200'},{label: '$8300', value:'$8300'},{label: '$8400', value:'$8400'},{label: '$8500', value:'$8500'},{label: '$8600', value:'$8600'},{label: '$8700', value:'$8700'},{label: '$8800', value:'$8800'},{label: '$8900', value:'$8900'},{label: '$9000', value:'$9000'},{label: '$9100', value:'$9100'},{label: '$9200', value:'$9200'},{label: '$9300', value:'$9300'},{label: '$9400', value:'$9400'},{label: '$9500', value:'$9500'},{label: '$9600', value:'$9600'},{label: '$9700', value:'$9700'},{label: '$9800', value:'$9800'},{label: '$9900', value:'$9900'},{label: '$10000', value:'$10000'}
  ]
  valorCuatro = [
    {label: '', value:''}, {label: '$500', value:'$500'},{label: '$600', value:'$600'},{label: '$700', value:'$700'},{label: '$800', value:'$800'},{label: '$900', value:'$900'},{label: '$1000', value:'$1000'},{label: '$1100', value:'$1100'},{label: '$1200', value:'$1200'},{label: '$1300', value:'$1300'},{label: '$1400', value:'$1400'},{label: '$1500', value:'$1500'},{label: '$1600', value:'$1600'},{label: '$1700', value:'$1700'},{label: '$1800', value:'$1800'},{label: '$1900', value:'$1900'},{label: '$2000', value:'$2000'},{label: '$2100', value:'$2100'},{label: '$2200', value:'$2200'},{label: '$2300', value:'$2300'},{label: '$2400', value:'$2400'},{label: '$2500', value:'$2500'},{label: '$2600', value:'$2600'},{label: '$2700', value:'$2700'},{label: '$2800', value:'$2800'},{label: '$2900', value:'$2900'},{label: '$3000', value:'$3000'},{label: '$3100', value:'$3100'},{label: '$3200', value:'$3200'},{label: '$3300', value:'$3300'},{label: '$3400', value:'$3400'},{label: '$3500', value:'$3500'},{label: '$3600', value:'$3600'},{label: '$3700', value:'$3700'},{label: '$3800', value:'$3800'},{label: '$3900', value:'$3900'},{label: '$4000', value:'$4000'},{label: '$4100', value:'$4100'},{label: '$4200', value:'$4200'},{label: '$4300', value:'$4300'},{label: '$4400', value:'$4400'},{label: '$4500', value:'$4500'},{label: '$4600', value:'$4600'},{label: '$4700', value:'$4700'},{label: '$4800', value:'$4800'},{label: '$4900', value:'$4900'},{label: '$5000', value:'$5000'},{label: '$5100', value:'$5100'},{label: '$5200', value:'$5200'},{label: '$5300', value:'$5300'},{label: '$5400', value:'$5400'},{label: '$5500', value:'$5500'},{label: '$5600', value:'$5600'},{label: '$5700', value:'$5700'},{label: '$5800', value:'$5800'},{label: '$5900', value:'$5900'},{label: '$6000', value:'$6000'},{label: '$6100', value:'$6100'},{label: '$6200', value:'$6200'},{label: '$6300', value:'$6300'},{label: '$6400', value:'$6400'},{label: '$6500', value:'$6500'},{label: '$6600', value:'$6600'},{label: '$6700', value:'$6700'},{label: '$6800', value:'$6800'},{label: '$6900', value:'$6900'},{label: '$7000', value:'$7000'},{label: '$7100', value:'$7100'},{label: '$7200', value:'$7200'},{label: '$7300', value:'$7300'},{label: '$7400', value:'$7400'},{label: '$7500', value:'$7500'},{label: '$7600', value:'$7600'},{label: '$7700', value:'$7700'},{label: '$7800', value:'$7800'},{label: '$7900', value:'$7900'},{label: '$8000', value:'$8000'},{label: '$8100', value:'$8100'},{label: '$8200', value:'$8200'},{label: '$8300', value:'$8300'},{label: '$8400', value:'$8400'},{label: '$8500', value:'$8500'},{label: '$8600', value:'$8600'},{label: '$8700', value:'$8700'},{label: '$8800', value:'$8800'},{label: '$8900', value:'$8900'},{label: '$9000', value:'$9000'},{label: '$9100', value:'$9100'},{label: '$9200', value:'$9200'},{label: '$9300', value:'$9300'},{label: '$9400', value:'$9400'},{label: '$9500', value:'$9500'},{label: '$9600', value:'$9600'},{label: '$9700', value:'$9700'},{label: '$9800', value:'$9800'},{label: '$9900', value:'$9900'},{label: '$10000', value:'$10000'}
  ]

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

    valorUno: new FormControl(''),
    valorDos: new FormControl(''),
    valorTres: new FormControl(''),
    valorCuatro: new FormControl(''),

    valoresModalidadesUno: new FormControl(''),
    valoresModalidadesDos: new FormControl(''),
    valoresModalidadesTres: new FormControl(''),
    valoresModalidadesCuatro: new FormControl(''),

    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombreCliente: new FormControl(''),
  });

  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
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
    this.obtener_signos();
  }


  obtener_signos(){

    this.valoresModalidadesUno = [];
    this.valoresModalidadesDos = [];
    this.valoresModalidadesTres = [];
    this.valoresModalidadesCuatro = [];
    this.valoresModalidadesUno.push({label: '', value:''},{label: 'Todos', value:'all'})
    this.valoresModalidadesDos.push({label: '', value:''},{label: 'Todos', value:'all'})
    this.valoresModalidadesTres.push({label: '', value:''},{label: 'Todos', value:'all'})
    this.valoresModalidadesCuatro.push({label: '', value:''},{label: 'Todos', value:'all'})


    this.productosService.consultarSignos().subscribe(
      signosData => {
        const rs: any = signosData;
        rs.forEach(element => {
          if(element.nombre != 'Todos') {
            this.valoresModalidadesUno.push({label: element.nombre, value:element.idSigno});
            this.valoresModalidadesDos.push({label: element.nombre, value:element.idSigno});
            this.valoresModalidadesTres.push({label: element.nombre, value:element.idSigno});
            this.valoresModalidadesCuatro.push({label: element.nombre, value:element.idSigno});
          }
        });
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
    this.productosService.consultarLoterias(this.dayBet, 7).subscribe(
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
          }
          this.emitirModalidades();
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
  }


  generarAletorios(fila){
    let aletorio = 0;
    aletorio = Math.round(Math.random() * (1000 - 9999) + 9999);
    this.printFilaAletorio(aletorio, fila);
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
      default:
        break;
    }
    this.emitirNumeros();
  }


  transformAmount(event) {
    switch (event) {
      case 1:
        this.transformAmountLo('valorUno');
        break;
      case 2:
        this.transformAmountLo('valorDos');
        break;
      case 3:
        this.transformAmountLo('valorTres');
        break;
      case 4:
        this.transformAmountLo('valorCuatro');
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
      {numeroFilaCuatro: this.chanceForm.get('numeroFilaCuatro').value}
    ]
    this.agregarNumeros.emit(numerosValores);
  }


  emitirValores() {
    let valores:any = [
      {valorUno: this.chanceForm.get('valorUno').value},
      {valorDos: this.chanceForm.get('valorDos').value},
      {valorTres: this.chanceForm.get('valorTres').value},
      {valorCuatro: this.chanceForm.get('valorCuatro').value}
    ]
    this.agregarValores.emit(valores);
  }



  emitirModalidades() {
    let modalidadesValores:any = [
      {valoresModalidadesUno: this.chanceForm.get('valoresModalidadesUno').value},
      {valoresModalidadesDos: this.chanceForm.get('valoresModalidadesDos').value},
      {valoresModalidadesTres: this.chanceForm.get('valoresModalidadesTres').value},
      {valoresModalidadesCuatro: this.chanceForm.get('valoresModalidadesCuatro').value}
    ]
    this.agregarModalidades.emit(modalidadesValores);
  }



  borrarTodo(event) {

    this.chanceForm.controls.numeroFilaUno.setValue('');
    this.chanceForm.controls.numeroFilaDos.setValue('');
    this.chanceForm.controls.numeroFilaTres.setValue('');
    this.chanceForm.controls.numeroFilaCuatro.setValue('');

    this.chanceForm.controls.valorUno.setValue('');
    this.chanceForm.controls.valorDos.setValue('');
    this.chanceForm.controls.valorTres.setValue('');
    this.chanceForm.controls.valorCuatro.setValue('');

    this.chanceForm.controls.valoresModalidadesUno.setValue('');
    this.chanceForm.controls.valoresModalidadesDos.setValue('');
    this.chanceForm.controls.valoresModalidadesTres.setValue('');
    this.chanceForm.controls.valoresModalidadesCuatro.setValue('');

    // this.valoresModalidadesUno = [];
    // this.valoresModalidadesDos = [];
    // this.valoresModalidadesTres = [];
    // this.valoresModalidadesCuatro = [];

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
    const buscarApuestasEditar = JSON.parse(localStorage.getItem('superAstroApuesta'))
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

    this.setNumerosEvento(apuestaEditar[0].listaNumeros, apuestaEditar[0].listaModalidades, apuestaEditar[0].listaValores);

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




  setNumerosEvento(numeros, modalidades, valores){
    // this.obtener_signos()
    let nuevo_array_numeros_modalidades = []
    for (let index = 0; index < numeros.length; index++) {
      if(numeros[index].numeroFilaUno){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaUno, valor:valores[index].valorUno, modalidad:modalidades[0].valoresModalidadesUno})}
      if(numeros[index].numeroFilaDos){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaDos, valor:valores[index].valorDos, modalidad:modalidades[1].valoresModalidadesDos})}
      if(numeros[index].numeroFilaTres){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaTres, valor:valores[index].valorTres, modalidad:modalidades[2].valoresModalidadesTres})}
      if(numeros[index].numeroFilaCuatro){nuevo_array_numeros_modalidades.push({numero:numeros[index].numeroFilaCuatro, valor:valores[index].valorCuatro, modalidad:modalidades[3].valoresModalidadesCuatro})}
    }
    this.operacion_por_fila(nuevo_array_numeros_modalidades)
  }

  operacion_por_fila(nuevo_array_numeros_modalidades) {
    if(nuevo_array_numeros_modalidades[0]){
      this.chanceForm.get('numeroFilaUno').setValue(nuevo_array_numeros_modalidades[0].numero);
      this.chanceForm.get('valorUno').setValue(nuevo_array_numeros_modalidades[0].valor);
      this.chanceForm.get('valoresModalidadesUno').setValue(nuevo_array_numeros_modalidades[0].modalidad);
      this.emitirNumeros();
      this.emitirValores();
      this.emitirModalidades();
    }

    if(nuevo_array_numeros_modalidades[1]){
      this.chanceForm.get('numeroFilaDos').setValue(nuevo_array_numeros_modalidades[1].numero);
      this.chanceForm.get('valorDos').setValue(nuevo_array_numeros_modalidades[1].valor);
      console.log(nuevo_array_numeros_modalidades[1].modalidad)
      this.chanceForm.get('valoresModalidadesDos').setValue(nuevo_array_numeros_modalidades[1].modalidad);
      this.emitirNumeros();
      this.emitirValores();
      this.emitirModalidades();
    }

    if(nuevo_array_numeros_modalidades[2]){
      this.chanceForm.get('numeroFilaTres').setValue(nuevo_array_numeros_modalidades[2].numero);
      this.chanceForm.get('valorTres').setValue(nuevo_array_numeros_modalidades[2].valor);
      this.chanceForm.get('valoresModalidadesTres').setValue(nuevo_array_numeros_modalidades[2].modalidad);
      this.emitirNumeros();
      this.emitirValores();
      this.emitirModalidades();
    }

    if(nuevo_array_numeros_modalidades[3]){
      this.chanceForm.get('numeroFilaCuatro').setValue(nuevo_array_numeros_modalidades[3].numero);
      this.chanceForm.get('valorCuatro').setValue(nuevo_array_numeros_modalidades[3].valor);
      this.chanceForm.get('valoresModalidadesCuatro').setValue(nuevo_array_numeros_modalidades[3].modalidad);
      this.emitirNumeros();
      this.emitirValores();
      this.emitirModalidades();
    }
    
  }




  





}