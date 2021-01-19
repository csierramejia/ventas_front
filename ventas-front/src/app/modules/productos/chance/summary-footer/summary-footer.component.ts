import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductosService } from '../../productos.service';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { CommonService } from 'src/app/utilities/common.service';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../../constants/router.constant';
import { ConfirmacionAgregarCarritoComponent } from '../../genericos/confirmacion-agregar-carrito/confirmacion-agregar-carrito.component';




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

  clienteOperacion = {correoCustomer:null, idCustomer:null, nombreCliente:null, numeroDocumento:null, tipoDocumento:null}
  edit = false;
  infoEdit:any;
  inputVat = 0;
  valueBet = 0;
  valueVat = 0;
  valueBetTotal = 0;
  listaNumeros = [];
  producto = null;
  loterias = [];
  loteriaSeleccionadas = [];
  colilla = '';
  fechaSeleccionApuesta: Date;
  verConfirmacionPopap = false;
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


  setCliente(event){
    this.clienteOperacion = event;
  }




  /**
   * @author Luis Hernandez
   * @description Metodo que se encarga de recalcular el valor de la apuesta
   */
  obtenerValoresTotales(): void {

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


  agregarCarritoF(): void {
    const listaNumeros = this.obtenerFilasConApuesta(this.listaNumeros)
    if(this.colilla && this.fechaActual && this.loteriaSeleccionadas.length > 0 && listaNumeros.length > 0) {
      if(this.edit){
        this.confirmacionAgregar.isCreate = false;
        this.verConfirmacionPopap = true;
        this.confirmacionAgregar.colilla = this.colilla
        this.confirmacionAgregar.numeros = this.concatenarNumeros(listaNumeros)
        this.confirmacionAgregar.loterias = this.concatenarLoterias(this.loterias)
        this.confirmacionAgregar.apostado = this.valueBet
        this.confirmacionAgregar.iva = this.valueVat
        this.confirmacionAgregar.total = this.valueBetTotal
      } else {
        this.confirmacionAgregar.isCreate = true;
        this.verConfirmacionPopap = true;
        this.confirmacionAgregar.colilla = this.colilla
        this.confirmacionAgregar.numeros = this.concatenarNumeros(listaNumeros)
        this.confirmacionAgregar.loterias = this.concatenarLoterias(this.loterias)
        this.confirmacionAgregar.apostado = this.valueBet
        this.confirmacionAgregar.iva = this.valueVat
        this.confirmacionAgregar.total = this.valueBetTotal
      }
    } else {
      this.messageService.add(MsjUtil.getToastErrorMedium('Valide que esta gestionando los campos necesarios para realizar la apuesta'));
    }
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
    this.edit = true;
    const buscarApuestasEditar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const apuestaEditar = buscarApuestasEditar.filter(buscarApuestaEditar => buscarApuestaEditar._id == event._id);
    this.infoEdit = apuestaEditar;
    this.colilla = apuestaEditar[0].colilla
    this.fechaActual = apuestaEditar[0].fechaActual
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
    this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO]);
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
        fechaSeleccionApuesta:this.fechaSeleccionApuesta
      }

      const chanceApuesta:any = JSON.parse(localStorage.getItem('chanceApuesta'));
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
        fechaActual: this.fechaActual,
        loterias: this.loterias,
        apostado: this.valueBet,
        iva: this.valueVat,
        total: this.valueBetTotal,
        listaNumeros:listaNumeros,
        clienteOperacion:this.clienteOperacion,
        fechaSeleccionApuesta:this.fechaSeleccionApuesta
      }
      const chanceApuesta = localStorage.getItem('chanceApuesta');
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

    this.valueVat = 0;
    this.valueBetTotal = 0;

  }




  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

}
