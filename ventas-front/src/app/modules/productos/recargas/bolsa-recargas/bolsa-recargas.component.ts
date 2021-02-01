import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductosService } from '../../productos.service';
import { MsjUtil } from 'src/app/utilities/messages.util';


@Component({
  selector: 'app-bolsa-recargas',
  templateUrl: './bolsa-recargas.component.html',
  styleUrls: ['./bolsa-recargas.component.css'],
  providers: [ProductosService]
})
export class BolsaRecargasComponent extends CommonComponent implements OnInit, OnDestroy  {

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
 
      this.cartItems[key].operador = event.operador;
      this.cartItems[key].valor = event.valor;
   
      this.cartItems[key].numeroRecarga = event.numeroRecarga;
      if(event.paquete){
      this.cartItems[key].paquete = event.paquete;
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
      this.valueBet=this.valueBet+parseInt(element.valor);
    });

    this.valueVat = Math.floor(this.valueBet * this.inputVat) / 100;
    this.valueBet = this.valueBet - this.valueVat;

    this.valueBetTotal = Math.floor(this.valueBet + this.valueVat);
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

  hacerCompra(): void {

    const recargas = [];

    const paySend = {
      idUser: this.shellState.userAccount.auth.usuario.idUsuario,
      datePlayed: this.cartItems[0].dataPlayed,
      idCustomer: this.cartItems[0].idCustomer,
      valueBet : this.valueBet,
      valueVat : this.valueVat,
      valueBetTotal : this.valueBetTotal,
      recargas: null,
      canal: "WEB",
      producto: "RECARGAS"
    };

    this.cartItems.forEach(element => {
   
      const detalle = {numeroRecarga: null, valorRecarga: null, idOperador: null,
        idPaquete: null};
        detalle.numeroRecarga=element.numeroRecarga;
        detalle.valorRecarga=element.valor;
        detalle.idOperador=element.idOperador;
        detalle.idPaquete=element.idPaquete;
        recargas.push(detalle);
    });

    paySend.recargas=recargas;
    this.productosService.registrarRecarga(paySend).subscribe(
      apuestaData => {
        const responseApuesta: any = apuestaData;
        if (responseApuesta.exito) {
          this.cleanCartValues();

              // se muestra el mensaje exitoso
          this.messageService.add(MsjUtil.getToastSuccessMedium('Transacción exitosa'));
          this.creatingBet.emit(true);

        } else {
          this.messageService.add(MsjUtil.getMsjError(responseApuesta.mensaje));
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


}
