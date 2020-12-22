import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductosService } from '../../productos.service';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { NotificacionSoportePagoDTO } from 'src/app/dtos/correos/notificacion-soporte-pago.dto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CommonService } from 'src/app/utilities/common.service';




@Component({
  selector: 'app-summary-footer',
  templateUrl: './summary-footer.component.html',
  styleUrls: ['./summary-footer.component.css'],
  providers: [ProductosService, CommonService]
})

export class SummaryFooterComponent extends CommonComponent implements OnInit, OnDestroy  {

  @Output() borrarTodoReset: EventEmitter<any> = new EventEmitter();

  inputVat = 0;
  valueBet = 0;
  valueVat = 0;
  valueBetTotal = 0;
  listaNumeros = [];
  producto = null;
  loterias = [];
  colilla = '';

  hoy = new Date();
  fechaActual = this.hoy.getDate() + '/' + (this.hoy.getMonth() + 1) + '/' + this.hoy.getFullYear();

  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private shellState: ShellState,
    private commonService: CommonService
  ) {
    super();
    this.productosService.consultarNumeroSerieApuesta("CHANCE").subscribe(
      numeroSerie => {
        this.colilla=numeroSerie.codigo;
      },
      error => {
        this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
      }
    );
  }

  ngOnInit(): void {
    this.obtenerIva();
  }

  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de traer
   * el iva el cual se le aplica a la apuesta
   */
  obtenerIva(): void {
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
   * @description Metodo que se encarga de obtener las loterias
   * que el usuarios selecciono y generar los valores totales
   */
  setLoterias(event): void {
    this.loterias = event;
    this.obtenerValoresTotales();
  }


  /**
   * @param event
   * @description Metodo que obtiene el producto que se va agregar al carrito
   */
  setProducto(event): void {
    this.producto = event;
  }



  setNumeros(event){
    this.listaNumeros = event
    this.obtenerValoresTotales();
  }




  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de recalcular el valor de la apuesta
   */
  obtenerValoresTotales(): void {
    this.valueBet = 0;
    let valorSumado = 0;
    for (let index = 0; index < this.listaNumeros.length; index++) {
      if(this.listaNumeros[index].valorDirectoFilaUno){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].valorDirectoFilaUno));}
      if(this.listaNumeros[index].combinadoFilaUno){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].combinadoFilaUno)); }
      if(this.listaNumeros[index].dosCifrasFilaUno){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].dosCifrasFilaUno)); }
      if(this.listaNumeros[index].unaCifraFilaUno){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].unaCifraFilaUno)); }

      if(this.listaNumeros[index].valorDirectoFilaDos){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].valorDirectoFilaDos));}
      if(this.listaNumeros[index].combinadoFilaDos){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].combinadoFilaDos)); }
      if(this.listaNumeros[index].dosCifrasFilaDos){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].dosCifrasFilaDos)); }
      if(this.listaNumeros[index].unaCifraFilaDos){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].unaCifraFilaDos)); }

      if(this.listaNumeros[index].valorDirectoFilaTres){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].valorDirectoFilaTres));}
      if(this.listaNumeros[index].combinadoFilaTres){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].combinadoFilaTres)); }
      if(this.listaNumeros[index].dosCifrasFilaTres){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].dosCifrasFilaTres)); }
      if(this.listaNumeros[index].unaCifraFilaTres){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].unaCifraFilaTres)); }

      if(this.listaNumeros[index].valorDirectoFilaCuatro){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].valorDirectoFilaCuatro));}
      if(this.listaNumeros[index].combinadoFilaCuatro){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].combinadoFilaCuatro)); }
      if(this.listaNumeros[index].dosCifrasFilaCuatro){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].dosCifrasFilaCuatro)); }
      if(this.listaNumeros[index].unaCifraFilaCuatro){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].unaCifraFilaCuatro)); }

      if(this.listaNumeros[index].valorDirectoFilaCinco){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].valorDirectoFilaCinco));}
      if(this.listaNumeros[index].combinadoFilaCinco){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].combinadoFilaCinco)); }
      if(this.listaNumeros[index].dosCifrasFilaCinco){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].dosCifrasFilaCinco)); }
      if(this.listaNumeros[index].unaCifraFilaCinco){ valorSumado = (valorSumado + parseInt(this.listaNumeros[index].unaCifraFilaCinco)); }
    }

    this.valueBet = (this.loterias.length * valorSumado);
    this.valueVat = Math.floor(this.valueBet * this.inputVat) / 100;
    this.valueBet = this.valueBet - this.valueVat;
    this.valueBetTotal = Math.floor(this.valueBet + this.valueVat);

  }


  agregarCarritoF(): void {

    const listaNumeros = this.obtenerFilasConApuesta(this.listaNumeros)

    if(this.colilla && this.fechaActual && this.loterias.length > 0 && listaNumeros.length > 0) {
      const productosAgregar = {
        _id: 'bet_' + Math.floor(Math.random() * 999999),
        colilla: this.colilla,
        fechaActual: this.fechaActual,
        loterias: this.loterias,
        apostado: this.valueBet,
        iva: this.valueVat,
        total: this.valueBetTotal,
        listaNumeros:listaNumeros
      }
  
      const chanceApuesta = localStorage.getItem('chanceApuesta');
      if(chanceApuesta === null){
        const arrayproductosAgregar = []
        arrayproductosAgregar.push(productosAgregar)
        localStorage.setItem('chanceApuesta', JSON.stringify(arrayproductosAgregar));
      } else {
        const chanceAp = JSON.parse(localStorage.getItem('chanceApuesta'));
        chanceAp.push(productosAgregar);
        localStorage.setItem('chanceApuesta', JSON.stringify(chanceAp));
      }
      this.borrarTodoReset.emit(true);
    } else {
      alert('Valide que esta gestionando los campos necesarios para realizar la apuesta');
    }
    

  }




  obtenerFilasConApuesta(numeros){
    const returnNumeros = [];
    numeros.forEach(element => {
      if (element.numeroFilaUno) { returnNumeros.push(element) }
      if (element.numeroFilaDos) { returnNumeros.push(element) }
      if (element.numeroFilaTres) { returnNumeros.push(element) }
      if (element.numeroFilaCuatro) { returnNumeros.push(element) }
      if (element.numeroFilaCinco) { returnNumeros.push(element) }
    });
    return returnNumeros
  }





  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

}
