import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../../constants/router.constant';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/utilities/common.service';


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
    setInterval(() => {
      this.productos = JSON.parse(localStorage.getItem('chanceApuesta'))
    }, 1000);
  }


  borrarApuesta(id) {

    const productosBorrar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const keyResponse = this.getKeyObject(id, productosBorrar);
    if ( keyResponse  !== -1 ) {
      productosBorrar.splice( keyResponse , 1 );
      // this.get_values_totals();
    }
    localStorage.setItem('chanceApuesta', JSON.stringify(productosBorrar));
  }


  
  editarApuesta(id) {
    console.log('entramos a editar');
    this.apuestaChanceComponentChild.testing();
    // this.commonService.passValue('hola')
  }


  duplicarApuesta(id){
    const productosDuplicar = JSON.parse(localStorage.getItem('chanceApuesta'))
    const result = productosDuplicar.filter(productoDuplicar => productoDuplicar._id == id);
    productosDuplicar.push(result[0])
    localStorage.setItem('chanceApuesta', JSON.stringify(productosDuplicar));

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

  verResumenCompra(): void {
    this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO]);
  }




}
