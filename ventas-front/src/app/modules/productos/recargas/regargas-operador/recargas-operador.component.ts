import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductosService } from '../../productos.service';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { MessageService, SelectItem } from 'primeng/api';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { CrearClienteComponent } from '../../chance/crear-cliente/crear-cliente.component';
import { CurrencyPipe } from '@angular/common';
import { TiposDocumentosConstant } from 'src/app/constants/tipos-documentos.constant';

@Component({
  selector: 'app-recargas-operador',
  templateUrl: './recargas-operador.component.html',
  styleUrls: ['./recargas-operador.component.css'],
  providers: [ProductosService]
})
export class RecargasOperadorComponent extends CommonComponent implements OnInit, OnDestroy {

  @Output() addBet: EventEmitter<any> = new EventEmitter();
  @Output() addLotteries: EventEmitter<any> = new EventEmitter();

  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;
  urlOperador: string;
  apuestaCurrency: string;
  idCustomer = '';
  displayModalCreate = false;
  btnEdit = false;
  btnAdd = true;
  idEdit: any;
  selectTodas: boolean;
  selectUnmarkAllBol = false;
  loterias = [];
  lotteriesSelected = [];
  zignos = [];
  dayBet: Date;
  viewLotteries = false;
  mostrarOperadores: boolean;
  udpCurrency = 'currency: "CAD":"symbol-narrow":".2-2"';
  days = [
    { text: 'L', name: 'lun', date: null },
    { text: 'M', name: 'mar', date: null },
    { text: 'M', name: 'mie', date: null },
    { text: 'J', name: 'jue', date: null },
    { text: 'V', name: 'vie', date: null },
    { text: 'S', name: 'sab', date: null },
    { text: 'D', name: 'dom', date: null }
  ];


