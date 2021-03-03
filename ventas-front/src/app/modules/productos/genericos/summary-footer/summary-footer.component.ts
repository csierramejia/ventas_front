import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, Input } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductosService } from '../../productos.service';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonService } from 'src/app/utilities/common.service';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../../constants/router.constant';
import { ConfirmacionAgregarCarritoComponent } from '../../genericos/confirmacion-agregar-carrito/confirmacion-agregar-carrito.component';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { SessionStoreUtil } from 'src/app/utilities/session-store.util';
import { TipoEventoConstant } from 'src/app/constants/tipo-evento.constant';
import { FiltroOperacionDTO} from 'src/app/dtos/transversal/filtro-operacion.dto';
import { RolloColillaDTO} from 'src/app/dtos/transversal/rollo-colilla.dto'
import { PapeleriaRolloDTO } from 'src/app/dtos/transversal/papeleria-rollo.dto';




@Component({
  selector: 'app-summary-footer',
  templateUrl: './summary-footer.component.html',
  styleUrls: ['./summary-footer.component.css'],
  providers: [ProductosService, CommonService]
})

export class SummaryFooterComponent extends CommonComponent implements OnInit, OnDestroy  {

  @Output() borrarTodoReset: EventEmitter<any> = new EventEmitter();
  @Output() agregarProductos: EventEmitter<any> = new EventEmitter();
  @ViewChild(ConfirmacionAgregarCarritoComponent) confirmacionAgregar: ConfirmacionAgregarCarritoComponent;
  @Input() productoParent: string;
 /** Dto que contiene los datos de la autenticacion */
  private auth: AutenticacionResponseDTO;

  public rolloColilla : RolloColillaDTO;


