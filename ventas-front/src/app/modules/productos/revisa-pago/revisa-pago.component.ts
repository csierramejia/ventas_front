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
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-revisa-pago',
  templateUrl: './revisa-pago.component.html',
  styleUrls: ['./revisa-pago.component.css'],
  providers: [ProductosService]
})
export class RevisaPagoComponent extends CommonComponent implements OnInit, OnDestroy  {

  @ViewChild(MenuCarritoComponent, {static: true}) menuCarrito: MenuCarritoComponent;
  

  // OJO ESTE PRODUCTO VA A SER CAMBIANTE SEGUN EL PRODUCTO
  producto = "";
  paySend = []
  productosChance = []
  subtotalGeneral = 0
  ivaGeneral = 0
  totalGeneral = 0
  efectivo = '';
  devuelta = 0
  ivaServicio = 0
  correoCliente = ''
  productoParent: string;
  verBotonFinalizar = false;


  constructor(
    private productosService: ProductosService,
    private router: Router,
    private routeActiv: ActivatedRoute,
    protected messageService: MessageService,
    private shellState: ShellState
  ) {
    super();
  }

  ngOnInit(): void {
    
    this.routeActiv.queryParams
      .filter(params => params.producto)
      .subscribe(params => {
        this.productoParent = params.producto;
        switch (this.productoParent) {
          case 'chance':
            this.producto = "CHANCE";
            break;
          case 'chance-millonario':
            this.producto = "CHANCE_MILLONARIO";
            break;
          case 'super-chance':
            this.producto = "SUPER_CHANCE";
            break;
          case 'super-astro':
            this.producto = "SUPER_ASTRO";
            break;
          default:
            break;
        }
        this.obtenerIva();
      }
    );

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
        switch (this.productoParent) {
          case 'chance':
            this.obtener_productos_operacion('chanceApuesta')
            break;
          case 'chance-millonario':
            this.obtener_productos_operacion('chanceApuestaMillonario')
            break;
          case 'super-chance':
            this.obtener_productos_operacion('superChanceApuesta')
            break;
          case 'super-astro':
            this.obtener_productos_operacion('superAstroApuesta')
            break;
          default:
            break;
        }
      },
      error => {
        console.log(error);
        this.messageService.add(MsjUtil.getToastErrorMedium(error));
      }
    );
  }


  obtener_productos_operacion(productoEvento) {

    this.productosChance = []
    this.efectivo = ''
    this.devuelta = 0
    const productosChanceConst = JSON.parse(localStorage.getItem(productoEvento))

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
          _id:element._id,
          
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
    this.devuelta = 0
    if(this.efectivo){
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
    } else {
      this.verBotonFinalizar = false;
      this.messageService.add(MsjUtil.getToastErrorMedium('El valor recibido no puede ser menor al total a pagar'));
    }
  }




  borrarApuesta(id) {
    switch (this.productoParent) {
      case 'chance':
        this.borrarApuestaOperacion(id, 'chanceApuesta', 'chance')
        break;
      case 'chance-millonario':
        this.borrarApuestaOperacion(id, 'chanceApuestaMillonario', 'chance-millonario')
        break;
      case 'super-chance':
        this.borrarApuestaOperacion(id, 'superChanceApuesta', 'super-chance')
        break;
      case 'super-astro':
        this.borrarApuestaOperacion(id, 'superAstroApuesta', 'super-astro')
        break;
      default:
        break;
    }
  }


  borrarApuestaOperacion(id, productoEvento, productoValidacion){
    const productosBorrar = JSON.parse(localStorage.getItem(productoEvento))
    const keyResponse = this.getKeyObject(id, productosBorrar);
    if ( keyResponse  !== -1 ) {
      productosBorrar.splice( keyResponse , 1 );
    }
    localStorage.setItem(productoEvento, JSON.stringify(productosBorrar));
    this.obtener_productos_operacion(productoValidacion);
  }

 

  depurarInfo(){
    switch (this.productoParent) {
      case 'chance':
        this.depurarInfoChance()
        break;
      case 'chance-millonario':
        this.depurarInfoChanceMillonario()
        break;
      case 'super-chance':
        this.depurarInfoSuperChance();
        break;
      case 'super-astro':
        this.depurarInfoSuperAstro();
        break;
      default:
        break;
    }
  }


  depurarInfoChance() {
    this.paySend = [];
    const productosDepurar = JSON.parse(localStorage.getItem('chanceApuesta'))

    for (let index = 0; index < productosDepurar.length; index++) {
      const bet = { bets:null, canal: 'WEB', dataPlayed:null, idCustomer:null, idUser:this.shellState.userAccount.auth.usuario.idUsuario, lotteries:null, producto:this.producto, valueBet:null, valueBetTotal:null, valueVat:null,idOficina:this.shellState.userAccount.auth.usuario.idOficina,idPuntoVenta:this.shellState.userAccount.auth.usuario.idPuntoVenta,idRollo:null,colillaActual:null, colilla:null, serieUno:null, serieDos:null};
      bet.lotteries = this.obtenerLoteriasSeleccionadas(productosDepurar[index].loterias)
      bet.bets = this.obtenerEstructuraDatosNumeros(productosDepurar[index].listaNumeros, productosDepurar[0].fechaSeleccionApuesta, bet.lotteries)
      bet.dataPlayed = productosDepurar[index].fechaActual
      bet.idCustomer = productosDepurar[index].clienteOperacion.idCustomer
      bet.valueBetTotal = Math.round(this.obtenerValorTotal(bet.bets, bet.lotteries.length))
      bet.valueBet = Math.round(this.obtenerIvaIteracion(bet.valueBetTotal));
      bet.valueVat = Math.round(bet.valueBetTotal - bet.valueBet);
      bet.idOficina = this.shellState.userAccount.auth.usuario.idOficina;
      bet.idPuntoVenta = this.shellState.userAccount.auth.usuario.idPuntoVenta;
      bet.idRollo = productosDepurar[index].idRollo;
      bet.colillaActual = productosDepurar[index].colillaActual;
      bet.colilla = productosDepurar[index].colilla;
      bet.serieUno = productosDepurar[index].serie;
      bet.serieDos = productosDepurar[index].colillaActual;
     // guardamos el correo del usuario (para enviar desplendible de pago)
      this.correoCliente = productosDepurar[index].clienteOperacion.correoCustomer
      this.paySend.push(bet);
    }
    this.hacerCompraServicio(this.paySend);
  }


  depurarInfoChanceMillonario() {

    this.paySend = [];
    const productosDepurar = JSON.parse(localStorage.getItem('chanceApuestaMillonario'))

    for (let index = 0; index < productosDepurar.length; index++) {
      const bet = { bets:null, canal: 'WEB', dataPlayed:null, idCustomer:null, idUser:this.shellState.userAccount.auth.usuario.idUsuario, lotteries:null, producto:this.producto, valueBet:null, valueBetTotal:null, valueVat:null,idOficina:this.shellState.userAccount.auth.usuario.idOficina,idPuntoVenta:this.shellState.userAccount.auth.usuario.idPuntoVenta,idRollo:null,colillaActual:null, colilla:null,serieUno:null, serieDos:null};
      bet.lotteries = this.obtenerLoteriasSeleccionadas(productosDepurar[index].loterias)

      bet.valueBet = Math.round(productosDepurar[index].apostado);
      bet.valueBetTotal = Math.round(productosDepurar[index].total);
      bet.valueVat = Math.round(productosDepurar[index].iva);
      bet.idOficina = this.shellState.userAccount.auth.usuario.idOficina;
      bet.idPuntoVenta = this.shellState.userAccount.auth.usuario.idPuntoVenta
      bet.idRollo = productosDepurar[index].idRollo;
      bet.colillaActual = productosDepurar[index].colillaActual;
      bet.colilla = productosDepurar[index].colilla;
      bet.serieUno = productosDepurar[index].serie;
      bet.serieDos = productosDepurar[index].colillaActual;

      bet.bets = this.obtenerEstructuraDatosNumerosChanceMillonario(productosDepurar[index].listaNumeros, productosDepurar[0].fechaSeleccionApuesta, bet.lotteries, bet.valueVat, bet.valueBetTotal)
      bet.dataPlayed = new Date(productosDepurar[index].fechaActual)
      bet.idCustomer = productosDepurar[index].clienteOperacion.idCustomer

      // guardamos el correo del usuario (para enviar desplendible de pago)
      this.correoCliente = productosDepurar[index].clienteOperacion.correoCustomer
      this.paySend.push(bet);
    }
    this.hacerCompraServicio(this.paySend);

  }



  depurarInfoSuperChance() {
    this.paySend = [];
    const productosDepurar = JSON.parse(localStorage.getItem('superChanceApuesta'))
    for (let index = 0; index < productosDepurar.length; index++) {
      const bet = { bets:null, canal: 'WEB', dataPlayed:null, idCustomer:null, idUser:this.shellState.userAccount.auth.usuario.idUsuario, lotteries:null, producto:this.producto, valueBet:null, valueBetTotal:null, valueVat:null,idOficina:this.shellState.userAccount.auth.usuario.idOficina,idPuntoVenta:this.shellState.userAccount.auth.usuario.idPuntoVenta};
      bet.lotteries = this.obtenerLoteriasSeleccionadas(productosDepurar[index].loterias)
      bet.valueBet = Math.round(productosDepurar[index].apostado);
      bet.valueBetTotal = Math.round(productosDepurar[index].total);
      bet.valueVat = Math.round(productosDepurar[index].iva);
      bet.idOficina = this.shellState.userAccount.auth.usuario.idOficina;
      bet.idPuntoVenta = this.shellState.userAccount.auth.usuario.idPuntoVenta
      bet.bets = this.obtener_estructura_datos_numeros_superchance(productosDepurar[index].listaNumeros, productosDepurar[0].fechaSeleccionApuesta, bet.lotteries, productosDepurar[index].listaModalidades, productosDepurar[index].colilla, productosDepurar[index].colillaActual, productosDepurar[index].idRollo, productosDepurar[index].serie)
      bet.dataPlayed = new Date(productosDepurar[index].fechaActual)
      bet.idCustomer = productosDepurar[index].clienteOperacion.idCustomer
      // guardamos el correo del usuario (para enviar desplendible de pago)
      this.correoCliente = productosDepurar[index].clienteOperacion.correoCustomer
      this.paySend.push(bet);
    }

    this.hacerCompraServicio(this.paySend);

  }


  depurarInfoSuperAstro() {
    this.paySend = [];
    const productosDepurar = JSON.parse(localStorage.getItem('superAstroApuesta'))
    for (let index = 0; index < productosDepurar.length; index++) {
      const bet = { bets:null, canal: 'WEB', dataPlayed:null, idCustomer:null, idUser:this.shellState.userAccount.auth.usuario.idUsuario, lotteries:null, producto:this.producto, valueBet:null, valueBetTotal:null, valueVat:null,idOficina:this.shellState.userAccount.auth.usuario.idOficina,idPuntoVenta:this.shellState.userAccount.auth.usuario.idPuntoVenta};
      bet.lotteries = this.obtenerLoteriasSeleccionadas(productosDepurar[index].loterias)
      bet.valueBet = Math.round(productosDepurar[index].apostado);
      bet.valueBetTotal = Math.round(productosDepurar[index].total);
      bet.valueVat = Math.round(productosDepurar[index].iva);
      bet.idOficina = this.shellState.userAccount.auth.usuario.idOficina;
      bet.idPuntoVenta = this.shellState.userAccount.auth.usuario.idPuntoVenta
      bet.bets = this.obtener_estructura_datos_numeros_superastro(productosDepurar[index].listaNumeros, productosDepurar[0].fechaSeleccionApuesta, bet.lotteries, this.limpiarArray(productosDepurar[index].listaValores), productosDepurar[index].colilla, productosDepurar[index].colillaActual, productosDepurar[index].idRollo, productosDepurar[index].serie, productosDepurar[index].listaModalidades)
      let dateparts = productosDepurar[index].fechaActual.split('/');
      bet.dataPlayed = new Date(dateparts[2], dateparts[1] - 1, dateparts[0])
      bet.idCustomer = productosDepurar[index].clienteOperacion.idCustomer
      // guardamos el correo del usuario (para enviar desplendible de pago)
      this.correoCliente = productosDepurar[index].clienteOperacion.correoCustomer
      this.paySend.push(bet);
    }
    this.hacerCompraServicio(this.paySend);
  }


  limpiarArray(array){
    const returnR = [];
    array.forEach(element => {
      if(element.valorUno){
        returnR.push({valorUno:parseInt(element.valorUno.replace("$", ""))})
      }
      if(element.valorDos){
        returnR.push({valorDos:parseInt(element.valorDos.replace("$", ""))})
      }
      if(element.valorTres){
        returnR.push({valorTres:parseInt(element.valorTres.replace("$", ""))})
      }
      if(element.valorCuatro){
        returnR.push({valorCuatro:parseInt(element.valorCuatro.replace("$", ""))})
      }
    });
    return returnR
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
          this.limpiarCarrito();
        } 
        else if(responseApuesta.mensaje){
          this.messageService.add(MsjUtil.getToastErrorLng(responseApuesta.mensaje));
        }
        else {
          this.messageService.add(MsjUtil.getToastErrorMedium('Problemas con la transacción'));
        }
      },
      error => {
        this.messageService.add(MsjUtil.getToastErrorLng(this.showMensajeError(error)));
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


  obtenerEstructuraDatosNumerosChanceMillonario(numerosIteras, fechaSorteo, loterias, valueVat, valueBetTotal){
    const numeros = [
      {
        apuestaA: null,apuestaB: null,apuestaC: null,apuestaD: null,apuestaE: null,details: null,fechaSorteo: new Date(fechaSorteo),
        lotteries: loterias,numberPlayed: null,numeroAstro: null,numeroSuper: null,valueBet: valueBetTotal,valueVat: valueVat,
        zignos: null
      }
    ];
    numerosIteras.forEach(element => {
      if (element.numeroFilaUno) {numeros[0].apuestaA = parseInt(element.numeroFilaUno)}
      if (element.numeroFilaDos) {numeros[0].apuestaB = parseInt(element.numeroFilaDos)}
      if (element.numeroFilaTres) {numeros[0].apuestaC = parseInt(element.numeroFilaTres)}
      if (element.numeroFilaCuatro) {numeros[0].apuestaD = parseInt(element.numeroFilaCuatro)}
      if (element.numeroFilaCinco) {numeros[0].apuestaE = parseInt(element.numeroFilaCinco)}
    })
    return numeros;
  }



  obtener_estructura_datos_numeros_superchance(numerosIteras, fechaSorteo, loterias, listaModalidades, colilla, colillaActual, idRollo, serie){


    const numeros = [];
    numerosIteras.forEach(element => {
      if (element.numeroFilaUno) { 
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          puestaC: null,
          apuestaD: null,
          apuestaE: null, 
          colilla: colilla, 
          colillaActual: colillaActual, 
          details: null,
          fechaSorteo: new Date(fechaSorteo),
          idRollo: idRollo, 
          idVendedor: this.shellState.userAccount.auth.usuario.idUsuario, 
          lotteries: loterias,
          numberPlayed: null,
          numeroAstro: null,
          numeroSuper: element.numeroFilaUno, 
          serie: serie, 
          serieDos: colillaActual, 
          serieUno: serie, 
          valueBet: listaModalidades[0].valoresModalidadesUno * loterias.length,
          valueVat: listaModalidades[0].valoresModalidadesUno * loterias.length - Math.round(this.obtenerIvaIteracion(listaModalidades[0].valoresModalidadesUno * loterias.length)),
          zignos: null
        })
      }
      if (element.numeroFilaDos) { 
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          puestaC: null,
          apuestaD: null,
          apuestaE: null, 
          colilla: colilla, 
          colillaActual: colillaActual, 
          details: null,
          fechaSorteo: new Date(fechaSorteo),
          idRollo: idRollo, 
          idVendedor: this.shellState.userAccount.auth.usuario.idUsuario, 
          lotteries: loterias,
          numberPlayed: null,
          numeroAstro: null,
          numeroSuper: element.numeroFilaDos, 
          serie: serie, 
          serieDos: colillaActual, 
          serieUno: serie, 
          valueBet: listaModalidades[1].valoresModalidadesDos * loterias.length,
          valueVat: listaModalidades[1].valoresModalidadesDos * loterias.length - Math.round(this.obtenerIvaIteracion(listaModalidades[1].valoresModalidadesDos * loterias.length)),
          zignos: null
        })
      }
      if (element.numeroFilaTres) { 
          numeros.push({
            apuestaA: null,
            apuestaB: null,
            puestaC: null,
            apuestaD: null,
            apuestaE: null, 
            colilla: colilla, 
            colillaActual: colillaActual,  
            details: null,
            fechaSorteo: new Date(fechaSorteo),
            idRollo: idRollo, 
            idVendedor: this.shellState.userAccount.auth.usuario.idUsuario, 
            lotteries: loterias,
            numberPlayed: null,
            numeroAstro: null,
            numeroSuper: element.numeroFilaTres, 
            serie: serie, 
            serieDos: colillaActual, 
            serieUno: serie, 
            valueBet: listaModalidades[2].valoresModalidadesTres * loterias.length,
            valueVat: listaModalidades[2].valoresModalidadesTres * loterias.length - Math.round(this.obtenerIvaIteracion(listaModalidades[2].valoresModalidadesTres * loterias.length)),
            zignos: null
        })
      }
      if (element.numeroFilaCuatro) { 
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          puestaC: null,
          apuestaD: null,
          apuestaE: null, 
          colilla: colilla, 
          colillaActual: colillaActual, 
          details: null,
          fechaSorteo: new Date(fechaSorteo),
          idRollo: idRollo,
          idVendedor: this.shellState.userAccount.auth.usuario.idUsuario, 
          lotteries: loterias,
          numberPlayed: null,
          numeroAstro: null,
          numeroSuper: element.numeroFilaCuatro, 
          serie: serie, 
          serieDos: colillaActual, 
          serieUno: serie, 
          valueBet: listaModalidades[3].valoresModalidadesCuatro * loterias.length,
          valueVat: listaModalidades[3].valoresModalidadesCuatro * loterias.length - Math.round(this.obtenerIvaIteracion(listaModalidades[3].valoresModalidadesCuatro * loterias.length)),
          zignos: null
        })
      }
      if (element.numeroFilaCinco) { 
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          puestaC: null,
          apuestaD: null,
          apuestaE: null, 
          colilla: colilla, 
          colillaActual: colillaActual,  
          details: null,
          fechaSorteo: new Date(fechaSorteo),
          idRollo: idRollo, 
          idVendedor: this.shellState.userAccount.auth.usuario.idUsuario,
          lotteries: loterias,
          numberPlayed: null,
          numeroAstro: null,
          numeroSuper: element.numeroFilaCinco, 
          serie: serie, 
          serieDos: colillaActual, 
          serieUno: serie, 
          valueBet: listaModalidades[4].valoresModalidadesCinco * loterias.length,
          valueVat: listaModalidades[4].valoresModalidadesCinco * loterias.length - Math.round(this.obtenerIvaIteracion(listaModalidades[4].valoresModalidadesCinco * loterias.length)),
          zignos: null
        })
      }
    });
    return numeros;
  }



  obtener_estructura_datos_numeros_superastro(numerosIteras, fechaSorteo, loterias, listaValores, colilla, colillaActual, idRollo, serie, listaModalidades){
    const numeros = [];
    numerosIteras.forEach(element => {
      if (element.numeroFilaUno) { 
        let signosArray = []
        if(listaModalidades[0].valoresModalidadesUno){
          if(listaModalidades[0].valoresModalidadesUno == 'all'){
            signosArray = [1,2,3,4,5,6,7,8,9,10,11,12,13]
          } else {
            signosArray.push(listaModalidades[0].valoresModalidadesUno)
          }
        }
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          puestaC: null,
          apuestaD: null,
          apuestaE: null, 
          colilla: colilla, 
          colillaActual: colillaActual, 
          details: null,
          fechaSorteo: new Date(fechaSorteo),
          idRollo: idRollo, 
          idVendedor: this.shellState.userAccount.auth.usuario.idUsuario, 
          lotteries: loterias,
          numberPlayed: null,
          numeroAstro: element.numeroFilaUno,
          numeroSuper: null, 
          serie: serie, 
          serieDos: colillaActual, 
          serieUno: serie, 
          valueBet: listaValores[0].valorUno * loterias.length,
          valueVat: listaValores[0].valorUno * loterias.length - Math.round(this.obtenerIvaIteracion(listaValores[0].valorUno * loterias.length)),
          zignos: signosArray
        })
      }
      if (element.numeroFilaDos) { 
        let signosArray = []
        if(listaModalidades[1].valoresModalidadesDos){
          if(listaModalidades[1].valoresModalidadesDos == 'all'){
            signosArray = [1,2,3,4,5,6,7,8,9,10,11,12,13]
          } else {
            signosArray.push(listaModalidades[1].valoresModalidadesDos)
          }
        }
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          puestaC: null,
          apuestaD: null,
          apuestaE: null, 
          colilla: colilla, 
          colillaActual: colillaActual, 
          details: null,
          fechaSorteo: new Date(fechaSorteo),
          idRollo: idRollo, 
          idVendedor: this.shellState.userAccount.auth.usuario.idUsuario, 
          lotteries: loterias,
          numberPlayed: null,
          numeroAstro: element.numeroFilaDos,
          numeroSuper: null, 
          serie: serie, 
          serieDos: colillaActual, 
          serieUno: serie, 
          valueBet: listaValores[1].valorDos * loterias.length,
          valueVat: listaValores[1].valorDos * loterias.length - Math.round(this.obtenerIvaIteracion(listaValores[1].valorDos * loterias.length)),
          zignos: signosArray
        })
      }
      if (element.numeroFilaTres) { 
          let signosArray = []
          if(listaModalidades[2].valoresModalidadesTres){
            if(listaModalidades[2].valoresModalidadesTres == 'all'){
              signosArray = [1,2,3,4,5,6,7,8,9,10,11,12,13]
            } else {
              signosArray.push(listaModalidades[2].valoresModalidadesTres)
            }
          }
          numeros.push({
            apuestaA: null,
            apuestaB: null,
            puestaC: null,
            apuestaD: null,
            apuestaE: null, 
            colilla: colilla, 
            colillaActual: colillaActual,  
            details: null,
            fechaSorteo: new Date(fechaSorteo),
            idRollo: idRollo, 
            idVendedor: this.shellState.userAccount.auth.usuario.idUsuario, 
            lotteries: loterias,
            numberPlayed: null,
            numeroAstro: element.numeroFilaTres,
            numeroSuper: null, 
            serie: serie, 
            serieDos: colillaActual, 
            serieUno: serie, 
            valueBet: listaValores[2].valorTres * loterias.length,
            valueVat: listaValores[2].valorTres * loterias.length - Math.round(this.obtenerIvaIteracion(listaValores[2].valorTres * loterias.length)),
            zignos: signosArray
        })
      }
      if (element.numeroFilaCuatro) { 
        let signosArray = []
        if(listaModalidades[3].valoresModalidadesCuatro){
          if(listaModalidades[3].valoresModalidadesCuatro == 'all'){
            signosArray = [1,2,3,4,5,6,7,8,9,10,11,12,13]
          } else {
            signosArray.push(listaModalidades[3].valoresModalidadesCuatro)
          }
        }
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          puestaC: null,
          apuestaD: null,
          apuestaE: null, 
          colilla: colilla, 
          colillaActual: colillaActual, 
          details: null,
          fechaSorteo: new Date(fechaSorteo),
          idRollo: idRollo,
          idVendedor: this.shellState.userAccount.auth.usuario.idUsuario, 
          lotteries: loterias,
          numberPlayed: null,
          numeroAstro: element.numeroFilaCuatro,
          numeroSuper: null, 
          serie: serie, 
          serieDos: colillaActual, 
          serieUno: serie, 
          valueBet: listaValores[3].valorCuatro * loterias.length,
          valueVat: listaValores[3].valorCuatro * loterias.length - Math.round(this.obtenerIvaIteracion(listaValores[3].valorCuatro * loterias.length)),
          zignos: signosArray
        })
      }
      
    });
    return numeros;
  }


  obtenerEstructuraDatosNumeros(numerosIteras, fechaSorteo, loterias){
    const numeros = [];
    numerosIteras.forEach(element => {
      if (element.numeroFilaUno) { 
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: element.numeroFilaUno,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: element.combinadoFilaUno,
          dosCifras: element.dosCifrasFilaUno,
          unaCifra: element.unaCifraFilaUno,
          valorDirecto: element.valorDirectoFilaUno,
        })
      }
      if (element.numeroFilaDos) { 
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: element.numeroFilaDos,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: element.combinadoFilaDos,
          dosCifras: element.dosCifrasFilaDos,
          unaCifra: element.unaCifraFilaDos,
          valorDirecto: element.valorDirectoFilaDos,
        })
      }
      if (element.numeroFilaTres) { 
          numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: element.numeroFilaTres,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: element.combinadoFilaTres,
          dosCifras: element.dosCifrasFilaTres,
          unaCifra: element.unaCifraFilaTres,
          valorDirecto: element.valorDirectoFilaTres
        })
      }
      if (element.numeroFilaCuatro) { 
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: element.numeroFilaCuatro,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: element.combinadoFilaCuatro,
          dosCifras: element.dosCifrasFilaCuatro,
          unaCifra: element.unaCifraFilaCuatro,
          valorDirecto: element.valorDirectoFilaCuatro,
        })
      }
      if (element.numeroFilaCinco) { 
        numeros.push({
          apuestaA: null,
          apuestaB: null,
          apuestaC: null,
          apuestaD: null,
          apuestaE: null,
          details: null,
          fechaSorteo: fechaSorteo,
          lotteries: loterias,
          numberPlayed: element.numeroFilaCinco,
          numeroAstro: null,
          numeroSuper: null,
          valueBet: null,
          valueVat: null,
          zignos: null,
          combinado: element.combinadoFilaCinco,
          dosCifras: element.dosCifrasFilaCinco,
          unaCifra: element.unaCifraFilaCinco,
          valorDirecto: element.valorDirectoFilaCinco,
        })
      }
    });
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
    switch (this.productoParent) {
      case 'chance':
        this.router.navigate([RouterConstant.NAVIGATE_CHANCE]);
        break;
      case 'chance-millonario':
        this.router.navigate([RouterConstant.NAVIGATE_CHANCE_MILLONARIO]);
        break;
      case 'super-chance':
        this.router.navigate([RouterConstant.NAVIGATE_SUPER_CHANCE]);
        break;
      case 'super-astro':
        this.router.navigate([RouterConstant.NAVIGATE_SUPER_ASTRO]);
        break;
      default:
        break;
    }
  }


  limpiarCarrito(){
    console.log(this.productoParent)
    switch (this.productoParent) {
      case 'chance':
        this.limpiarCarritoOperacion('chanceApuesta')
        break;
      case 'chance-millonario':
        this.limpiarCarritoOperacion('chanceApuestaMillonario')
        break;
      case 'super-chance':
        this.limpiarCarritoOperacion('superChanceApuesta')
        break;
      case 'super-astro':
        this.limpiarCarritoOperacion('superAstroApuesta')
        break;
      default:
        break;
    }
  }


  limpiarCarritoOperacion(productoEvento){
    this.paySend = []
    this.productosChance = []
    this.subtotalGeneral = 0
    this.ivaGeneral = 0
    this.totalGeneral = 0
    this.efectivo = ''
    this.devuelta = 0
    localStorage.removeItem(productoEvento);
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
      (error) => { this.messageService.add(MsjUtil.getToastErrorLng(this.showMensajeError(error))); }
    );
  }


  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

  
}