  enabledCustomer = false;
  enabledCombined = true;
  enabledThree = true;
  enabledTwo = true;
  enabledOne = true;
  /** Es la cantidad de nro de card que se visualiza en el carousel */
  public carouselNroVisible = 4;
  paquetes: any[];
  paqueteSeleccionado: any;
  fechaActual: Date;
  numeroSerie: string;
  seleccionado: number;
  signoMostrar: string;
  rutaServidor: string;
  chanceForm = new FormGroup({
    fecha: new FormControl(''),
    numero: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombreCliente: new FormControl(''),
    // numeroA: new FormControl({value:'',disabled: this.seleccionado==null?true:false}),
    numeroA: new FormControl(''),
    valorRecarga: new FormControl(''),
    numeroRecarga: new FormControl(''),
    valorApostado: new FormControl(),
    radioUno: new FormControl(),
    radioDos: new FormControl(),
    numeroRecargaRepetido: new FormControl(''),
  });
  currencyRecarga: string;
  valoresModalidades: any;
  tituloOperador: string;
  idOperador:number;
  operadores: any[];
  esRecarga: boolean;
  habilitarBotones: boolean;
  /** lista de items de TIPOS DE DOCUMENTOS */
  public itemsTiposDocumentos: SelectItem[];
  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private shellState: ShellState,
    private currencyPipe: CurrencyPipe
  ) {
    super();
    this.esRecarga = null;
    this.urlOperador = "assets/img/operadores/default.jpg";
  }

  ngOnInit(): void {
    this.habilitarBotones = false;
    this.tituloOperador = "Seleccione";
    this.idOperador=null;
    this.signoMostrar = null;
    this.selectTodas = false;
    this.mostrarOperadores = false;
    this.fechaActual = new Date();
    this.chanceForm.controls.tipoDocumento.setValue(TiposDocumentosConstant.CEDULA_CIUDADANIA);
    this.itemsTiposDocumentos = [
      { value: TiposDocumentosConstant.CEDULA_CIUDADANIA, label: TiposDocumentosConstant.CEDULA_CIUDADANIA },
      { value: TiposDocumentosConstant.TARJETA_IDENTIDAD, label: TiposDocumentosConstant.TARJETA_IDENTIDAD }
    ];
    this.operadores = [];
    this.productosService.consultarOperadores().subscribe(
      operadoresData => {
        const rs: any = operadoresData;
        rs.forEach(element => {
          this.operadores.push({
            nombre: element.nombre, value: element.idOperador,
            url: "assets/img/operadores/" + element.nombre.toLowerCase() + ".jpg"
          });

        });
        //  this.urlOperador="assets/img/operadores/default.jpg";
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );

    this.paquetes = [];
    this.productosService.consultarPaquetes().subscribe(
      paquetesData => {
        this.paquetes = paquetesData;
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }

  clickRecarga(esRecarga) {
    this.esRecarga = esRecarga;
  }

  validarCampos() {
    this.habilitarBotones = false;
    if (this.esRecarga) {
      if (this.chanceForm.get('numeroRecarga').value != null &&
        this.chanceForm.get('numeroRecarga').value != undefined &&
        this.chanceForm.get('numeroRecarga').value != '' &&
        this.tituloOperador != null && this.tituloOperador != "Seleccione" &&
        this.chanceForm.get('valorRecarga').value != null &&
        this.chanceForm.get('valorRecarga').value != undefined &&
        this.chanceForm.get('numeroRecargaRepetido').value != null &&
        this.chanceForm.get('numeroRecargaRepetido').value != undefined &&
        this.chanceForm.get('numeroRecargaRepetido').value != '' &&
        this.chanceForm.get('valorRecarga').value != '') {
        this.habilitarBotones = true;
      }
    }
    else {
      if (this.chanceForm.get('numeroRecarga').value != null &&
        this.chanceForm.get('numeroRecarga').value != undefined &&
        this.chanceForm.get('numeroRecarga').value != '' &&
        this.chanceForm.get('numeroRecargaRepetido').value != null &&
        this.chanceForm.get('numeroRecargaRepetido').value != undefined &&
        this.chanceForm.get('numeroRecargaRepetido').value != '' &&
        this.tituloOperador != null && this.tituloOperador != "Seleccione" &&
        this.paqueteSeleccionado != null && this.paqueteSeleccionado.idPaquete != null) {
        this.habilitarBotones = true;
      }
    }
    if(this.chanceForm.get('numeroRecarga').value != null &&
    this.chanceForm.get('numeroRecarga').value != undefined &&
    this.chanceForm.get('numeroRecarga').value != '' &&
    this.chanceForm.get('numeroRecargaRepetido').value != null &&
    this.chanceForm.get('numeroRecargaRepetido').value != undefined &&
    this.chanceForm.get('numeroRecargaRepetido').value != '' &&
    this.chanceForm.get('numeroRecarga').value != this.chanceForm.get('numeroRecargaRepetido').value){
      this.habilitarBotones = false;
      this.messageService.add(MsjUtil.getToastErrorMedium('El número a recargar no coincide'));
    }
  }

  seleccionarPaquete(paquete) {
    this.paqueteSeleccionado = paquete;
    this.chanceForm.get('valorRecarga').setValue(paquete.valor);
    this.validarCampos();
  }

  setDaysServicio(): void {
    this.productosService.consultarSemanaServidor().subscribe(
      dias => {
        const rs: any = dias;
        rs.forEach(element => {

          const date = new Date(element.toString())
          if (date.getDay() == 1) {
            this.days[0].date = element;
          }
          else if (date.getDay() == 2) {
            this.days[1].date = element;
          }
          else if (date.getDay() == 3) {
            this.days[2].date = element;
          }
          else if (date.getDay() == 4) {
            this.days[3].date = element;
          }
          else if (date.getDay() == 5) {
            this.days[4].date = element;
          }
          else if (date.getDay() == 6) {
            this.days[5].date = element;
          }
          else if (date.getDay() == 0) {
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
   * @description Por medio de este metodo marcamos con color verde el dia de la apuesta y setiamos la fecha
   * @param day
   */
  get_date_bet(day) {
    this.dayBet = day.date;
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
    // llamamos el metodo que se encarga de consultar las loterias
    this.getLotteries();
  }

  todas() {
    this.selectTodas = true;
    this.loterias.forEach(l => {
      l.checked = true;
    });
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
            url: this.rutaServidor + element.nombreImagen
          });

        });
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }

  abrirOperadores() {
    this.mostrarOperadores = true;
  }

  seleccionarSigno(signo) {
    this.signoMostrar = this.signoMostrar + "," + signo.label;
  }


  aceptarOperador() {
    this.mostrarOperadores = false;
    //this.chanceForm.get('zignosSeleccionados').value=
  }
  cancelarOperador() {
    this.mostrarOperadores = false;
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
            this.chanceForm.controls.nombreCliente.setValue(name);
            this.enabledCustomer = true;
          } else {
            this.crearClienteChild.clienteForm.get('tipoDocumento').setValue(this.chanceForm.get('tipoDocumento').value);
            this.crearClienteChild.clienteForm.get('numeroDocumento').setValue(this.chanceForm.get('numeroDocumento').value);
            this.displayModalCreate = true;
          }
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

  }


  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 3 cifras
   */
  getNumberThree(): void {
    this.chanceForm.controls.numero.setValue(Math.round(Math.random() * (100 - 999) + 999));
    this.chanceNumber(this.chanceForm.get('numero').value);
  }

  limpiarA() {
    this.chanceForm.controls.numeroA.setValue(null);
  }
  generrarA() {
    this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));

  }
  limpiarB() {
    this.chanceForm.controls.numeroB.setValue(null);
  }
  generrarB() {
    if (this.seleccionado == 3) {
      this.chanceForm.controls.numeroB.setValue(Math.round(Math.random() * (100 - 999) + 999));
    }
    else if (this.seleccionado == 4) {
      this.chanceForm.controls.numeroB.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    }
    else {
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  limpiarC() {
    this.chanceForm.controls.numeroC.setValue(null);
  }
  generrarC() {
    if (this.seleccionado == 3) {
      this.chanceForm.controls.numeroC.setValue(Math.round(Math.random() * (100 - 999) + 999));
    }
    else if (this.seleccionado == 4) {
      this.chanceForm.controls.numeroC.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    }
    else {
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  limpiarD() {
    this.chanceForm.controls.numeroD.setValue(null);
  }
  generrarD() {
    if (this.seleccionado == 3) {
      this.chanceForm.controls.numeroD.setValue(Math.round(Math.random() * (100 - 999) + 999));
    }
    else if (this.seleccionado == 4) {
      this.chanceForm.controls.numeroD.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    }
    else {
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  limpiarE() {
    this.chanceForm.controls.numeroE.setValue(null);
  }
  generrarE() {
    if (this.seleccionado == 3) {
      this.chanceForm.controls.numeroE.setValue(Math.round(Math.random() * (100 - 999) + 999));
    }
    else if (this.seleccionado == 4) {
      this.chanceForm.controls.numeroE.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    }
    else {
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  generar(numero) {
    this.seleccionado = numero;
    if (numero == 3) {
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (100 - 999) + 999));
    }
    else if (numero == 4) {
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    }

    this.consultarValoresModalidad(numero);
  }


  consultarValoresModalidad(numero) {
    this.valoresModalidades = [];
    //SUPER CHANCE
    this.productosService.consultarValoresModalidad("SUPER CHANCE", numero).subscribe(
      valoresData => {
        this.valoresModalidades = valoresData;
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }
  limpiar() {
    this.chanceForm.controls.numeroA.setValue(null);
  }
  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 4 cifras
   */
  getNumberFour() {
    this.chanceForm.controls.numero.setValue(Math.round(Math.random() * (1000 - 9999) + 9999));
    console.log(this.chanceForm.get('numero').value);
    this.chanceNumber(this.chanceForm.get('numero').value);
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de
   * habilitar y deshabilitar los campos de
   * apuesta de cifras y combinado segun la
   * cantidad de numeros de numero principal
   * de la apuesta
   */
  chanceNumber(event) {
    let value = null;
    if (event && event.value) {
      value = event.value;
    }
    else {
      value = event;
    }

    this.enabledCombined = true;
    this.enabledThree = true;
    this.enabledTwo = true;
    this.enabledOne = true;
    if (String(value).length === 4) {
      this.enabledCombined = true;
      this.enabledThree = true;
      this.enabledTwo = true;
      this.enabledOne = true;
    } else if (String(value).length === 3) {
      this.enabledCombined = true;
      this.enabledThree = false;
      this.chanceForm.get('tresCifras').setValue('');
      this.enabledTwo = true;
      this.enabledOne = true;
    } else if (String(value).length === 2) {
      this.enabledCombined = false;
      this.enabledThree = false;
      this.enabledTwo = false;
      this.chanceForm.get('combinado').setValue('');
      this.chanceForm.get('tresCifras').setValue('');
      this.chanceForm.get('dosCifras').setValue('');
    }
    else if (String(value).length === 1) {
      this.enabledCombined = false;
      this.enabledThree = false;
      this.enabledTwo = false;
      this.enabledOne = false;
      this.chanceForm.get('combinado').setValue('');
      this.chanceForm.get('tresCifras').setValue('');
      this.chanceForm.get('dosCifras').setValue('');
      this.chanceForm.get('unaCifra').setValue('');
    }
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de aplicar reglas de negocio
   * de apuesta por el momento no se va a utilizar dado que indicaron
   * que las apuesta debe quedar abierta
   */
  // validInputBet(): void {

  //   this.enabledThree = false;
  //   this.enabledTwo = false;
  //   this.enabledOne = false;

  //   this.chanceForm.get('tresCifras').setValue('');
  //   this.chanceForm.get('dosCifras').setValue('');
  //   this.chanceForm.get('unaCifra').setValue('');

  //   if (String(this.chanceForm.get('numero').value).length === 4) {
  //     if (this.chanceForm.get('combinado').value && !this.chanceForm.get('valorDirecto').value) {
  //       this.enabledThree = false;
  //       this.enabledTwo = false;
  //       this.enabledOne = false;
  //     } else {
  //       this.enabledThree = true;
  //       this.enabledTwo = true;
  //       this.enabledOne = true;
  //     }
  //   } else if (String(this.chanceForm.get('numero').value).length === 3) {
  //     if (this.chanceForm.get('valorDirecto').value && this.chanceForm.get('combinado').value) {
  //       this.enabledThree = false;
  //       this.enabledTwo = true;
  //       this.enabledOne = true;
  //     } else if (this.chanceForm.get('combinado').value && !this.chanceForm.get('valorDirecto').value) {
  //       this.enabledThree = false;
  //       this.enabledTwo = false;
  //       this.enabledOne = false;
  //     } else if (this.chanceForm.get('valorDirecto').value && !this.chanceForm.get('combinado').value) {
  //       this.enabledThree = false;
  //       this.enabledTwo = true;
  //       this.enabledOne = true;
  //     }
  //   }

  // }


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



  validarLoterias() {
    let valida = false;
    this.messageService.clear();
    if (new Date(this.dayBet).getDate() < new Date().getDate()) {
      this.messageService.add(MsjUtil.getToastErrorMedium('No se puede realizar una apuesta con una fecha anterior'));
      return;
    }
    //seleccion
    if (this.loterias == null || this.loterias == undefined || this.loterias.length == 0) {
      this.messageService.add(MsjUtil.getToastErrorMedium('Por favor diligenciar todos los campos'));
      return;
    }
    //valida nulos
    if (this.chanceForm.get('numeroA').value == null || this.chanceForm.get('numeroA').value == '') {
      valida = true;
    }

    if (valida) {
      this.messageService.add(MsjUtil.getToastErrorMedium('Por favor diligenciar todos los campos'));
      return;
    }
    valida = false;
    if (this.chanceForm.get('valorApostado').value == null || this.chanceForm.get('valorApostado').value == undefined
      || this.chanceForm.get('valorApostado').value == '') {
      valida = true;
    }
    if (valida) {
      this.messageService.add(MsjUtil.getToastErrorMedium('Por favor diligenciar todos los campos'));
      return;
    }
    //validar longitudes
    valida = false;
    if (this.chanceForm.get('numeroA').value.toString().length != 4) {
      valida = true;
    }

    if (valida) {
      this.messageService.add(MsjUtil.getToastErrorMedium('El número jugado debe ser de 4 digitos'));
      return;
    }
    //validar zignos
    valida = false;
    let cont = 0;
    this.zignos.forEach(element => {
      if (element.checked) {
        cont++;
      }
    });

    if (cont == 0) {
      this.messageService.add(MsjUtil.getMsjError('Por favor diligenciar todos los campos'));
      return;
    }

    if (this.btnAdd) {
      this.addBetSend();
    }
    else if (this.btnEdit) {
      this.editBetSend();
    }
  }
  consultarSignosSeleccionados() {
    let arreglo = [];
    this.zignos.forEach(element => {
      if (element.checked) {
        arreglo.push(element.value);
      }
    });
    return arreglo;
  }
  /**
   * @author Luis Hernandez
   * @description funcion que se encarga de
   * emitir la apuesta al componente bolsa
   */
  addBetSend(): void {
    this.addBet.emit({
      action: 1,
      // lotteries: this.lotteriesSelected,
      _id: 'bet_' + Math.floor(Math.random() * 999999),
      idCustomer: this.idCustomer,
      numeroRecarga: this.chanceForm.get('numeroRecarga').value,
      valor: this.chanceForm.get('valorRecarga').value,
      dataPlayed: this.dayBet,
      operador: this.tituloOperador,
      paquete:this.esRecarga ? null : this.paqueteSeleccionado.nombre,
      idPaquete:this.esRecarga ? null : this.paqueteSeleccionado.idPaquete,
      idOperador:this.idOperador
    });
    this.cleanInputs();
    if (this.idCustomer) {
      this.enabledCustomer = true;
    }
    else {
      this.enabledCustomer = false;
    }

    this.selectUnmarkAllBol = false;

  }

  nombresLoterias() {
    let nombres = "";
    this.loterias.forEach(l => {
      if (l.checked) {
        nombres = nombres + ", " + l.nombreCorto;
      }
    });
    return nombres.substr(1, nombres.length);
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga
   * de enviar a la bolsa el producto modificado
   */
  editBetSend() {
    this.addBet.emit({
      action: 0,
      // lotteries: this.lotteriesSelected,
      _id: this.idEdit,
      documentCustomer: this.chanceForm.get('numeroDocumento').value,
      nameCustomer: this.chanceForm.get('nombreCliente').value,
      numeroRecarga: this.chanceForm.get('numeroRecarga').value,
      valor: this.chanceForm.get('valorRecarga').value,
      dataPlayed: this.dayBet,
      operador: this.tituloOperador,
      paquete:this.esRecarga ? null : this.paqueteSeleccionado.nombre,
      idPaquete:this.esRecarga ? null : this.paqueteSeleccionado.idPaquete,
      idOperador:this.idOperador
    });
    this.cleanInputs();
    if (this.chanceForm.get('nombreCliente').value) {
      this.enabledCustomer = true;
    }
    else {
      this.enabledCustomer = false;
    }
    this.selectUnmarkAllBol = false;

  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se valida cuales fueron
   * las loterias seleccionadas y las manda para el carrito
   */
  get_lotteriesSelected() {
    this.lotteriesSelected = [];
    this.loterias.forEach(element => {
      if (element.checked) {
        this.lotteriesSelected.push({
          idLoteria: element.idLoteria,
          codigo: element.codigo,
          nombre: element.nombre,
          nombreCorto: element.nombreCorto,
          telefono: element.telefono,
          idEstado: element.idEstado,
          idEmpresa: element.idEmpresa,
          idSorteo: element.idSorteo,
          idSorteoDetalle: element.idSorteoDetalle
        });
      }
    });
    return this.lotteriesSelected;
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description metodo que se encarga
   * de recibir los datos a editar y hace set
   */
  editBetSendEmit(event): void {
    this.idEdit = event._id;
    this.dayBet = event.dataPlayed;
    //  this.chanceForm.get('numeroDocumento').setValue(event.documentCustomer);
    this.chanceForm.get('numeroRecarga').setValue(event.numeroRecarga);
    this.chanceForm.get('numeroRecargaRepetido').setValue(event.numeroRecarga);
    this.chanceForm.get('valorRecarga').setValue(event.valor);
    this.transformAmount();
    if (event.nameCustomer) {
      this.chanceForm.get('nombreCliente').setValue(event.nameCustomer);
      this.enabledCustomer = true;
    }
    this.tituloOperador=event.operador;
    this.urlOperador="assets/img/operadores/" + this.tituloOperador.toLowerCase() + ".jpg"
    this.idOperador=event.idOperador;
    this.esRecarga=event.paquete == null ? true: false;
    if(!this.esRecarga){
      this.paquetes.forEach(element => {
          if(element.nombre==event.paquete){
            this.paqueteSeleccionado=element;
          }
      });
    }
    this.btnAdd = false;
    this.btnEdit = true;
  }

  /**
   * @author Luis Hernandez
   * @param event
   * @description metodo que se da cuenta cuanto la transaccion fue ok
   */
  createBetSendEmit(event): void {
    if (event) {
      // limpiamos campos de información del cliente
      this.chanceForm.get('tipoDocumento').setValue('');
      this.chanceForm.get('numeroDocumento').setValue('');
      this.chanceForm.get('nombreCliente').setValue('');
      this.enabledCustomer = false;

      // quitamos fecha y loterias seleccionadas
      this.loterias = [];
      this.days.forEach(element => {
        const chip = document.getElementById(element.name);
        chip.style.backgroundColor = '#ffffff';
        chip.style.color = '#0083fe';
      });
      delete this.dayBet;
      // limpiamos los demas campos
      this.cleanInputs();
    }
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga
   * de validar que los campos obligatorios
   * esten diligenciados
   */
  valid() {
    //valido q selecionaron loterias
    //selimpia panel loterias
    let valid = true;
    this.loterias.forEach(element => {
      if (element.checked) {
        valid = false;
      }
    });
    if (valid) {
      return false;
    }
    valid = false;
    if (String(this.chanceForm.get('numero').value).length === 4
      && (this.chanceForm.get('valorDirecto').value ||
        this.chanceForm.get('combinado').value)) {
      valid = true;
    } else if (String(this.chanceForm.get('numero').value).length === 3
      && (this.chanceForm.get('valorDirecto').value ||
        this.chanceForm.get('combinado').value)) {
      valid = true;
    }
    else if (String(this.chanceForm.get('numero').value).length === 2
      && this.chanceForm.get('valorDirecto').value) {
      valid = true;
    }
    else if (String(this.chanceForm.get('numero').value).length === 1
      && this.chanceForm.get('valorDirecto').value) {
      valid = true;
    }
    if (!valid) {
      return false;
    }
    if (this.chanceForm.get('numero').valid && this.dayBet) {
      if (this.chanceForm.get('valorDirecto').value ||
        this.chanceForm.get('combinado').value ||
        this.chanceForm.get('tresCifras').value ||
        this.chanceForm.get('dosCifras').value ||
        this.chanceForm.get('unaCifra').value) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de limpiar los campos
   */
  cleanInputs(): void {
    this.esRecarga=null;
    this.apuestaCurrency = null;
    this.signoMostrar = null;
    this.mostrarOperadores = false;
    this.selectTodas = false;
    this.chanceForm.get('valorRecarga').setValue('');
    this.valoresModalidades = [];
    this.chanceForm.get('numeroRecarga').setValue('');
    this.chanceForm.get('numeroRecargaRepetido').setValue('');
    this.tituloOperador=null;
    this.idOperador=null;
    this.seleccionado = null;
    this.enabledCustomer = false;
    this.enabledCombined = true;
    this.enabledThree = true;
    this.enabledTwo = true;
    this.enabledOne = true;
    this.btnAdd = true;
    this.btnEdit = false;
    this.paqueteSeleccionado=null;
    this.urlOperador="assets/img/operadores/default.jpg";
    this.habilitarBotones=false;
  }

  transformAmount() {
    let cadena = this.chanceForm.get('valorRecarga').value;
    if (cadena && cadena.includes("$")) {
      cadena = cadena.substr(1, cadena.length);
      cadena = cadena.substr(0, cadena.indexOf(',')) + cadena.slice(cadena.indexOf(',') + 1);
      this.chanceForm.controls.valorRecarga.setValue(cadena);
      this.currencyRecarga = this.currencyPipe.transform(this.chanceForm.get('valorRecarga').value, '$', 'symbol', '.0-0');
    }
    else {
      this.currencyRecarga = this.currencyPipe.transform(this.chanceForm.get('valorRecarga').value, '$', 'symbol', '.0-0');
    }
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
    this.chanceForm.controls.nombreCliente.setValue(name);
    this.enabledCustomer = true;
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve el
   * dia sobre el cual se esta operando
   */
  getDayWeek() {
    const hoy = new Date();
    const days = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    const dt = new Date(hoy.getMonth() + 1 + ' ' + hoy.getDate() + ', ' + hoy.getFullYear() + ' 12:00:00');
    return days[dt.getUTCDay()];
  }


  /**
   * @author Luis Hernandez
   * @description setiamos la fecha de los
   * posibles dias de apuesta partiendo del
   * dia actual
   * @param dayWeek
   */
  setDays(dayWeek): void {
    const hoy = new Date();
    const dt = new Date();
    switch (dayWeek) {
      case 'lun':
        this.days[0].date = dt;
        this.days[1].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        break;
      case 'mar':
        this.days[0].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[1].date = dt;
        this.days[2].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        break;
      case 'mie':
        this.days[0].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[2].date = dt;
        this.days[3].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        break;
      case 'jue':
        this.days[0].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[3].date = dt;
        this.days[4].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        break;
      case 'vie':
        this.days[0].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[4].date = dt;
        this.days[5].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[6].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        break;
      case 'sab':
        this.days[0].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[5].date = dt;
        this.days[6].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        break;
      case 'dom':
        this.days[0].date = new Date(dt.getTime() + (1 * 24 * 60 * 60 * 1000));
        this.days[1].date = new Date(dt.getTime() + (2 * 24 * 60 * 60 * 1000));
        this.days[2].date = new Date(dt.getTime() + (3 * 24 * 60 * 60 * 1000));
        this.days[3].date = new Date(dt.getTime() + (4 * 24 * 60 * 60 * 1000));
        this.days[4].date = new Date(dt.getTime() + (5 * 24 * 60 * 60 * 1000));
        this.days[5].date = new Date(dt.getTime() + (6 * 24 * 60 * 60 * 1000));
        this.days[6].date = dt;
        break;
      default:
        break;
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

  getSigno(idSigno) {
    return this.zignos.map((e) => {
      return e.value;
    }).indexOf(idSigno);
  }


  /**
   * @author Luis Hernandez
   * @description Funcion que permite valida que el usuario
   * solo ingrese numeros en los campos donde se espera solo numeros
   * @param e
   */
  keyPressNumber(e) {

    const key = window.Event ? e.which : e.keyCode;
    e.key.replace(/\D|\-/, '');
    return (key >= 48 && key <= 57);


  }


  /**
   * @author Luis Hernandez
   * @description Funcion que permite valida que el usuario
   * solo ingrese numeros en los campos donde se espera solo numeros
   * @param e
   */
  keyPressNumberChance(e) {
    const key = window.Event ? e.which : e.keyCode;
    e.key.replace(/\D|\-/, '');
    return (key >= 48 && key <= 57);
  }


  clickOperador(o) {
    this.mostrarOperadores = false;
    this.tituloOperador = o.nombre;
   this.idOperador=o.value;
    this.urlOperador = o.url;
    this.validarCampos();
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
      this.selectUnmarkAllBol = true;
    } else {
      this.selectUnmarkAllBol = false;
    }

    this.addLotteries.emit(this.get_lotteriesSelected());
  }

  pagarRecarga(){
 
      //se valida longitud del celular
      if(this.chanceForm.get('numeroRecarga').value.length < 10){
        this.messageService.add(MsjUtil.getToastErrorMedium('El número a recargar no es valido'));
        return;
      }
      if(parseInt(this.chanceForm.get('valorRecarga').value) < 1000){
        this.messageService.add(MsjUtil.getToastErrorMedium('La recarga es menor al valor minimo permitido'));
        return;
      }
      if(this.esRecarga){
      const numMinimo=1000;
      const valor=this.chanceForm.get('valorRecarga').value;
      const res=valor%numMinimo;
     if(res !=0){
        this.messageService.add(MsjUtil.getToastErrorMedium('La recarga debe ser múltiplo de $1.000'));
        return;
      }
    }
      if (this.btnAdd) {
        this.addBetSend();
      }
      else if (this.btnEdit) {
        this.editBetSend();
      }
  }

  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de
   * seleccionar todas las loterias y marcar
   * todos los checkbox
   */
  selectUnmarkAll(): void {
    if (!this.selectUnmarkAllBol) {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.loterias.length; index++) {
        this.loterias[index].checked = true;
      }
      this.selectUnmarkAllBol = true;
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.loterias.length; index++) {
        this.loterias[index].checked = false;
      }
      this.selectUnmarkAllBol = false;
    }

    this.addLotteries.emit(this.get_lotteriesSelected());
  }


  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

}