  clienteOperacion = {correoCustomer:null, idCustomer:null, nombreCliente:null, numeroDocumento:null, tipoDocumento:null}
  edit = false;
  infoEdit:any;
  inputVat = 0;
  valueBet = 0;
  valueVat = 0;
  valueBetTotal = 0;
  listaNumeros = [];
  producto = null;
  selectedCifras: any;
  loterias = [];
  loteriaSeleccionadas = [];
  colilla = '';
  fechaSeleccionApuesta: Date;
  verConfirmacionPopap = false;
  displayModalSerie = false;
  hoy = new Date();
  fechaActual = this.hoy.getDate() + '/' + (this.hoy.getMonth() + 1) + '/' + this.hoy.getFullYear();

  

  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private shellState: ShellState,
    private commonService: CommonService
  ) {
    super();
      // se obtiene los datos de la autenticacion
    this.auth = SessionStoreUtil.auth(TipoEventoConstant.GET);
    this.obtenerColillaActual();
   }

  ngOnInit(): void {
    this.obtenerIva();
  }


  obtenerColilla(){
    

    if(this.productoParent === 'chance') {
      this.productosService.consultarNumeroSerieApuesta("CHANCE").subscribe(
        numeroSerie => {
          this.colilla=numeroSerie.codigo;
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    } else if(this.productoParent === 'chance-millonario'){
      this.productosService.consultarNumeroSerieApuesta("CHANCE MILLONARIO").subscribe(
        numeroSerie => {
          this.colilla=numeroSerie.codigo;
        },
        error => {
          this.messageService.add(MsjUtil.getMsjError(this.showMensajeError(error)));
        }
      );
    }

  }

/**
  * Método encargado de consulta la última colilla para venta
  */
  public obtenerColillaActual(): void {
    const filtro = new FiltroOperacionDTO;
    filtro.idRollo = this.auth.usuario.idRollo;
    filtro.idVendedor = this.auth.usuario.idUsuario;
    if (filtro.idRollo) {
      this.productosService.consultarColilla(filtro).subscribe(
        colilla => {
          this.rolloColilla = new RolloColillaDTO;
          this.rolloColilla = colilla;
          this.colilla = colilla.serie + colilla.rangoColilla;
          if ( this.rolloColilla.colillaActual > this.rolloColilla.nroFinalSerie ) {
            this.displayModalSerie = true;
  
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
    this.loterias = event.loterias;
    this.loteriaSeleccionadas = this.get_lotteriesSelected()

    this.fechaSeleccionApuesta = event.fechaSeleccionApuesta
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


  setCliente(event) {
    this.clienteOperacion = event;
    let chanceApuesta = JSON.parse(localStorage.getItem('chanceApuesta')) 
    if(chanceApuesta){
      if(chanceApuesta.length > 0){
        for (let index = 0; index < chanceApuesta.length; index++) {
          chanceApuesta[index].clienteOperacion = this.clienteOperacion;
        }
        localStorage.setItem('chanceApuesta', JSON.stringify(chanceApuesta));
      }
    }
  }




  setModalidad(event) {
    this.valueBetTotal = event.modalidad;
    this.selectedCifras = event.selectedCifras;
    this.obtenerValoresTotales();
  }




  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de recalcular el valor de la apuesta
   */
  obtenerValoresTotales(): void {
    switch (this.productoParent) {
      case 'chance':
        this.obtenerValoresTotalesChance();
        break;
      case 'chance-millonario':
        this.obtenerValoresTotalesChanceMillonario();
        break;
      default:
        break;
    }
  }


  obtenerValoresTotalesChance(){

    this.valueVat = 0;
    this.valueBetTotal = 0;
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

    
    if(this.loterias){
      const ivaNv = this.inputVat / 100 + 1
      this.valueBetTotal = (this.loteriaSeleccionadas.length * valorSumado);
      this.valueBet = this.valueBetTotal / ivaNv;
      this.valueVat = this.valueBetTotal - this.valueBet;
    }

  }



  obtenerValoresTotalesChanceMillonario(){
    if(this.loterias){
      const ivaNv = this.inputVat / 100 + 1
      this.valueBet = this.valueBetTotal / ivaNv;
      this.valueVat = this.valueBetTotal - this.valueBet;
    }
  }


  limpiar(){
    this.valueVat = 0;
    this.valueBetTotal = 0;
    this.valueBet = 0;
    // let valorSumado = 0;
  }


  agregarCarritoF(): void { 

    switch (this.productoParent) {
      case 'chance':
        this.agregarCarritoFChance();
        break;
      case 'chance-millonario':
        this.agregarCarritoFChanceMillonario();
        break;
      default:
        break;
    }

  }


  agregarCarritoFChance(): void {
    const listaNumeros = this.obtenerFilasConApuesta(this.listaNumeros)

    if(this.validarCeros(listaNumeros)){
      this.messageService.add(MsjUtil.getToastErrorMedium('Usted no puede colocar valores en 0'));
    } else {
      if(this.colilla && this.fechaActual && this.loteriaSeleccionadas.length > 0 && listaNumeros.length > 0) {
        if(this.edit){
          this.confirmacionAgregar.isCreate = false;
          this.verConfirmacionPopap = true;
          this.confirmacionAgregar.colilla = this.colilla
          this.confirmacionAgregar.numeros = this.concatenarNumeros(listaNumeros)
          this.confirmacionAgregar.loterias = this.concatenarLoterias(this.loterias)
          this.confirmacionAgregar.apostado = Math.round(this.valueBet)
          this.confirmacionAgregar.iva = Math.round(this.valueVat)
          this.confirmacionAgregar.total = Math.round(this.valueBetTotal)
          this.confirmacionAgregar.idRollo = this.auth.usuario.idRollo;
          this.confirmacionAgregar.rolloColilla =  this.rolloColilla;
          this.confirmacionAgregar.idUsuario = this.auth.usuario.idUsuario;
        } else {
          this.confirmacionAgregar.isCreate = true;
          this.verConfirmacionPopap = true;
          this.confirmacionAgregar.colilla = this.colilla
          this.confirmacionAgregar.numeros = this.concatenarNumeros(listaNumeros)
          this.confirmacionAgregar.loterias = this.concatenarLoterias(this.loterias)
          this.confirmacionAgregar.apostado = Math.round(this.valueBet)
          this.confirmacionAgregar.iva = Math.round(this.valueVat)
          this.confirmacionAgregar.total = Math.round(this.valueBetTotal)
          this.confirmacionAgregar.idRollo = this.auth.usuario.idRollo;
          this.confirmacionAgregar.rolloColilla =  this.rolloColilla;
          this.confirmacionAgregar.idUsuario = this.auth.usuario.idUsuario;
          if (JSON.parse(localStorage.getItem('chanceApuesta')) && JSON.parse(localStorage.getItem('chanceApuesta')).length > 0) {
            const iteracionLocalStorageProductos = JSON.parse(localStorage.getItem('chanceApuesta'));
            let index = iteracionLocalStorageProductos.length - 1
            let colillaActual = iteracionLocalStorageProductos[index].colillaActual;
            colillaActual++;
            this.confirmacionAgregar.rolloColilla.colillaActual = colillaActual;
            const colilla = iteracionLocalStorageProductos[index].serie + String(colillaActual).padStart(7, '0');
            this.confirmacionAgregar.colilla = colilla;
            this.colilla = colilla;
           }
        }
      } else {
        this.messageService.add(MsjUtil.getToastErrorMedium('Valide que esta gestionando los campos necesarios para realizar la apuesta'));
      }
    }
  }



  agregarCarritoFChanceMillonario(): void {
    const listaNumeros = this.obtenerFilasConApuesta(this.listaNumeros)

    

    if(this.validarCeros(listaNumeros)){
      this.messageService.add(MsjUtil.getToastErrorMedium('Usted no puede colocar valores en 0'));
    } else {
      if(this.colilla && this.fechaActual && this.loteriaSeleccionadas.length === 2 && listaNumeros.length > 0) {

        if(this.edit){
          this.confirmacionAgregar.isCreate = false;
          this.verConfirmacionPopap = true;
          this.confirmacionAgregar.colilla = this.colilla
          this.confirmacionAgregar.numeros = this.concatenarNumeros(listaNumeros)
          this.confirmacionAgregar.loterias = this.concatenarLoterias(this.loterias)
          this.confirmacionAgregar.apostado = Math.round(this.valueBet)
          this.confirmacionAgregar.iva = Math.round(this.valueVat)
          this.confirmacionAgregar.total = Math.round(this.valueBetTotal)
        } else {
          this.confirmacionAgregar.isCreate = true;
          this.verConfirmacionPopap = true;
          this.confirmacionAgregar.colilla = this.colilla
          this.confirmacionAgregar.numeros = this.concatenarNumeros(listaNumeros)
          this.confirmacionAgregar.loterias = this.concatenarLoterias(this.loterias)
          this.confirmacionAgregar.apostado = Math.round(this.valueBet)
          this.confirmacionAgregar.iva = Math.round(this.valueVat)
          this.confirmacionAgregar.total = Math.round(this.valueBetTotal)
          this.confirmacionAgregar.idRollo = this.auth.usuario.idRollo;
          this.confirmacionAgregar.rolloColilla =  this.rolloColilla;
          this.confirmacionAgregar.idUsuario = this.auth.usuario.idUsuario;
          if (JSON.parse(localStorage.getItem('chanceApuestaMillonario')) && JSON.parse(localStorage.getItem('chanceApuestaMillonario')).length > 0) {
            const iteracionLocalStorageProductos = JSON.parse(localStorage.getItem('chanceApuestaMillonario'));
            let index = iteracionLocalStorageProductos.length - 1;
            let colillaActual = iteracionLocalStorageProductos[index].colillaActual;
            colillaActual++;
            this.confirmacionAgregar.rolloColilla.colillaActual = colillaActual;
            const colilla = iteracionLocalStorageProductos[index].serie + String(colillaActual).padStart(7, '0');
            this.confirmacionAgregar.colilla = colilla;
            this.colilla = colilla;
           }
        }
      } else {
        this.messageService.add(MsjUtil.getToastErrorMedium('Valide que esta gestionando los campos necesarios para realizar la apuesta'));
      }
    }
  }


  /**
   * @author Luis Fernando Hernandez
   * @description Metodo que se encarga
   * de validar si viene al algun valor en 0
   */
  validarCeros(listaNumeros){

    let valorCero = false;
    listaNumeros.forEach(element => {
      if (parseInt(element.valorDirectoFilaUno) <= 0) { valorCero = true;}
      if (parseInt(element.combinadoFilaUno) <= 0) { valorCero = true; }
      if (parseInt(element.dosCifrasFilaUno) <= 0) { valorCero = true; }
      if (parseInt(element.unaCifraFilaUno) <= 0) { valorCero = true; }

      if (parseInt(element.valorDirectoFilaDos) <= 0) { valorCero = true;}
      if (parseInt(element.combinadoFilaDos) <= 0) { valorCero = true; }
      if (parseInt(element.dosCifrasFilaDos) <= 0) { valorCero = true; }
      if (parseInt(element.unaCifraFilaDos) <= 0) { valorCero = true; }

      if (parseInt(element.valorDirectoFilaTres) <= 0) { valorCero = true;}
      if (parseInt(element.combinadoFilaTres) <= 0) { valorCero = true; }
      if (parseInt(element.dosCifrasFilaTres) <= 0) { valorCero = true; }
      if (parseInt(element.unaCifraFilaTres) <= 0) { valorCero = true; }

      if (parseInt(element.valorDirectoFilaCuatro) <= 0) { valorCero = true;}
      if (parseInt(element.combinadoFilaCuatro) <= 0) { valorCero = true; }
      if (parseInt(element.dosCifrasFilaCuatro) <= 0) { valorCero = true; }
      if (parseInt(element.unaCifraFilaCuatro) <= 0) { valorCero = true; }

      if (parseInt(element.valorDirectoFilaCinco) <= 0) { valorCero = true;}
      if (parseInt(element.combinadoFilaCinco) <= 0) { valorCero = true; }
      if (parseInt(element.dosCifrasFilaCinco) <= 0) { valorCero = true; }
      if (parseInt(element.unaCifraFilaCinco) <= 0) { valorCero = true; }
    });
    return valorCero;
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


  cleanFooter(){
    this.edit = false
    delete this.infoEdit
    this.inputVat = 0;
    this.valueBet = 0;
    this.valueVat = 0;
    this.valueBetTotal = 0;
    this.listaNumeros = [];
    this.loterias = [];
    this.loteriaSeleccionadas = [];
  }


  /**
   * @author Luis Hernandez
   * @param id
   * @description metodo que se encarga
   * de buscar el punto dentro del array
   * de un producto
   */
  getKeyObject(_id, array) {
    return array.map((e) => {
      return e._id;
    }).indexOf(_id);
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


  editarProducto(event){
    switch (this.productoParent) {
      case 'chance':
        this.editarProductoChance(event);
        break;
      case 'chance-millonario':
        this.editarProductoChanceMillonario(event);
        break;
      default:
        break;
    }
  }



  editarProductoChance(event){
    this.edit = true;
    const buscarApuestasEditar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const apuestaEditar = buscarApuestasEditar.filter(buscarApuestaEditar => buscarApuestaEditar._id == event._id);
    this.infoEdit = apuestaEditar;
    this.colilla = apuestaEditar[0].colilla
    this.fechaActual = apuestaEditar[0].fechaActual
  }



  editarProductoChanceMillonario(event){
    
    this.edit = true;
    const buscarApuestasEditar = JSON.parse(localStorage.getItem('chanceApuestaMillonario'))
    const apuestaEditar = buscarApuestasEditar.filter(buscarApuestaEditar => buscarApuestaEditar._id == event._id);
    this.infoEdit = apuestaEditar;
    this.colilla = apuestaEditar[0].colilla
    this.fechaActual = apuestaEditar[0].fechaActual

    // estar pendiente de estas asignaciones de variables !!
    this.valueBet = apuestaEditar[0].apostado
    this.valueVat = apuestaEditar[0].iva
    this.valueBetTotal = apuestaEditar[0].total
    // estar pendiente de estas asignaciones de variables !!
  }



  /**
   * @author Luis Hernandez
   * @description Metodo que se valida cuales fueron
   * las loterias seleccionadas y las manda para el carrito
   */
  get_lotteriesSelected() {
    const loteriasSeleccionadas = [];
    if(this.loterias){
      this.loterias.forEach(element => {
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



   irResumen() {
    switch (this.productoParent) {
      case 'chance':
        this.irResumenChance();
        break;
      case 'chance-millonario':
        this.irResumenChanceMillonario();
        break;
      default:
        break;
    }
  }


  irResumenChance() {
    let numeros = this.obtenerFilasConApuesta(this.listaNumeros);
    let loterias = this.get_lotteriesSelected();
    if(numeros.length > 0 || loterias.length > 0) {
      this.messageService.add(MsjUtil.getMsjError('Por favor termine de diligenciar los campos o limpie el formulario para avanzar'));
    } else {
      if(JSON.parse(localStorage.getItem('chanceApuesta')) != null) {
        if( JSON.parse(localStorage.getItem('chanceApuesta')).length > 0 ) {
          this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO], { queryParams: { producto: 'chance' } });
        } else {
          this.messageService.add(MsjUtil.getMsjError('no hay apuestas agregadas'));
        }
      } else {
          this.messageService.add(MsjUtil.getMsjError('no hay apuestas agregadas'));
      }
    }
  }


  irResumenChanceMillonario() {
    let numeros = this.obtenerFilasConApuesta(this.listaNumeros);
    let loterias = this.get_lotteriesSelected();
    if(numeros.length > 0 || loterias.length > 0) {
      this.messageService.add(MsjUtil.getMsjError('Por favor termine de diligenciar los campos o limpie el formulario para avanzar'));
    } else {
      if(JSON.parse(localStorage.getItem('chanceApuestaMillonario')) != null){
        if( JSON.parse(localStorage.getItem('chanceApuestaMillonario')).length > 0 ) {
          this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO], { queryParams: { producto: 'chance-millonario' } });
        } else {
          this.messageService.add(MsjUtil.getMsjError('no hay apuestas agregadas'));
        }
      } else {
          this.messageService.add(MsjUtil.getMsjError('no hay apuestas agregadas'));
      }
    }
  }



  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se encarga de
   * recibir el false que emite el componente
   * que contiene el html del modal de confirmacion (edit- create)
   */
  closeModal(event): void {
    this.verConfirmacionPopap = event;
  }



  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se encarga de recibir
   * el evento de crear o edit para agregar al carrito el producto
   */
  eventoCrearEditar (event): void {
    switch (this.productoParent) {
      case 'chance':
        this.eventoCrearEditarChance();
        break;
      case 'chance-millonario':
        this.eventoCrearEditarChanceMillonario();
        break;
      default:
        break;
    }
  }


  eventoCrearEditarChanceMillonario(): void {

    this.confirmacionAgregar.isCreate = false;
    this.verConfirmacionPopap = false;
    const listaNumeros = this.obtenerFilasConApuesta(this.listaNumeros)

    if(this.edit){
      const productosEditar = {
        _id: this.infoEdit[0]._id,
        colilla: this.colilla,
        fechaActual: this.fechaActual,
        loterias: this.loterias,
        apostado: this.valueBet,
        iva: this.valueVat,
        total: this.valueBetTotal,
        listaNumeros:listaNumeros,
        clienteOperacion:this.clienteOperacion,
        selectedCifras: this.selectedCifras,
        fechaSeleccionApuesta:this.fechaSeleccionApuesta,
        serie:  this.rolloColilla.serie,
        colillaActual: this.rolloColilla.colillaActual,
        idRollo:  this.auth.usuario.idRollo,
        idVendedor: this.auth.usuario.idUsuario,
      }

      let chanceApuesta:any = JSON.parse(localStorage.getItem('chanceApuestaMillonario'));

      if (chanceApuesta[0]) {
        let actualizarCliente = chanceApuesta      
        for (let index = 0; index < actualizarCliente.length; index++) {
          actualizarCliente[index].clienteOperacion = this.clienteOperacion;
        }
        localStorage.setItem('chanceApuestaMillonario', JSON.stringify(actualizarCliente));
        chanceApuesta = JSON.parse(localStorage.getItem('chanceApuestaMillonario'));
      }

      const keyResponse = this.getKeyObject(this.infoEdit[0]._id, chanceApuesta);
      chanceApuesta[keyResponse]._id = productosEditar._id
      chanceApuesta[keyResponse].colilla = productosEditar.colilla
      chanceApuesta[keyResponse].fechaActual = productosEditar.fechaActual
      chanceApuesta[keyResponse].loterias = productosEditar.loterias
      chanceApuesta[keyResponse].apostado = productosEditar.apostado
      chanceApuesta[keyResponse].iva = productosEditar.iva
      chanceApuesta[keyResponse].total = productosEditar.total
      chanceApuesta[keyResponse].listaNumeros = productosEditar.listaNumeros
      chanceApuesta[keyResponse].fechaSeleccionApuesta = productosEditar.fechaSeleccionApuesta
      localStorage.setItem('chanceApuestaMillonario', JSON.stringify(chanceApuesta));
      this.cleanFooter()
      this.agregarProductos.emit(true);
      this.borrarTodoReset.emit(true);
    } else {

      const productosAgregar = {
        _id: 'bet_' + Math.floor(Math.random() * 999999),
        colilla: this.colilla,
        fechaActual: this.fechaActual,
        loterias: this.loterias,
        apostado: this.valueBet,
        iva: this.valueVat,
        total: this.valueBetTotal,
        listaNumeros:listaNumeros,
        clienteOperacion:this.clienteOperacion,
        selectedCifras: this.selectedCifras,
        fechaSeleccionApuesta:this.fechaSeleccionApuesta,
        serie:  this.rolloColilla.serie,
        colillaActual: this.rolloColilla.colillaActual,
        idRollo:  this.auth.usuario.idRollo,
        idVendedor: this.auth.usuario.idUsuario,
        
      }

      let chanceApuestaMillonario = localStorage.getItem('chanceApuestaMillonario');

      if(JSON.parse(chanceApuestaMillonario) != null){
        if (JSON.parse(chanceApuestaMillonario)[0]) {
          let actualizarCliente = JSON.parse(chanceApuestaMillonario)          
          for (let index = 0; index < actualizarCliente.length; index++) {
            actualizarCliente[index].clienteOperacion = this.clienteOperacion;
          }
          localStorage.setItem('chanceApuestaMillonario', JSON.stringify(actualizarCliente));
          chanceApuestaMillonario = localStorage.getItem('chanceApuestaMillonario');
        }
      }

      if(chanceApuestaMillonario === null) {
        const arrayproductosAgregar = []
        arrayproductosAgregar.push(productosAgregar)
        localStorage.setItem('chanceApuestaMillonario', JSON.stringify(arrayproductosAgregar));
      } else {
        const chanceAp = JSON.parse(localStorage.getItem('chanceApuestaMillonario'));
        chanceAp.push(productosAgregar);
        localStorage.setItem('chanceApuestaMillonario', JSON.stringify(chanceAp));
      }
      this.agregarProductos.emit(true);
      this.borrarTodoReset.emit(true);
      
    }


    //////////////////////////////////////
    ///////////// ACA SUBCR /////////////
    this.shellState.enviarEventoCarrito(true);

    this.valueVat = 0;
    this.valueBetTotal = 0;



  }



  eventoCrearEditarChance(): void {

    this.confirmacionAgregar.isCreate = false;
    this.verConfirmacionPopap = false;

    const listaNumeros = this.obtenerFilasConApuesta(this.listaNumeros)

    if(this.edit){
      const productosEditar = {
        _id: this.infoEdit[0]._id,
        colilla: this.colilla,
        fechaActual: this.fechaActual,
        loterias: this.loterias,
        apostado: this.valueBet,
        iva: this.valueVat,
        total: this.valueBetTotal,
        listaNumeros:listaNumeros,
        clienteOperacion:this.clienteOperacion,
        fechaSeleccionApuesta:this.fechaSeleccionApuesta,
        serie:  this.rolloColilla.serie,
        colillaActual: this.rolloColilla.colillaActual,
        idRollo:  this.auth.usuario.idRollo,
        idVendedor: this.auth.usuario.idUsuario,
      }

      let chanceApuesta:any = JSON.parse(localStorage.getItem('chanceApuesta'));

      if (chanceApuesta[0]) {
        let actualizarCliente = chanceApuesta      
        for (let index = 0; index < actualizarCliente.length; index++) {
          actualizarCliente[index].clienteOperacion = this.clienteOperacion;
        }
        localStorage.setItem('chanceApuesta', JSON.stringify(actualizarCliente));
        chanceApuesta = JSON.parse(localStorage.getItem('chanceApuesta'));
      }

      const keyResponse = this.getKeyObject(this.infoEdit[0]._id, chanceApuesta);
      chanceApuesta[keyResponse]._id = productosEditar._id
      chanceApuesta[keyResponse].colilla = productosEditar.colilla
      chanceApuesta[keyResponse].fechaActual = productosEditar.fechaActual
      chanceApuesta[keyResponse].loterias = productosEditar.loterias
      chanceApuesta[keyResponse].apostado = productosEditar.apostado
      chanceApuesta[keyResponse].iva = productosEditar.iva
      chanceApuesta[keyResponse].total = productosEditar.total
      chanceApuesta[keyResponse].listaNumeros = productosEditar.listaNumeros
      chanceApuesta[keyResponse].fechaSeleccionApuesta = productosEditar.fechaSeleccionApuesta
      localStorage.setItem('chanceApuesta', JSON.stringify(chanceApuesta));
      this.cleanFooter()
      this.agregarProductos.emit(true);
      this.borrarTodoReset.emit(true);
    } else {

      const productosAgregar = {
        _id: 'bet_' + Math.floor(Math.random() * 999999),
        colilla: this.colilla,
        serie:  this.rolloColilla.serie,
        colillaActual: this.rolloColilla .colillaActual,
        idRollo:  this.auth.usuario.idRollo,
        idVendedor: this.auth.usuario.idUsuario,
        fechaActual: this.fechaActual,
        loterias: this.loterias,
        apostado: this.valueBet,
        iva: this.valueVat,
        total: this.valueBetTotal,
        listaNumeros:listaNumeros,
        clienteOperacion:this.clienteOperacion,
        fechaSeleccionApuesta:this.fechaSeleccionApuesta,
      }

      let chanceApuesta = localStorage.getItem('chanceApuesta');

      if(JSON.parse(chanceApuesta) != null){
        if (JSON.parse(chanceApuesta)[0]) {
          let actualizarCliente = JSON.parse(chanceApuesta)          
          for (let index = 0; index < actualizarCliente.length; index++) {
            actualizarCliente[index].clienteOperacion = this.clienteOperacion;
          }
          localStorage.setItem('chanceApuesta', JSON.stringify(actualizarCliente));
          chanceApuesta = localStorage.getItem('chanceApuesta');
        }
      }

      if(chanceApuesta === null) {
        const arrayproductosAgregar = []
        arrayproductosAgregar.push(productosAgregar)
        localStorage.setItem('chanceApuesta', JSON.stringify(arrayproductosAgregar));
      } else {
        const chanceAp = JSON.parse(localStorage.getItem('chanceApuesta'));
        chanceAp.push(productosAgregar);
        localStorage.setItem('chanceApuesta', JSON.stringify(chanceAp));
      }
      this.agregarProductos.emit(true);
      this.borrarTodoReset.emit(true);
      
    }


    // emitimos el evento para el observable
    this.shellState.enviarEventoCarrito(true);

    this.valueVat = 0;
    this.valueBetTotal = 0;
  }




  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }


  /**
   * Permite cerrar el modal de operaciones
   * @param event 
   */
  public closeModalOperacion(event): void {
    this.displayModalSerie = event;
  }



  /**
   * Permite obtner la colilla actual 
   * @param event 
   */
  public iniciaOperacion(event): void {
    if(event){
      let papeleriaRolloDTO = new PapeleriaRolloDTO;
      papeleriaRolloDTO = event;
      this.colilla = papeleriaRolloDTO.serie + papeleriaRolloDTO.rangoInicial;
      this.rolloColilla.colillaActual  = papeleriaRolloDTO.nroInicialSerie;
      this.auth.usuario.idRollo = papeleriaRolloDTO.idRollo;
     
 
    }

  }

    /**
   * Permite cambiar la serie 
   * @param event 
   */
  public updateSerie(event): void {
    if(event){
      this.colilla = event;
    }

  }

}
