import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductosService } from '../../productos.service';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { NotificacionSoportePagoDTO } from 'src/app/dtos/correos/notificacion-soporte-pago.dto';
@Component({
  selector: 'app-bolsa',
  templateUrl: './bolsa.component.html',
  styleUrls: ['./bolsa.component.css'],
  providers: [ProductosService]
})
export class BolsaComponent extends CommonComponent implements OnInit, OnDestroy  {

  @Output() editBet: EventEmitter<any> = new EventEmitter();
  @Output() creatingBet: EventEmitter<any> = new EventEmitter();


  inputVat = 0;
  valueBet = 0;
  valueVat = 0;
  valueBetTotal = 0;
  cartItems = [];
  lotteries = [];
  producto = null;
  zignos = [];
  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private shellState: ShellState
  ) {
    super();
  }

  ngOnInit(): void {
    this.get_taxes_vat();
    this.getSignos();
  }


  getSignos() {
    this.zignos = [];
    this.productosService.consultarSignos().subscribe(
      signosData => {
        const rs: any = signosData;
        rs.forEach(element => {
          if (element.nombre != 'Todos') {
          this.zignos.push(element);
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
   * @description Metodo que se encarga de traer
   * el iva el cual se le aplica a la apuesta
   */
  get_taxes_vat(): void {
    this.productosService.consultarIva('IVA').subscribe(
      impuestoData => {
        // tslint:disable-next-line: radix
        this.inputVat = parseInt(impuestoData.descripcion);
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description metodo que se encarga de validar
   * cuando van agregar un producto nuevo
   * a la bolsa y cuando lo estan modificando
   */
  validCreateAndEdit(event): void {
    if (event.action === 1) {
      delete event.action;
      // this.lotteries = event.lotteries;
      // delete event.lotteries;
      this.cartItems.push(event);
      this.get_values_totals();
    } else {
      const keyResponse = this.getKeyObject(event._id);
      this.setData(keyResponse, event);
    }
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se encarga de obtener las loterias
   * que el usuarios selecciono y generar los valores totales
   */
  setLotteries(event): void {
    this.lotteries = event;
    this.get_values_totals();
  }


  /**
   * @param event
   * @description Metodo que obtiene el producto que se va agregar al carrito
   */
  setProducto(event): void {
    this.producto = event;
  }


  /**
   * @author Luis Hernandez
   * @description metodo que aplica los cambios de la edición
   */
  setData(key, event): void {
    this.cartItems[key].documentCustomer = event.documentCustomer;
    this.cartItems[key].nameCustomer = event.nameCustomer;
    this.cartItems[key].dataPlayed = event.dataPlayed;
    this.cartItems[key].nombresLoteria = event.nombresLoteria;
    this.cartItems[key].loterias = event.loterias;
    if (event.numeroSuper) {
      this.cartItems[key].numeroSuper = event.numeroSuper;
      this.cartItems[key].valorApostado = event.valorApostado;
    } else if (event.numeroAstro) {
      this.cartItems[key].numeroAstro = event.numeroAstro;
      this.cartItems[key].zignos = event.zignos;
      this.cartItems[key].valorApostado = event.valorApostado;
    } else if (event.numberPlayed == null) {
      this.cartItems[key].apuestaA = event.apuestaA;
      this.cartItems[key].apuestaB = event.apuestaB;
      this.cartItems[key].apuestaC = event.apuestaC;
      this.cartItems[key].apuestaD = event.apuestaD;
      this.cartItems[key].apuestaE = event.apuestaE;
    } else {
      this.cartItems[key].numberPlayed = event.numberPlayed;
      this.cartItems[key].direct = event.direct;
      this.cartItems[key].combined = event.combined;
      this.cartItems[key].threeC = event.threeC;
      this.cartItems[key].twoC = event.twoC;
      this.cartItems[key].oneC = event.oneC;
    }
    // this.lotteries = event.lotteries;
    this.get_values_totals();
  }


  /**
   * @author Luis Hernandez
   * @param element
   * @description metodo que se encarga
   * de enviar al componente de apuesta
   * la información de la apuesta que
   * se desea modificar
   */
  editBetSend(element, repetirApuesta): void {
    element.repetirApuesta=repetirApuesta;
    this.editBet.emit(element);
  }




  /**
   * @author Luis Hernandez
   * @param element
   * @description Por medio de este metodo
   * eliminamos el item (apuesta) seleccionado
   * por el usuario
   */
  deleteBet(element): void {
    const keyResponse = this.getKeyObject(element._id);
    if ( keyResponse  !== -1 ) {
      this.cartItems.splice( keyResponse , 1 );
      this.get_values_totals();
    }
  }


  /**
   * @author Luis Hernandez
   * @param id
   * @description metodo que se encarga
   * de buscar el punto dentro del array
   * de un producto
   */
  getKeyObject(id) {
    return this.cartItems.map((e) => {
      return e._id;
    }).indexOf(id);
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de recalcular el valor de la apuesta
   */
  get_values_totals(): void {
    this.valueBet = 0;
    this.valueVat = 0;
    let loterias=[];
    let valorSumado=0;
    this.cartItems.forEach(element => {
         loterias=[];
         valorSumado=0;
   //   this.valueBet=0;
      if (element.modalidad && element.numeroSuper == null) {
        if (element.modalidad == '4 Cifras') {
          this.valueBet = this.valueBet +parseInt(element.valorApostado);
        } else {
          this.valueBet =this.valueBet + parseInt(element.valorApostado);
        }
      } else if (element.modalidad == null && (element.numeroSuper || element.numeroAstro)) {
          this.valueBet = this.valueBet + parseInt(element.valorApostado);
          this.valueBet = element.loterias.length * this.valueBet;
      } else {
      // tslint:disable-next-line: radix
      if (element.direct) { valorSumado = (valorSumado + parseInt(element.direct)); }
      // tslint:disable-next-line: radix
      if (element.combined) { valorSumado= (valorSumado + parseInt(element.combined)); }
      // tslint:disable-next-line: radix
      if (element.threeC) { valorSumado= (valorSumado + parseInt(element.threeC)); }
      // tslint:disable-next-line: radix
      if (element.twoC) { valorSumado = (valorSumado+ parseInt(element.twoC)); }
      // tslint:disable-next-line: radix
      if (element.oneC) { valorSumado = valorSumado+ parseInt(element.oneC); }
      this.valueBet =this.valueBet+ (element.loterias.length * valorSumado);
      }
    });
   
    const calculoImpuesto=(this.inputVat/100) + 1
    this.valueVat = this.valueBet-(this.valueBet / calculoImpuesto);
    this.valueBet = this.valueBet - this.valueVat;

    this.valueBetTotal = Math.floor(this.valueBet + this.valueVat);
  }

  consultarTipoAPuesta(cartItem){
    let tipoApuesta="";
    if(cartItem.numeroAstro){
      tipoApuesta="Super astro";
    }
    else   if(cartItem.numberPlayed){
      tipoApuesta="Chance";
    }
    else   if(cartItem.apuestaA){
      tipoApuesta="Chance millonario";
    }
    else   if(cartItem.numeroSuper){
      tipoApuesta="Super chance";
    }


    return tipoApuesta;
  }


  payTransaction(): void {
    this.messageService.clear();

    // se muestra la ventana de confirmacion
    this.confirmationService.confirm({
      message: '¿Está seguro que desea hacer la compra?',
      header: 'CONFIRMACIÓN',
      accept: () => {
        // se confirma
        this.hacerCompra();
      },
    });
   
  }

  hacerCompra(){
    const bets = [];

    const paySend = {
      idUser: this.shellState.userAccount.auth.usuario.idUsuario,
      datePlayed: this.cartItems[0].dataPlayed,
      idCustomer: this.cartItems[0].idCustomer,
      valueBet : this.valueBet,
      valueVat : this.valueVat,
      valueBetTotal : this.valueBetTotal,
      bets: null,
      lotteries : this.lotteries,
      canal: null,
      producto: this.producto
    };

    this.cartItems.forEach(element => {
      const bet = [];
      const betDetail = {valueBet:null,valueVat:null,numberPlayed: null, apuestaA: null, apuestaB: null,
        apuestaC: null, apuestaD: null, apuestaE: null, numeroSuper: null, details: null, numeroAstro: null, zignos: null, lotteries:null,
        fechaSorteo:null};
      if (element.modalidad && element.numeroSuper == null) {
        betDetail.apuestaA = element.apuestaA;
        betDetail.apuestaB = element.apuestaB;
        betDetail.apuestaC = element.apuestaC;
        betDetail.apuestaD = element.apuestaD;
        betDetail.apuestaE = element.apuestaE;
        betDetail.valueBet= element.valorApostado;
        const calculoImpuesto=(this.inputVat/100) + 1
        betDetail.valueVat = this.valueBet-(this.valueBet / calculoImpuesto);
      } else if (element.modalidad == null && element.numeroSuper) {
        betDetail.numeroSuper = element.numeroSuper;
        betDetail.valueBet= element.valorApostado;
        const calculoImpuesto=(this.inputVat/100) + 1
        betDetail.valueVat = this.valueBet-(this.valueBet / calculoImpuesto);
      } else if (element.modalidad == null && element.numeroAstro) {
        betDetail.numeroAstro = element.numeroAstro;
        betDetail.valueBet= element.valorApostado;
        const calculoImpuesto=(this.inputVat/100) + 1
        betDetail.valueVat = this.valueBet-(this.valueBet / calculoImpuesto);
        betDetail.zignos = element.zignos;
      } else {
      betDetail.numberPlayed = element.numberPlayed;
      if (String(element.numberPlayed).length === 4) {

        if (element.direct) {bet.push({code: 1, valor: element.direct}); }
        if (element.combined) {bet.push({code: 2, valor: element.combined}); }
        if (element.threeC) { bet.push({code: 3, valor: element.threeC}); }
        if (element.twoC) { bet.push({code: 5, valor: element.twoC}); }
        if (element.oneC) { bet.push({code: 6, valor: element.oneC}); }

      } else if (String(element.numberPlayed).length === 3) {

        if (element.direct) { bet.push({code: 3, valor: element.direct}); }
        if (element.combined) { bet.push({code: 4, valor: element.combined}); }
        if (element.twoC) { bet.push({code: 5, valor: element.twoC}); }
        if (element.oneC) { bet.push({code: 6, valor: element.oneC}); }

      } else if (String(element.numberPlayed).length === 2) {

        if (element.direct) { bet.push({code: 5, valor: element.direct}); }
        if (element.oneC) { bet.push({code: 6, valor: element.oneC}); }

      } else if (String(element.numberPlayed).length === 1) {
        if (element.direct) { bet.push({code: 6, valor: element.direct}); }
      }
      betDetail.details = bet;
     }
     betDetail.fechaSorteo=element.dataPlayed;
      betDetail.lotteries=element.loterias;
      bets.push(betDetail);
    });

    paySend.bets = bets;
    paySend.canal = 'WEB';


    this.productosService.registrarApuesta(paySend).subscribe(
      apuestaData => {
        const responseApuesta: any = apuestaData;
        if (responseApuesta.exito) {

          // se muestra el mensaje exitoso
          this.messageService.add(MsjUtil.getToastSuccessMedium('Transacción exitosa'));

          // se envia la notificacion
          if (this.cartItems[0].correoCustomer) {
            const notificacion: NotificacionSoportePagoDTO = apuestaData.notificacionSoportePago;
            if (notificacion) {
              notificacion.correoDestino = this.cartItems[0].correoCustomer;
              notificacion.idUsuario = this.shellState.userAccount.auth.usuario.idUsuario;
              this.enviarNotificacionSoportePago(notificacion);
            }
          }

          // se limpia la data ingresada
          this.cleanCartValues();
          this.creatingBet.emit(true);
        } 
        else if(responseApuesta.mensaje){
          this.messageService.add(MsjUtil.getToastErrorMedium(responseApuesta.mensaje));
        }
        else {
          this.messageService.add(MsjUtil.getToastErrorMedium('Problemas con la transacción'));
        }
      },
      error => {
        this.messageService.add(MsjUtil.getToastErrorMedium(this.showMensajeError(error)));
      }
    );

  }


  validarSignoNombre(signos){
    let sig = '';
    if (signos.length >= 12) {
      sig = ",Todos";
  } else {
    signos.forEach(s => {
      this.zignos.forEach(element => {
        if (s == element.idSigno) {
         sig = sig + ", " + element.nombre;
        }
      });
    });
  }
    return sig.substr(1,sig.length);
  }


  nombreSigno(signo) {
    if (signo == 1) {
      return 'Acuario';
    } else if(signo == 2) {
      return 'Piscis';
    } else if (signo == 3) {
      return 'Aries';
    } else if(signo == 4) {
      return 'Tauro';
    } else if(signo == 5) {
      return 'Géminis';
    } else if(signo == 6) {
      return 'Cáncer';
    } else if(signo == 7) {
      return 'Leo';
    } else if(signo == 8) {
      return 'Virgo';
    } else if(signo == 9) {
      return 'Libra';
    } else if(signo == 10) {
      return 'Escorpio';
    } else if(signo == 11) {
      return 'Sagitario';
    } else if(signo == 12) {
      return 'Capricornio';
    } else if(signo == 13) {
      return 'Todos';
    }
  }
  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga
   * de limpiar y restaurar el carro
   * de compras
   */
  cleanCartValues(): void {
    this.cartItems = [];
    this.valueBet = 0;
    this.valueVat = 0;
    this.valueBetTotal = 0;
    this.lotteries = [];

    // this.valueBet = 0;
    //       this.valueVat = 0;
    //       this.valueBetTotal = 0;
  }


  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

  /**
   * Permite enviar la notificacion de soporte de pago
   */
  private enviarNotificacionSoportePago(data: NotificacionSoportePagoDTO): void {
    this.productosService.enviarNotificacionSoportePagoChance(data).subscribe(
      (response) => {},
      (error) => { this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error))); }
    );
  }
}
