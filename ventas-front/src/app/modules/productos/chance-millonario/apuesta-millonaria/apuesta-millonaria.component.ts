import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductosService } from '../../productos.service';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { MessageService } from 'primeng/api';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { CrearClienteComponent } from '../../chance/crear-cliente/crear-cliente.component';
import { FechaUtil } from 'src/app/utilities/fecha-util';
@Component({
  selector: 'app-apuesta-millonaria',
  templateUrl: './apuesta-millonaria.component.html',
  styleUrls: ['./apuesta-millonaria.component.css'],
  providers: [ProductosService]
})
export class ApuestaMillonariaComponent extends CommonComponent implements OnInit, OnDestroy  {

  @Output() addBet: EventEmitter<any> = new EventEmitter();
  @Output() addLotteries: EventEmitter<any> = new EventEmitter();

  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;

  idCustomer = '';
  displayModalCreate = false;
  btnEdit = false;
  btnAdd  = true;
  idEdit: any;

  selectUnmarkAllBol = false;
  loterias = [];
  lotteriesSelected = [];

  dayBet: Date;
  viewLotteries = false;

  /** Es el correo del cliente quien hace la compra */
  private correoCustomer: string;

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
  rutaServidor:string;
  fechaActual:Date;
  fechaMostrar:Date;
  numeroSerie:string;
  seleccionado:number;
  chanceForm = new FormGroup({
    fecha: new FormControl(''),
    numero: new FormControl('', [Validators.required, Validators.maxLength(4)]),
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombreCliente: new FormControl(''),
   // numeroA: new FormControl({value:'',disabled: this.seleccionado==null?true:false}),
   numeroA: new FormControl(''),
    numeroB: new FormControl(''),
    numeroC: new FormControl(''),
    numeroD: new FormControl(''),
    numeroE: new FormControl(''),
    valorApostado:new FormControl(),
    radioUno:new FormControl(),
    radioDos:new FormControl()
  });

