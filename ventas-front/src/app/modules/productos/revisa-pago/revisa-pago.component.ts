import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RouterConstant } from '../../../constants/router.constant';
import { Router } from '@angular/router';
import { ProductosService } from '../productos.service';
import { MessageService } from 'primeng/api';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonComponent } from 'src/app/utilities/common.component';
import { NotificacionSoportePagoDTO } from 'src/app/dtos/correos/notificacion-soporte-pago.dto';
import { MenuCarritoComponent } from '../genericos/menu-carrito/menu-carrito.component';

@Component({
  selector: 'app-revisa-pago',
  templateUrl: './revisa-pago.component.html',
  styleUrls: ['./revisa-pago.component.css'],
  providers: [ProductosService]
})
export class RevisaPagoComponent extends CommonComponent implements OnInit, OnDestroy  {

  @ViewChild(MenuCarritoComponent, {static: true}) menuCarrito: MenuCarritoComponent;
  

  // OJO ESTE PRODUCTO VA A SER CAMBIANTE SEGUN EL PRODUCTO
  // NOTA : DE MOMENTO SE VA A DEJAR QUEMADO COMO CHANCE PERO CUANDO ENTREN LOS DEMAS PRODUCTOS HAY QUE SETEARLO
  // producto = null;
  producto = "CHANCE";
  paySend = []
  productosChance = []
  subtotalGeneral = 0
  ivaGeneral = 0
  totalGeneral = 0
  efectivo = '';
  devuelta = 0
  ivaServicio = 0
  correoCliente = ''

  verBotonFinalizar = false;


