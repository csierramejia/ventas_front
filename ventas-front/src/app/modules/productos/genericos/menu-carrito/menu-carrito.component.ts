import { RolloColillaDTO } from 'src/app/dtos/transversal/rollo-colilla.dto';
import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../../constants/router.constant';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/utilities/common.service';
import { ProductosService } from '../../productos.service';
import { ShellState } from 'src/app/states/shell/shell.state';

/**
 * Es el Menu del shell a visualizar en la aplicacion
 */
@Component({
  selector: 'app-menu-carrito',
  templateUrl: './menu-carrito.component.html',
  styleUrls: ['./menu-carrito.component.css'],
  providers: [CommonService, ProductosService]
})
export class MenuCarritoComponent implements OnInit {

  @Output() editarProducto: EventEmitter<any> = new EventEmitter();
  @Output() updateSerieChance = new EventEmitter<RolloColillaDTO>();
  // variable que nos sirve para identificar sobre que producto debe trabajar el componente si chance, chance millonario, etc
  @Input() productoParent: string;
  cantidadRepetir = 1;
  productos = [];
  subtotal = 0
 
  constructor(
    protected messageService: MessageService,
    private router: Router,
    private shellState: ShellState,
    private productosService:ProductosService,
    private commonService: CommonService) {}

  
  ngOnInit(): void {
    this.refrescarCarrito();
  }


  borrarApuesta(id) {
    switch (this.productoParent) {
      case 'chance':
        this.borrarApuestaOperacion(id,'chanceApuesta');
        break;
      case 'chance-millonario':
        this.borrarApuestaOperacion(id,'chanceApuestaMillonario');
        break;
      case 'super-chance':
        this.borrarApuestaOperacion(id,'superChanceApuesta');
        break;
      default:
        break;
    }
  }


  editarApuesta(producto) {
    this.editarProducto.emit(producto)
  }


  duplicarApuesta(id) {
    switch (this.productoParent) {
      case 'chance':
        this.duplicarApuestaOperacion(id, 'chanceApuesta');
        break;
      case 'chance-millonario':
        this.duplicarApuestaOperacion(id, 'chanceApuestaMillonario');
        break;
      case 'super-chance':
        this.duplicarApuestaOperacion(id, 'superChanceApuesta');
        break;
      default:
        break;
    }
  }