  valoresModalidades:any;

  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private shellState: ShellState
  ) {
    super();
    // obtemos el esquema de fechas para que el usuario puede saleccionar el dia de la apuesta a realizar
    const dayWeek = this.getDayWeek();
  //  this.setDays(dayWeek);
  this.setDaysServicio();
  this.fechaMostrar=new Date();
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
  }

  ngOnInit(): void {
    this.fechaActual=new Date();
    this.productosService.consultarNumeroSerieApuesta("CHANCE MILLONARIO").subscribe(
      numeroSerie => {
        this.numeroSerie=numeroSerie.codigo;
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );


  }
  setDaysServicio():void{
    this.productosService.consultarSemanaServidor().subscribe(
      dias => {
        const rs: any = dias;
        this.fechaActual=FechaUtil.stringToDate(rs[7].toString());
        console.log("Semea seridor: "+dias);
        let contador=0;
        rs.forEach(element => {
          if(contador>=7){
            return;
          }
          contador++;
        const date=FechaUtil.stringToDate(element.toString());
        console.log("new Date 1: "+date);
          if(date.getDay() == 1){
            this.days[0].date=element;
          }
          else if(date.getDay() == 2){
            this.days[1].date=element;
          }
          else if(date.getDay() == 3){
            this.days[2].date=element;
          }
          else if(date.getDay() == 4){
            this.days[3].date=element;
          }
          else if(date.getDay() == 5){
            this.days[4].date=element;
          }
          else if(date.getDay() == 6){
            this.days[5].date=element;
          }
          else if(date.getDay() == 0){
            this.days[6].date=element;
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
    console.log("new Date 2: "+this.dayBet);


    let fechaA=this.fechaActual;
    console.log("new Date 3: "+fechaA);
    this.fechaActual=this.dayBet;
    console.log("new Date 4: "+this.fechaActual);
    let fechaB=this.fechaActual;
    console.log("new Date 5: "+fechaB);
    if(fechaB <fechaA){
      fechaB.setDate(fechaB.getDate() + 7);
      this.dayBet=fechaB;
    }
    console.log("fecha cuando acaba el if: "+this.dayBet);
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


  /**
   * @author Luis Hernandez
   * @description funcion que llama al servicio
   * de loterias y trae las loterias disponibles
   * según el día
   */
  getLotteries(): void {
    this.loterias=[];
      this.productosService.consultarLoterias(this.dayBet,5).subscribe(
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
              url:this.rutaServidor+element.nombreImagen
            });
          });
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
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
    this.chanceForm.controls.numero.setValue( Math.round(Math.random() * (100 - 999) + 999 ) );
    this.chanceNumber(this.chanceForm.get('numero').value);
  }

  limpiarA(){
    this.chanceForm.controls.numeroA.setValue(null);
  }
  generrarA(){
    if(this.seleccionado==3){
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
    }
    else if(this.seleccionado==4){
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
    }
    else{
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  limpiarB(){
    this.chanceForm.controls.numeroB.setValue(null);
  }
  generrarB(){
    if(this.seleccionado==3){
      this.chanceForm.controls.numeroB.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
    }
    else if(this.seleccionado==4){
      this.chanceForm.controls.numeroB.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
    }
    else{
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  limpiarC(){
    this.chanceForm.controls.numeroC.setValue(null);
  }
  generrarC(){
    if(this.seleccionado==3){
      this.chanceForm.controls.numeroC.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
    }
    else if(this.seleccionado==4){
      this.chanceForm.controls.numeroC.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
    }
    else{
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  limpiarD(){
    this.chanceForm.controls.numeroD.setValue(null);
  }
  generrarD(){
    if(this.seleccionado==3){
      this.chanceForm.controls.numeroD.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
    }
    else if(this.seleccionado==4){
      this.chanceForm.controls.numeroD.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
    }
    else{
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  limpiarE(){
    this.chanceForm.controls.numeroE.setValue(null);
  }
  generrarE(){
    if(this.seleccionado==3){
      this.chanceForm.controls.numeroE.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
    }
    else if(this.seleccionado==4){
      this.chanceForm.controls.numeroE.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
    }
    else{
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  generar(){
    if(this.seleccionado==3){
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
      this.chanceForm.controls.numeroB.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
      this.chanceForm.controls.numeroC.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
      this.chanceForm.controls.numeroD.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
      this.chanceForm.controls.numeroE.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
      }
    else if(this.seleccionado==4){
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
      this.chanceForm.controls.numeroB.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
      this.chanceForm.controls.numeroC.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
      this.chanceForm.controls.numeroD.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
      this.chanceForm.controls.numeroE.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
    }
    else{
      this.messageService.add(MsjUtil.getMsjError('Debe diligenciar una modalidad'));
    }
  }
  seleccion(i){
    this.seleccionado=i;
    this.limpiar();
    this.consultarValoresModalidad();
    
  }

  seleccionEditar(i){
    this.seleccionado=i;
    this.consultarValoresModalidad();
  }
  consultarValoresModalidad(){
    this.valoresModalidades=[];
      this.productosService.consultarValoresModalidad("CHANCE MILLONARIO",this.seleccionado).subscribe(
        valoresData => {
         this.valoresModalidades=valoresData;
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
  }
  limpiar(){
    this.chanceForm.controls.numeroA.setValue(null);
    this.chanceForm.controls.numeroB.setValue(null);
    this.chanceForm.controls.numeroC.setValue(null);
    this.chanceForm.controls.numeroD.setValue(null);
    this.chanceForm.controls.numeroE.setValue(null);
  }
  /**
   * @author Luis Hernandez
   * @description Metodo que devuelve un numero aleatorio de 4 cifras
   */
  getNumberFour() {
    this.chanceForm.controls.numero.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
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
    if(event && event.value){
      value=event.value;
    }
    else{
      value=event;
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


  validarLoterias(){
    this.messageService.clear();


    let valida=false;
    //seleccion
    if(this.loterias==null || this.loterias==undefined || this.loterias.length==0){
      this.messageService.add(MsjUtil.getToastErrorMedium('Por favor diligenciar todos los campos'));
      return;
    }
    //valida nulos
    if(this.chanceForm.get('numeroA').value == null || this.chanceForm.get('numeroA').value ==''){
      valida=true;
    }
    else if(this.chanceForm.get('numeroB').value == null || this.chanceForm.get('numeroB').value ==''){
      valida=true;
    }
    else if(this.chanceForm.get('numeroC').value == null || this.chanceForm.get('numeroC').value ==''){
      valida=true;
    }
    else if(this.chanceForm.get('numeroD').value == null || this.chanceForm.get('numeroD').value ==''){
      valida=true;
    }
    else if(this.chanceForm.get('numeroE').value == null || this.chanceForm.get('numeroE').value ==''){
      valida=true;
    }
    if(valida){
      this.messageService.add(MsjUtil.getToastErrorMedium('Por favor diligenciar todos los campos'));
      return;
    }
    valida=false;
   if( this.chanceForm.get('valorApostado').value==null ||  this.chanceForm.get('valorApostado').value==undefined
   ||  this.chanceForm.get('valorApostado').value==''){
    valida=true;
   }
    if(valida){
      this.messageService.add(MsjUtil.getToastErrorMedium('Por favor diligenciar todos los campos'));
      return;
    }
     //validar longitudes
     valida=false;
    if(this.seleccionado==3){
      if(this.chanceForm.get('numeroA').value.toString().length != 3){
        valida=true;
      }
      else if(this.chanceForm.get('numeroB').value.toString().length != 3){
        valida=true;
      }
      else if(this.chanceForm.get('numeroC').value.toString().length != 3){
        valida=true;
      }
      else if(this.chanceForm.get('numeroD').value.toString().length != 3){
        valida=true;
      }
      else if(this.chanceForm.get('numeroE').value.toString().length != 3){
        valida=true;
      }
    }
    else if(this.seleccionado==4){
      if(this.chanceForm.get('numeroA').value.toString().length != 4){
        valida=true;
      }
      else  if(this.chanceForm.get('numeroB').value.toString().length != 4){
        valida=true;
      }
      else if(this.chanceForm.get('numeroC').value.toString().length != 4){
        valida=true;
      }
      else if(this.chanceForm.get('numeroD').value.toString().length != 4){
        valida=true;
      }
      else if(this.chanceForm.get('numeroE').value.toString().length != 4){
        valida=true;
      }
    }

    if(valida){
      this.messageService.add(MsjUtil.getToastErrorMedium('Sólo se permiten dígitos de 3 y 4 cifras, según la modalidad seleccionada'));
      return;
    }

    //validar repetidos
    let numeros=[this.chanceForm.get('numeroA').value.toString(),this.chanceForm.get('numeroB').value.toString(),
    this.chanceForm.get('numeroC').value.toString(),this.chanceForm.get('numeroD').value.toString(),
    this.chanceForm.get('numeroE').value.toString()];
    let uniqs = numeros.filter(function(item, index, array) {
      return array.indexOf(item) === index;
    })
    if(uniqs.length != numeros.length){
      this.messageService.add(MsjUtil.getToastErrorMedium('No se pueden realizar apuestas repetidas'));
      return;
    }

    let contadorLoterias=0;
    this.loterias.forEach(element => {
    if (element.checked) {
      contadorLoterias++;
    }
    });
    if(contadorLoterias==2){
      if(this.btnAdd){
        this.addBetSend();
      }
      else if(this.btnEdit){
        this.editBetSend();
      }
      
    }
    else{
      this.messageService.add(MsjUtil.getToastErrorMedium('Se deben seleccionar dos loterias'));
    }

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
        correoCustomer: this.correoCustomer,
        modalidad: this.seleccionado==4 ? '4 Cifras' : '3 Cifras',
        numberPlayed:null,
        valorApostado: this.chanceForm.get('valorApostado').value,
        apuestaA: this.chanceForm.get('numeroA').value,
        apuestaB: this.chanceForm.get('numeroB').value,
        apuestaC: this.chanceForm.get('numeroC').value,
        apuestaD: this.chanceForm.get('numeroD').value,
        apuestaE: this.chanceForm.get('numeroE').value,
        dataPlayed: this.dayBet,
        nombresLoteria:this.nombresLoterias(),
        loterias:this.lotteriesSelected
      });
      this.cleanInputs();
      if(this.idCustomer){
          this.enabledCustomer = true;
      }
      else{
        this.enabledCustomer = false;
      }
     
      this.selectUnmarkAllBol=false;
    
  }

  nombresLoterias(){
    let nombres="";
    this.loterias.forEach(l => {
      if(l.checked){
        nombres=nombres+", "+l.nombreCorto;
        }
    });
    return nombres.substr(1,nombres.length);
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
        modalidad: this.seleccionado==4 ? '4 Cifras' : '3 Cifras',
        numberPlayed:null,
        apuestaA: this.chanceForm.get('numeroA').value,
        apuestaB: this.chanceForm.get('numeroB').value,
        apuestaC: this.chanceForm.get('numeroC').value,
        apuestaD: this.chanceForm.get('numeroD').value,
        apuestaE: this.chanceForm.get('numeroE').value,
        nombresLoteria:this.nombresLoterias(),
        dataPlayed: this.dayBet,
        loterias:this.lotteriesSelected
      });
      this.cleanInputs();
      if(this.chanceForm.get('nombreCliente').value){
          this.enabledCustomer = true;
      }
      else{
        this.enabledCustomer = false;
      }
      this.selectUnmarkAllBol=false;
    
  }

  aleatorioLoterias(){
    let aleatorio= Math.round(Math.random() * (this.loterias.length-1 - 0) + 0);
    this.loterias[aleatorio].checked=true;
    aleatorio=aleatorio= Math.round(Math.random() * (this.loterias.length-1 - 0) + 0);
    this.loterias[aleatorio].checked=true;
    this.validarCantidad();
  }


  validarCantidad(){
    let contadorLoterias=0;
    this.loterias.forEach(element => {
    if (element.checked) {
      contadorLoterias++;
    }
    });
    if(contadorLoterias==2){
      this.addLotteries.emit(this.get_lotteriesSelected());
      return;
    }
    else{
      this.loterias.forEach(element => {
        element.checked=false;
        });
      this.aleatorioLoterias();
    }
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
    this.chanceForm.get('valorApostado').setValue(event.valorApostado);
    this.chanceForm.get('numeroA').setValue(event.apuestaA);
    this.chanceForm.get('numeroB').setValue(event.apuestaB);
    this.chanceForm.get('numeroC').setValue(event.apuestaC);
    this.chanceForm.get('numeroD').setValue(event.apuestaD);
    this.chanceForm.get('numeroE').setValue(event.apuestaE);
    if (event.nameCustomer) {
      this.chanceForm.get('nombreCliente').setValue(event.nameCustomer);
      this.enabledCustomer = true;
    }
    if(event.modalidad=='3 Cifras'){
      this.chanceForm.get('radioUno').setValue(3);
      this.seleccionEditar(3);
    }
    else{
      this.chanceForm.get('radioUno').setValue(4);
      this.seleccionEditar(4);
    }

    this.lotteriesSelected.forEach(element => {
      element.checked=false;
      this.toggleVisibility(element);
    });
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
     if(valid){
      return false;
     }
     valid=false;
     if (String(this.chanceForm.get('numero').value).length === 4
        && (this.chanceForm.get('valorDirecto').value ||
        this.chanceForm.get('combinado').value)) {
          valid= true;
    } else  if (String(this.chanceForm.get('numero').value).length === 3
    && (this.chanceForm.get('valorDirecto').value ||
    this.chanceForm.get('combinado').value)) {
      valid= true;
     }
     else  if (String(this.chanceForm.get('numero').value).length === 2
     && this.chanceForm.get('valorDirecto').value) {
       valid= true;
      }
      else  if (String(this.chanceForm.get('numero').value).length === 1
    && this.chanceForm.get('valorDirecto').value) {
      valid= true;
     }
     if(!valid){
      return false;
     }
    if (this.chanceForm.get('numero').valid && this.dayBet) {
      if (this.chanceForm.get('valorDirecto').value ||
          this.chanceForm.get('combinado').value ||
          this.chanceForm.get('tresCifras').value ||
          this.chanceForm.get('dosCifras').value ||
          this.chanceForm.get('unaCifra').value ) {
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
    this.chanceForm.get('numeroA').setValue('');
    this.chanceForm.get('numeroB').setValue('');
    this.chanceForm.get('numeroC').setValue('');
    this.chanceForm.get('numeroD').setValue('');
    this.chanceForm.get('numeroE').setValue('');
    this.valoresModalidades=[];
    this.chanceForm.get('valorApostado').setValue('');
    this.chanceForm.get('radioUno').setValue(null);
    this.chanceForm.get('radioDos').setValue(null);
    this.seleccionado=null;
    this.enabledCustomer = false;
    this.enabledCombined = true;
    this.enabledThree = true;
    this.enabledTwo = true;
    this.enabledOne = true;
    this.btnAdd = true;
    this.btnEdit = false;
    //selimpia panel loterias
    this.loterias.forEach(element => {
        element.checked= false; 
    });
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


  /**
   * @author Luis Hernandez
   * @description Funcion que permite valida que el usuario
   * solo ingrese numeros en los campos donde se espera solo numeros
   * @param e
   */
  keyPressNumber(e) {
    if(this.seleccionado){
      const key = window.Event ? e.which : e.keyCode;
      e.key.replace(/\D|\-/, '');
      return (key >= 48 && key <= 57);
    }
    return false;
    
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


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de
   * seleccionar todas las loterias y marcar
   * todos los checkbox
   */
  selectUnmarkAll(): void {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.loterias.length; index++) {
        this.loterias[index].checked = false;
      }
      this.selectUnmarkAllBol = false;
    

    this.addLotteries.emit(this.get_lotteriesSelected());
  }


  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

}
