import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../../constants/router.constant';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/utilities/common.service';
import { ProductosService } from '../../productos.service';


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

  cantidadRepetir = 1;

  productos = [];
  subtotal = 0
 
  constructor(
    protected messageService: MessageService,
    private router: Router,
    private productosService:ProductosService,
    private commonService: CommonService) {}


 
  ngOnInit(): void {
    this.refrescarCarrito()
  }




  borrarApuesta(id) {
    const productosBorrar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const keyResponse = this.getKeyObject(id, productosBorrar);
    if ( keyResponse  !== -1 ) {
      productosBorrar.splice( keyResponse , 1 );
    }
    localStorage.setItem('chanceApuesta', JSON.stringify(productosBorrar));
    this.refrescarCarrito();
  }


  
  editarApuesta(producto) {
    this.editarProducto.emit(producto)
  }


  duplicarApuesta(id) {
    const productosDuplicar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const result = productosDuplicar.filter(productoDuplicar => productoDuplicar._id == id);
    for (let index = 0; index < this.cantidadRepetir; index++) {
      result[0]._id = 'bet_' + Math.floor(Math.random() * 999999)
      const newLocalstorage = JSON.parse(localStorage.getItem('chanceApuesta'));
      newLocalstorage.push(result[0]);
      localStorage.setItem('chanceApuesta', JSON.stringify(newLocalstorage));
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
    this.subtotal = 0;
    this.productos = []

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
            total:element.total,
            _id:element._id,
            viewRepetir: false
          })
          this.subtotal = this.subtotal + element.apostado
        });
        this.productos = newProductos;
      } else {
        this.productos = []
      }
    }


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
    this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO]);
  }




}
