import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../../constants/router.constant';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/utilities/common.service';
import { MsjUtil } from 'src/app/utilities/messages.util';


/**
 * Es el Menu del shell a visualizar en la aplicacion
 */
@Component({
  selector: 'app-menu-carrito',
  templateUrl: './menu-carrito.component.html',
  styleUrls: ['./menu-carrito.component.css'],
  providers: [CommonService]
})
export class MenuCarritoComponent implements OnInit {

  productos = [];
 
  constructor(
    protected messageService: MessageService,
    private router: Router,
    private commonService: CommonService) {

    }


  /**
   * Se indica que el menu ya esta cargado
   */
  ngOnInit(): void {
    this.obtenerProductosCarrito();
  }

  obtenerProductosCarrito() {
    // setInterval(() => {
    //   this.productos = JSON.parse(localStorage.getItem('chanceApuesta'))
    // }, 1000);
  }


  borrarApuesta(id) {
    const keyResponse = this.getKeyObject(id);
    if ( keyResponse  !== -1 ) {
      this.productos.splice( keyResponse , 1 );
      // this.get_values_totals();
    }
  }


  duplicarApuesta(id){
    this.productos.push(this.getKeyObject(id))
  }


  /**
   * @author Luis Hernandez
   * @param id
   * @description metodo que se encarga
   * de buscar el punto dentro del array
   * de un producto
   */
  getKeyObject(_id) {
    return this.productos.map((e) => {
      return e;
    }).indexOf(_id);
  }

  verResumenCompra(): void {
    this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO]);
  }




}