  duplicarApuestaOperacion(id, eventoProducto){
    const productosDuplicar = JSON.parse(localStorage.getItem(eventoProducto))
    const result = productosDuplicar.filter(productoDuplicar => productoDuplicar._id == id);
    for (let index = 0; index < this.cantidadRepetir; index++) {
      result[0]._id = 'bet_' + Math.floor(Math.random() * 999999)
      const newLocalstorage = JSON.parse(localStorage.getItem(eventoProducto));
      newLocalstorage.push(result[0]);
      this.asignarSerieDuplicarApuesta(newLocalstorage,productosDuplicar);
      localStorage.setItem(eventoProducto, JSON.stringify(newLocalstorage));
    }
    this.refrescarCarrito();
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


  refrescarCarrito(){
    console.log('-------');
    switch (this.productoParent) {
      case 'chance':
        this.refrescarCarritoChance();
        break;
      case 'chance-millonario':
        this.refrescarCarritoChanceMillonario();
        break;
      case 'super-chance':
        this.refrescarCarritoSuperChance();
        break;
      default:
        break;
    }
  }


  refrescarCarritoChance() {
    this.subtotal = 0;
    this.productos = [];
    if( JSON.parse(localStorage.getItem('chanceApuesta')) ){
      if(JSON.parse(localStorage.getItem('chanceApuesta')).length > 0) {
        const iteracionLocalStorageProductos = JSON.parse(localStorage.getItem('chanceApuesta'));
        const newProductos = []
        iteracionLocalStorageProductos.forEach(element => {
          const loteriasSeleccionadas = this.get_lotteriesSelected(element.loterias)
          newProductos.push({
            apostado:element.apostado,
            colilla:element.colilla,
            fechaActual:element.fechaActual,
            fechaSeleccionApuesta:element.fechaSeleccionApuesta,
            iva:element.iva,
            listaNumeros:element.listaNumeros,
            loterias:loteriasSeleccionadas,
            total:Math.round(element.total),
            _id:element._id,
            viewRepetir: false,
            serie: element.serie,
            colillaActual:element.colillaActual,
            idRollo: element.idRollo,
            idVendedor:element.idUsuario,
        
          })
          this.subtotal = Math.round(this.subtotal + element.total)
        });
        this.productos = newProductos;
      } else {
        this.productos = []
      }
    }

    // emitimos el evento para el observable
    this.shellState.enviarEventoCarritoELiminar(true);
  }



  refrescarCarritoChanceMillonario() {
    this.subtotal = 0;
    this.productos = [];
    if( JSON.parse(localStorage.getItem('chanceApuestaMillonario')) ){
      if(JSON.parse(localStorage.getItem('chanceApuestaMillonario')).length > 0) {
        const iteracionLocalStorageProductos = JSON.parse(localStorage.getItem('chanceApuestaMillonario'));
        const newProductos = []
        iteracionLocalStorageProductos.forEach(element => {
          const loteriasSeleccionadas = this.get_lotteriesSelected(element.loterias)
          newProductos.push({
            apostado:element.apostado,
            colilla:element.colilla,
            fechaActual:element.fechaActual,
            fechaSeleccionApuesta:element.fechaSeleccionApuesta,
            iva:element.iva,
            listaNumeros:element.listaNumeros,
            loterias:loteriasSeleccionadas,
            total:Math.round(element.total),
            _id:element._id,
            viewRepetir: false,
            serie: element.serie,
            colillaActual:element.colillaActual,
            idRollo: element.idRollo,
            idVendedor:element.idUsuario,
          })
          this.subtotal = Math.round(this.subtotal + element.total)
        });
        this.productos = newProductos;
      } else {
        this.productos = []
      }
    }
    this.shellState.enviarEventoCarritoELiminar(true);
  }


  refrescarCarritoSuperChance() {
    this.subtotal = 0;
    this.productos = [];
    if( JSON.parse(localStorage.getItem('superChanceApuesta')) ){
      if(JSON.parse(localStorage.getItem('superChanceApuesta')).length > 0) {
        const iteracionLocalStorageProductos = JSON.parse(localStorage.getItem('superChanceApuesta'));
        const newProductos = []
        iteracionLocalStorageProductos.forEach(element => {
          const loteriasSeleccionadas = this.get_lotteriesSelected(element.loterias)
          newProductos.push({
            apostado:element.apostado,
            colilla:element.colilla,
            fechaActual:element.fechaActual,
            fechaSeleccionApuesta:element.fechaSeleccionApuesta,
            iva:element.iva,
            listaNumeros:element.listaNumeros,
            loterias:loteriasSeleccionadas,
            total:Math.round(element.total),
            _id:element._id,
            viewRepetir: false,
            serie: element.serie,
            colillaActual:element.colillaActual,
            idRollo: element.idRollo,
            idVendedor:element.idUsuario,
        
          })
          this.subtotal = Math.round(this.subtotal + element.total)
        });
        this.productos = newProductos;
      } else {
        this.productos = []
      }
    }

    // emitimos el evento para el observable
    this.shellState.enviarEventoCarritoELiminar(true);
  }


  borrarApuestaOperacion(id, eventProducto) {
    const chanceArray = JSON.parse(localStorage.getItem(eventProducto));
    let item = chanceArray[0];
    const productosBorrar = JSON.parse(localStorage.getItem(eventProducto))
    const keyResponse = this.getKeyObject(id, productosBorrar);
    if (keyResponse !== -1) {
      productosBorrar.splice(keyResponse, 1);
    }
    this.asignarSerieCarrito(productosBorrar, item);
    localStorage.setItem(eventProducto, JSON.stringify(productosBorrar));
    this.refrescarCarrito();
  }


  /**
   * @author Luis Hernandez
   * @description Metodo que se valida cuales fueron
   * las loterias seleccionadas y las manda para el carrito
   */
  get_lotteriesSelected(lot) {
    const loteriasSeleccionadas = [];
    lot.forEach(element => {
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
    return loteriasSeleccionadas;
  }


  ////////// ----------------- FALTA REVISAR PARA IDENTIFICAR TIPO GENERICO ------------------- ////////////
  aumentarDuplicidad(){
    if(this.cantidadRepetir < 5){
      this.cantidadRepetir = this.cantidadRepetir + 1;
    }
  }

  disminuirDuplicidad(){
    if(this.cantidadRepetir > 1){
      this.cantidadRepetir = this.cantidadRepetir - 1;
    }
  }

  viewRepetirEvent(index){
    this.cantidadRepetir = 1;
    if(this.productos[index].viewRepetir){
      this.productos[index].viewRepetir = false;
    } else {
      this.productos[index].viewRepetir = true;
    }
  }

  verResumenCompra(): void {

    switch (this.productoParent) {
      case 'chance':
        this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO], { queryParams: { producto: 'chance' } });
        break;
      case 'chance-millonario':
        this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO], { queryParams: { producto: 'chance-millonario' } });
        break;
      case 'super-chance':
        this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO], { queryParams: { producto: 'super-chance' } });
        break;
      default:
        break;
    }

    
  }

  /**
   * Método que permite asignar la serie en el carrito en orden seuencia
   * @param productosBorrar 
   * @param item 
   */
  private asignarSerieCarrito(productosBorrar, item): void {

    if (productosBorrar.length > 0) {
      productosBorrar[0].colillaActual = item.colillaActual;
      productosBorrar[0].colilla = item.colilla;
      for (let i = 1; i < productosBorrar.length; i++) {
        if (productosBorrar.length > 1) {
          let ind = i - 1;
          let colillaActual = productosBorrar[ind].colillaActual;
          colillaActual++;
          productosBorrar[i].colillaActual = colillaActual;
          const colilla = productosBorrar[i].serie + String(colillaActual).padStart(7, '0');
          productosBorrar[i].colilla = colilla;
        }
      }
    }
    let rolloDTO = new RolloColillaDTO;
    rolloDTO.rangoColilla = productosBorrar.length > 0 ? productosBorrar[productosBorrar.length - 1].colilla : item.colilla;
    rolloDTO.colillaActual =productosBorrar.length > 0 ? productosBorrar[productosBorrar.length - 1].colillaActual : item.colillaActual;
    this.updateSerieChance.emit(rolloDTO);
  
  }

  /**
   * Método encargado de asignar la serie en orden consecutiva al asignar
   * nuevas apuestas
   * @param newLocalstorage 
   * @param productosDuplicar 
   */
  private asignarSerieDuplicarApuesta(newLocalstorage,productosDuplicar):void{

    for (let i = 1; i < newLocalstorage.length; i++) {
      if (newLocalstorage.length > 0) {
        let ind = i - 1;
        let colillaActual = newLocalstorage[ind].colillaActual;
        colillaActual++;
        newLocalstorage[i].colillaActual = colillaActual;
        const colilla = newLocalstorage[i].serie + String(colillaActual).padStart(7, '0');
        newLocalstorage[i].colilla = colilla;
      }
    }
    let rolloDTO = new RolloColillaDTO;
    rolloDTO.rangoColilla = newLocalstorage.length > 0 ? newLocalstorage[newLocalstorage.length - 1].colilla : productosDuplicar[0].colilla;
    rolloDTO.colillaActual =newLocalstorage.length > 0 ? newLocalstorage[newLocalstorage.length - 1].colillaActual : productosDuplicar[0].colillaActual;
    this.updateSerieChance.emit(rolloDTO);
   



  }
  ////////// ----------------- FALTA REVISAR PARA IDENTIFICAR TIPO GENERICO ------------------- ////////////




}
