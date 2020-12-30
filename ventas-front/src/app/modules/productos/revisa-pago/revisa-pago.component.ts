import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterConstant } from '../../../constants/router.constant';
import { Router } from '@angular/router';
import { ProductosService } from '../productos.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-revisa-pago',
  templateUrl: './revisa-pago.component.html',
  styleUrls: ['./revisa-pago.component.css'],
  providers: [ProductosService]
})
export class RevisaPagoComponent implements OnInit {

  productosChance = []

  subtotalGeneral = 0
  ivaGeneral = 0
  totalGeneral = 0
  efectivo = 0
  devuelta = 0

  ivaServicio = 0


  constructor(
    private productosService: ProductosService,
    private router: Router,
    protected messageService: MessageService
  ) {
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
        this.ivaServicio = parseInt(impuestoData.descripcion);
        this.obtenerProductosChance()
      },
      error => {
        console.log(error);
      }
    );
  }


  obtenerProductosChance() {

    this.productosChance = []
    this.efectivo = 0
    this.devuelta = 0
    const productosChanceConst = JSON.parse(localStorage.getItem('chanceApuesta'))
    productosChanceConst.forEach(element => {
      
      this.productosChance.push({
        apostado:this.obtenerApostado(element.apostado),
        colilla:element.colilla,
        fechaActual:element.fechaActual,
        iva:this.obtenerIvaCaluladoPorProducto(element.apostado),
        listaNumeros:this.concatenarNumeros(element.listaNumeros),
        loterias:this.concatenarLoterias(element.loterias),
        total:element.total,
        _id:element._id
      });

    });

    this.calcularValores();

  }


  obtenerApostado(apostado){
    let iva = Math.floor(apostado * this.ivaServicio) / 100;
    return apostado - iva
  }


  obtenerIvaCaluladoPorProducto(apostado){
    return Math.floor(apostado * this.ivaServicio) / 100;
  }


  concatenarLoterias(loterias){

    let loteriasConcatenar = '';

    loterias.forEach(lot => {
      if(lot.checked){
        if(loteriasConcatenar === ''){
          loteriasConcatenar = lot.nombreCorto
        } else {
          loteriasConcatenar = loteriasConcatenar+', '+lot.nombreCorto
        }
      }
    });

    return loteriasConcatenar

  }


  concatenarNumeros(numeros){

    let numerosConcatenar = '';

    numeros.forEach(num => {
      if(numerosConcatenar === ''){
        if(num.numeroFilaUno){ numerosConcatenar = num.numeroFilaUno}
      } else {
        if(num.numeroFilaDos){ numerosConcatenar = numerosConcatenar+', '+num.numeroFilaDos }
        if(num.numeroFilaTres){ numerosConcatenar = numerosConcatenar+', '+num.numeroFilaTres }
        if(num.numeroFilaCuatro){ numerosConcatenar = numerosConcatenar+', '+num.numeroFilaCuatro }
        if(num.numeroFilaCinco){ numerosConcatenar = numerosConcatenar+', '+num.numeroFilaCinco }
      }
    });

    return numerosConcatenar
  }


  calcularValores() {

    this.subtotalGeneral = 0
    this.ivaGeneral = 0
    this.totalGeneral = 0

    if(this.productosChance){
      this.productosChance.forEach(element => {
        this.subtotalGeneral = this.subtotalGeneral + element.apostado
        this.ivaGeneral = this.ivaGeneral + element.iva
        this.totalGeneral = this.totalGeneral + element.total
      });
    }
    
  }



  calcularDevuelta(){
    this.devuelta = this.efectivo - this.totalGeneral
  }




  borrarApuesta(id) {
    const productosBorrar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const keyResponse = this.getKeyObject(id, productosBorrar);
    if ( keyResponse  !== -1 ) {
      productosBorrar.splice( keyResponse , 1 );
    }
    localStorage.setItem('chanceApuesta', JSON.stringify(productosBorrar));
    this.obtenerProductosChance();
  }



  /**
   * @author Luis Hernandez
   * @param id
   * @description metodo que se encarga
   * de buscar el punto dentro del array
   * de un producto
   */
  getKeyObject(_id, productos) {
    return productos.map((e) => {
      return e._id;
    }).indexOf(_id);
  }



  volverAtras(): void {
    this.router.navigate([RouterConstant.NAVIGATE_CHANCE]);
  }


  


}
