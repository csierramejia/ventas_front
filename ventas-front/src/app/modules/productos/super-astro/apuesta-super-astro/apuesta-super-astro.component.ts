import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductosService } from '../../productos.service';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { MessageService } from 'primeng/api';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { CrearClienteComponent } from '../../chance/crear-cliente/crear-cliente.component';

@Component({
  selector: 'app-apuesta-super-astro',
  templateUrl: './apuesta-super-astro.component.html',
  styleUrls: ['./apuesta-super-astro.component.css'],
  providers: [ProductosService]
})
export class ApuestaSuperAstroComponent extends CommonComponent implements OnInit, OnDestroy  {

  @Output() addBet: EventEmitter<any> = new EventEmitter();
  @Output() addLotteries: EventEmitter<any> = new EventEmitter();

  @ViewChild(CrearClienteComponent) crearClienteChild: CrearClienteComponent;

  idCustomer = '';
  displayModalCreate = false;
  btnEdit = false;
  btnAdd  = true;
  idEdit: any;
  selectTodas:boolean;
  selectUnmarkAllBol = false;
  loterias = [];
  lotteriesSelected = [];
  zignos=[];
  dayBet: Date;
  viewLotteries = false;
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

  fechaActual:Date;
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
   zignosSeleccionados: new FormControl(),
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
    this.setDays(dayWeek);
  }

  ngOnInit(): void {
    this.selectTodas=false;
    this.fechaActual=new Date();
    this.numeroSerie="AD123456";
    this.zignos=[
    {label:'Acuario', value:1},
    {label:'Piscis', value:2},
    {label:'Aries', value:3},
    {label:'Tauro', value:4},
    {label:'Géminis', value:5},
    {label:'Cáncer', value:6},
    {label:'Leo', value:7},
    {label:'Virgo', value:8},
    {label:'Libra', value:9},
    {label:'Escorpio', value:10},
    {label:'Sagitario', value:11},
    {label:'Capricornio', value:12}];


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
        chip.style.backgroundColor = '#0083FE';
        chip.style.color = '#fff';
      } else {
        const chip = document.getElementById(element.name);
        chip.style.backgroundColor = '#FFFFFF';
        chip.style.color = '#0083FE';
      }
    });
    // llamamos el metodo que se encarga de consultar las loterias
    this.getLotteries();
  }

  todas(){
    this.selectTodas=true;
    this.loterias.forEach(l => {
      l.checked=true;
    });
  }



  /**
   * @author Luis Hernandez
   * @description funcion que llama al servicio
   * de loterias y trae las loterias disponibles
   * según el día
   */
  getLotteries(): void {
    this.loterias=[];
      this.productosService.consultarLoterias(this.dayBet).subscribe(
        loteriasData => {
          const rs: any = loteriasData;
          rs.forEach(element => {
           // if(element.nombre.toUpperCase().includes("ASTRO")){
            this.loterias.push({
              idLoteria: element.idLoteria,
              codigo: element.codigo,
              nombre: element.nombre,
              nombreCorto: element.nombreCorto,
              telefono: element.telefono,
              idEstado: element.idEstado,
              idEmpresa: element.idEmpresa,
              idSorteo: element.idSorteo,
              checked: false,
              url:"assets/img/loterias/"+element.nombre.toUpperCase()+".png"
            });
         // }
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
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
   
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
  generar(numero){
    this.seleccionado=numero;
    if(numero==3){
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (100 - 999) + 999 ) );
    }
    else if(numero==4){
      this.chanceForm.controls.numeroA.setValue(Math.round(Math.random() * (1000 - 9999) + 9999 ));
    }
   
    this.consultarValoresModalidad(numero);
  }


  consultarValoresModalidad(numero){
    this.valoresModalidades=[];
    //SUPER CHANCE
      this.productosService.consultarValoresModalidad("SUPER CHANCE",numero).subscribe(
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
    let valida=false;
    //seleccion
    if(this.loterias==null || this.loterias==undefined || this.loterias.length==0){
      this.messageService.add(MsjUtil.getMsjError('Debe seleccionar el día para la apuesta'));
      return;
    }
    //valida nulos
    if(this.chanceForm.get('numeroA').value == null || this.chanceForm.get('numeroA').value ==''){
      valida=true;
    }
    
    if(valida){
      this.messageService.add(MsjUtil.getMsjError('Debe llenar todas la apuesta'));
      return;
    }
    valida=false;
   if( this.chanceForm.get('valorApostado').value==null ||  this.chanceForm.get('valorApostado').value==undefined
   ||  this.chanceForm.get('valorApostado').value==''){
    valida=true;
   }
    if(valida){
      this.messageService.add(MsjUtil.getMsjError('Debe seleccionar un valor para apostar'));
      return;
    }
     //validar longitudes
     valida=false;
      if(this.chanceForm.get('numeroA').value.toString().length != 4){
        valida=true;
      }

    if(valida){
      this.messageService.add(MsjUtil.getMsjError('El número jugado debe ser de 4 digitos'));
      return;
    }
        //validar zignos
        valida=false;
        if(this.chanceForm.get('zignosSeleccionados') == null || this.chanceForm.get('zignosSeleccionados').value==null){
          valida=true;
        }
  
      if(valida){
        this.messageService.add(MsjUtil.getMsjError('Por favor selecciona un signo zodiacal'));
        return;
      }

    this.addBetSend();
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
        modalidad: null,
        zignos:this.chanceForm.get('zignosSeleccionados').value,
        numeroSuper:this.chanceForm.get('numeroA').value,
        numberPlayed:null,
        valorApostado: this.chanceForm.get('valorApostado').value,
        apuestaA: null,
        apuestaB:null,
        apuestaC: null,
        apuestaD: null,
        apuestaE:null,
        dataPlayed: this.dayBet
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
        modalidad: null,
        numeroSuper:this.chanceForm.get('numeroA').value,
        numberPlayed:null,
        valorApostado: this.chanceForm.get('valorApostado').value,
        apuestaA: null,
        apuestaB:null,
        apuestaC: null,
        apuestaD: null,
        apuestaE:null,
        dataPlayed: this.dayBet
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
    this.chanceForm.get('numeroDocumento').setValue(event.documentCustomer);
    this.chanceForm.get('numeroA').setValue(event.apuestaA);
    if (event.nameCustomer) {
      this.chanceForm.get('nombreCliente').setValue(event.nameCustomer);
      this.enabledCustomer = true;
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
    this.selectTodas=false;
    this.chanceForm.get('numeroA').setValue('');
    this.valoresModalidades=[];
    this.chanceForm.get('valorApostado').setValue('');
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
    const dt = new Date(hoy.getMonth() + 1 + ' ' + hoy.getDate() + ', ' + hoy.getFullYear());
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