  constructor(
    private productosService: ProductosService,
    private router: Router,
    protected messageService: MessageService,
    private shellState: ShellState
  ) {
    super();
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
        this.messageService.add(MsjUtil.getToastErrorMedium(error));
      }
    );
  }


  obtenerProductosChance() {

    this.productosChance = []
    this.efectivo = ''
    this.devuelta = 0
    const productosChanceConst = JSON.parse(localStorage.getItem('chanceApuesta'))

    // console.log(productosChanceConst);

    if(productosChanceConst){
      productosChanceConst.forEach(element => {
        this.productosChance.push({
          apostado:Math.round(element.apostado),
          colilla:element.colilla,
          fechaActual:element.fechaActual,
          iva:Math.round(element.iva),
          listaNumeros:this.concatenarNumeros(element.listaNumeros),
          loterias:this.concatenarLoterias(element.loterias),
          total:Math.round(element.total),
          _id:element._id
        });
      });
    }

    

    this.calcularValores();

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
        this.totalGeneral = Math.round(this.totalGeneral + element.total);
        this.subtotalGeneral = Math.round(this.subtotalGeneral + element.apostado)
        this.ivaGeneral = Math.round(this.ivaGeneral + element.iva)
      });
    }
    
  }



  calcularDevuelta(){
    let efectivoCalcular = parseInt(this.efectivo);
    if(!efectivoCalcular){
      efectivoCalcular = 0
    }
    this.devuelta = efectivoCalcular - this.totalGeneral
    if(this.devuelta >= 0){
      this.verBotonFinalizar = true;
    } else {
      this.verBotonFinalizar = false;
      this.messageService.add(MsjUtil.getToastErrorMedium('El valor recibido no puede ser menor al total a pagar'));
    }
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
    this.paySend = [];
    const productosDepurar = JSON.parse(localStorage.getItem('chanceApuesta'))
    for (let index = 0; index < productosDepurar.length; index++) {
      const bet = { bets:null, canal: 'WEB', dataPlayed:null, idCustomer:null, idUser:this.shellState.userAccount.auth.usuario.idUsuario, lotteries:null, producto:this.producto, valueBet:null, valueBetTotal:null, valueVat:null};
      bet.lotteries = this.obtenerLoteriasSeleccionadas(productosDepurar[index].loterias)
      bet.bets = this.obtenerEstructuraDatosNumeros(productosDepurar[index].listaNumeros, productosDepurar[0].fechaSeleccionApuesta, bet.lotteries)
      bet.dataPlayed = productosDepurar[index].fechaActual
      bet.idCustomer = productosDepurar[index].clienteOperacion.idCustomer
      bet.valueBetTotal = Math.round(this.obtenerValorTotal(bet.bets, bet.lotteries.length))
      bet.valueBet = Math.round(this.obtenerIvaIteracion(bet.valueBetTotal));
      bet.valueVat = Math.round(bet.valueBetTotal - bet.valueBet);
      // guardamos el correo del usuario (para enviar desplendible de pago)
      this.correoCliente = productosDepurar[index].clienteOperacion.correoCustomer
      this.paySend.push(bet);
    }
    this.hacerCompraServicio(this.paySend);
  }


  obtenerIvaIteracion(total){
    const ivaNv = this.ivaServicio / 100 + 1
    return total / ivaNv;
  }


  hacerCompraServicio(paySend){
    this.productosService.registrarApuestas(paySend).subscribe(
      apuestaData => {
        const responseApuesta: any = apuestaData;
        if (responseApuesta.exito) {

          // se muestra el mensaje exitoso
          this.messageService.add(MsjUtil.getToastSuccessMedium('Transacción exitosa'));

          // se envia la notificacion
          if (this.correoCliente) {
            const notificacion: NotificacionSoportePagoDTO = apuestaData.notificacionSoportePago;
            if (notificacion) {
              notificacion.correoDestino = this.correoCliente;
              notificacion.idUsuario = this.shellState.userAccount.auth.usuario.idUsuario;
              this.enviarNotificacionSoportePago(notificacion);
            }
          }

          // se limpia la data ingresada
          // this.cleanCartValues();
          // this.creatingBet.emit(true);
          this.limpiarCarrito();
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

  obtenerValorTotal(bets, cantidadLoterias){
    let sumaTotal = 0
    for (let index = 0; index < bets.length; index++) {
      for (let ind = 0; ind < bets[index].details.length; ind++){
        sumaTotal = sumaTotal + parseInt(bets[index].details[ind].valor)
      }
    }
    return cantidadLoterias * sumaTotal;
  }


  obtenerEstructuraDatosNumeros(numerosIteras, fechaSorteo, loterias){

    const numeros = [];

    for (let index = 0; index < numerosIteras.length; index++) {

      if(index === 0){
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: numerosIteras[index].numeroFilaUno,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: numerosIteras[index].combinadoFilaUno,
          dosCifras: numerosIteras[index].dosCifrasFilaUno,
          unaCifra: numerosIteras[index].unaCifraFilaUno,
          valorDirecto: numerosIteras[index].valorDirectoFilaUno,
        })
      }

      if(index === 1){
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: numerosIteras[index].numeroFilaDos,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: numerosIteras[index].combinadoFilaDos,
          dosCifras: numerosIteras[index].dosCifrasFilaDos,
          unaCifra: numerosIteras[index].unaCifraFilaDos,
          valorDirecto: numerosIteras[index].valorDirectoFilaDos,
          
        })
      }

      if(index === 2){
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: numerosIteras[index].numeroFilaTres,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: numerosIteras[index].combinadoFilaTres,
          dosCifras: numerosIteras[index].dosCifrasFilaTres,
          unaCifra: numerosIteras[index].unaCifraFilaTres,
          valorDirecto: numerosIteras[index].valorDirectoFilaTres
        })
      }

      if(index === 3){
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: numerosIteras[index].numeroFilaCuatro,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: numerosIteras[index].combinadoFilaCuatro,
          dosCifras: numerosIteras[index].dosCifrasFilaCuatro,
          unaCifra: numerosIteras[index].unaCifraFilaCuatro,
          valorDirecto: numerosIteras[index].valorDirectoFilaCuatro,
        })
      }

      if(index === 4){
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: numerosIteras[index].numeroFilaCinco,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: numerosIteras[index].combinadoFilaCinco,
          dosCifras: numerosIteras[index].dosCifrasFilaCinco,
          unaCifra: numerosIteras[index].unaCifraFilaCinco,
          valorDirecto: numerosIteras[index].valorDirectoFilaCinco,
        })
      }

    }

    return this.obtenerTipoJuego(numeros);

  }


  obtenerTipoJuego(numeros){

    let cont = 0

    numeros.forEach(element => {
      const detalles = []

      if (String(element.numberPlayed).length === 4) {
        if (element.valorDirecto) { detalles.push({code: 1, valor: element.valorDirecto});}
        if (element.combinado) { detalles.push({code: 2, valor: element.combinado});}
        if (element.dosCifras) { detalles.push({code: 5, valor: element.dosCifras}); }
        if (element.unaCifra) { detalles.push({code: 6, valor: element.unaCifra}); }
      } else if (String(element.numberPlayed).length === 3) {
        if (element.valorDirecto) { detalles.push({code: 3, valor: element.valorDirecto});}
        if (element.combinado) { detalles.push({code: 4, valor: element.combinado});}
        if (element.dosCifras) { detalles.push({code: 5, valor: element.dosCifras}); }
        if (element.unaCifra) { detalles.push({code: 6, valor: element.unaCifra}); }
      } else if (String(element.numberPlayed).length === 2) {
        if (element.dosCifras) { detalles.push({code: 5, valor: element.dosCifras}); }
        if (element.unaCifra) { detalles.push({code: 6, valor: element.unaCifra}); }
      } else if (String(element.numberPlayed).length === 1) {
        if (element.unaCifra) { detalles.push({code: 6, valor: element.unaCifra}); }
      }
      numeros[cont].details = detalles;
      delete numeros[cont].combinado
      delete numeros[cont].dosCifras
      delete numeros[cont].unaCifra
      delete numeros[cont].valorDirecto
      cont++;
    });
    return numeros;
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


  limpiarCarrito(){
    this.paySend = []
    this.productosChance = []
    this.subtotalGeneral = 0
    this.ivaGeneral = 0
    this.totalGeneral = 0
    this.efectivo = ''
    this.devuelta = 0
    localStorage.removeItem('chanceApuesta');
    // this.menuCarrito.refrescarCarrito();
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


  /**
   * Permite enviar la notificacion de soporte de pago
   */
  private enviarNotificacionSoportePago(data: NotificacionSoportePagoDTO): void {
    this.productosService.enviarNotificacionSoportePagoChance(data).subscribe(
      (response) => {},
      (error) => { this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error))); }
    );
  }


  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

  


}
