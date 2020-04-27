import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../../productos.service';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { Directionality } from '@angular/cdk/bidi';

@Component({
  selector: 'app-bolsa',
  templateUrl: './bolsa.component.html',
  styleUrls: ['./bolsa.component.css'],
  providers: [ProductosService]
})
export class BolsaComponent extends CommonComponent implements OnInit, OnDestroy  {

  @Output() editBet: EventEmitter<any> = new EventEmitter();

  inputVat = 0;
  valueBet = 0;
  valueVat = 0;
  valueBetTotal = 0;
  cartItems = [];
  lotteries = [];


  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private shellState: ShellState
  ) {
    super();
  }

  ngOnInit(): void {
    this.get_taxes_vat();
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
      this.cartItems.push(event);
      this.get_values_totals();
    } else {
      const keyResponse = this.getKeyObject(event._id);
      this.setData(keyResponse, event);
    }
  }


  /**
   * @author Luis Hernandez
   * @description metodo que aplica los cambios de la edición
   */
  setData(key, event): void {
    this.cartItems[key].documentCustomer = event.documentCustomer;
    this.cartItems[key].nameCustomer = event.nameCustomer;
    this.cartItems[key].numberPlayed = event.numberPlayed;
    this.cartItems[key].dataPlayed = event.dataPlayed;
    this.cartItems[key].direct = event.direct;
    this.cartItems[key].combined = event.combined;
    this.cartItems[key].threeC = event.threeC;
    this.cartItems[key].twoC = event.twoC;
    this.cartItems[key].oneC = event.oneC;
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
  editBetSend(element): void {
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
    this.cartItems.forEach(element => {
      // tslint:disable-next-line: radix
      if (element.direct) { this.valueBet = (this.valueBet + parseInt(element.direct)); }
      // tslint:disable-next-line: radix
      if (element.combined) { this.valueBet = (this.valueBet + parseInt(element.combined)); }
      // tslint:disable-next-line: radix
      if (element.threeC) { this.valueBet = (this.valueBet + parseInt(element.threeC)); }
      // tslint:disable-next-line: radix
      if (element.twoC) { this.valueBet = (this.valueBet + parseInt(element.twoC)); }
      // tslint:disable-next-line: radix
      if (element.oneC) { this.valueBet = this.valueBet + parseInt(element.oneC); }
    });

    this.valueVat = Math.floor(this.valueBet * this.inputVat) / 100;
    this.valueBet = this.valueBet - this.valueVat;

    this.valueBetTotal = Math.floor(this.valueBet + this.valueVat);
  }


  payTransaction(): void {

    const bets = [];

    const paySend = {
      datePlayed: this.cartItems[0].dataPlayed,
      idCustomer: this.cartItems[0].idCustomer,
      valueBet : this.valueBet,
      valueVat : this.valueVat,
      valueBetTotal : this.valueBetTotal,
      bets: null,
      lotteries : this.lotteries,
    };

    this.cartItems.forEach(element => {
      const bet = [];
      const betDetail = {numberPlayed: null, details: null};
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

      }

      betDetail.details = bet;
      bets.push(betDetail);
    });

    paySend.bets = bets;


    this.productosService.registrarApuesta(paySend).subscribe(
      apuestaData => {
        const responseApuesta: any = apuestaData;
        if (responseApuesta.exito) {
          this.cleanCartValues();
          alert('Transacción exitosa');
        } else {
          alert('Problemas con la transacción');
        }
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );

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
  }


  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
    this.shellState.title.clear();
  }


}
