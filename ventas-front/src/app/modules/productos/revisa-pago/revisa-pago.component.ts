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



  depurarInfo(){
    const productosDepurar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const productosDespuesDepurado = [];
    for (let index = 0; index < productosDepurar.length; index++) {
      productosDespuesDepurado.push({
        apostado: productosDepurar[index].apostado,
        clienteOperacion: productosDepurar[index].clienteOperacion,
        colilla: productosDepurar[index].colilla,
        fechaActual: productosDepurar[index].fechaActual,
        fechaSeleccionApuesta: productosDepurar[index].fechaSeleccionApuesta,
        iva: productosDepurar[index].iva,
        total: productosDepurar[index].iva,
        _id: productosDepurar[index].fechaSeleccionApuesta,
        loterias:this.obtenerLoteriasSeleccionadas(productosDepurar[index].loterias),
        listaNumeros: this.obtenerEstructuraDatosNumeros(productosDepurar[0].listaNumeros)
      })
    }

    console.log('++++++++++++++');
    console.log(productosDespuesDepurado);
    console.log('++++++++++++++');


  }




  obtenerEstructuraDatosNumeros(numerosIteras){

    const numeros = [];

    for (let index = 0; index < numerosIteras.length; index++) {

      if(index === 0){
        numeros.push({
          combinado: numerosIteras[index].combinadoFilaUno,
          dosCifras: numerosIteras[index].dosCifrasFilaUno,
          numero: numerosIteras[index].numeroFilaUno,
          unaCifra: numerosIteras[index].unaCifraFilaUno,
          valorDirecto: numerosIteras[index].valorDirectoFilaUno,
          tipoJuego: '',
          iva: '',
          total: '',
          apostado: ''
        })
      }

      if(index === 1){
        numeros.push({
          combinado: numerosIteras[index].combinadoFilaDos,
          dosCifras: numerosIteras[index].dosCifrasFilaDos,
          numero: numerosIteras[index].numeroFilaDos,
          unaCifra: numerosIteras[index].unaCifraFilaDos,
          valorDirecto: numerosIteras[index].valorDirectoFilaDos,
          tipoJuego: '',
          iva: '',
          total: '',
          apostado: ''
        })
      }

      if(index === 2){
        numeros.push({
          combinado: numerosIteras[index].combinadoFilaTres,
          dosCifras: numerosIteras[index].dosCifrasFilaTres,
          numero: numerosIteras[index].numeroFilaTres,
          unaCifra: numerosIteras[index].unaCifraFilaTres,
          valorDirecto: numerosIteras[index].valorDirectoFilaTres,
          tipoJuego: '',
          iva: '',
          total: '',
          apostado: ''
        })
      }

      if(index === 3){
        numeros.push({
          combinado: numerosIteras[index].combinadoFilaCuatro,
          dosCifras: numerosIteras[index].dosCifrasFilaCuatro,
          numero: numerosIteras[index].numeroFilaCuatro,
          unaCifra: numerosIteras[index].unaCifraFilaCuatro,
          valorDirecto: numerosIteras[index].valorDirectoFilaCuatro,
          tipoJuego: '',
          iva: '',
          total: '',
          apostado: ''
        })
      }

      if(index === 4){
        numeros.push({
          combinado: numerosIteras[index].combinadoFilaCinco,
          dosCifras: numerosIteras[index].dosCifrasFilaCinco,
          numero: numerosIteras[index].numeroFilaCinco,
          unaCifra: numerosIteras[index].unaCifraFilaCinco,
          valorDirecto: numerosIteras[index].valorDirectoFilaCinco,
          tipoJuego: '',
          iva: '',
          total: '',
          apostado: ''
        })
      }

    }

    return this.obtenerTipoJuego(numeros);

  }


  obtenerTipoJuego(numeros){

    let cont = 0

    numeros.forEach(element => {
      const detalles = []

      if (String(element.numero).length === 4) {
        if (element.valorDirecto) { detalles.push({code: 1, valor: element.valorDirecto});}
        if (element.combinado) { detalles.push({code: 2, valor: element.combinado});}
        if (element.dosCifras) { detalles.push({code: 5, valor: element.dosCifras}); }
        if (element.unaCifra) { detalles.push({code: 6, valor: element.unaCifra}); }
      } else if (String(element.numero).length === 3) {
        if (element.valorDirecto) { detalles.push({code: 3, valor: element.valorDirecto});}
        if (element.combinado) { detalles.push({code: 4, valor: element.combinado});}
        if (element.dosCifras) { detalles.push({code: 5, valor: element.dosCifras}); }
        if (element.unaCifra) { detalles.push({code: 6, valor: element.unaCifra}); }
      } else if (String(element.numero).length === 2) {
        if (element.dosCifras) { detalles.push({code: 5, valor: element.dosCifras}); }
        if (element.unaCifra) { detalles.push({code: 6, valor: element.unaCifra}); }
      } else if (String(element.numero).length === 1) {
        if (element.unaCifra) { detalles.push({code: 6, valor: element.unaCifra}); }
      }

      numeros[cont].tipoJuego = detalles;

      cont++;

    });

    return numeros

  }




  /**
   * @author Luis Hernandez
   * @description Metodo que se valida cuales fueron
   * las loterias seleccionadas y las manda para el carrito
   */
  obtenerLoteriasSeleccionadas(loterias) {
    const loteriasSeleccionadas = [];
    if(loterias){
      loterias.forEach(element => {
        if (element.checked) {
          loteriasSeleccionadas.push({
            idLoteria: element.idLoteria,
            codigo: element.codigo,
            nombre: element.nombre,
            nombreCorto: element.nombreCorto,
            telefono: element.telefono,
            idEstado: element.idEstado,
            idEmpresa: element.idEmpresa,
            idSorteo: element.idSorteo,
            idSorteoDetalle: element.idSorteoDetalle,
            horaSorteo:element.horaSorteo
          });
        }
      });
    }
    
    return loteriasSeleccionadas;
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
