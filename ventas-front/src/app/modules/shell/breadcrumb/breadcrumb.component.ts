import { Component, OnInit, ViewChild } from '@angular/core';
import { ShellState } from './../../../states/shell/shell.state';
import { CommonService } from "../../../utilities/common.service";
import { MenuCarritoComponent } from '../../productos/genericos/menu-carrito/menu-carrito.component';
import { ProductosService } from '../../productos/productos.service';

/**
 * Miga de pan que se visualiza en el Shell de la aplicacion
 */
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  providers: [ CommonService, ProductosService ]
})
export class BreadcrumbComponent implements OnInit {

  itemsCarrito = 0;
  @ViewChild(MenuCarritoComponent) menuCarritoComponent: MenuCarritoComponent;
  hoy = new Date();
  fechaActual = this.hoy.getDate() + '/' + (this.hoy.getMonth() + 1) + '/' + this.hoy.getFullYear();
  horaActual: Date;

  /**
   * @param shellState , se utiliza para obtener
   * los valores de la miga de pan
   */
  constructor(
    public shellState: ShellState,
    private commonService: CommonService,
    private productosService:ProductosService
    ) {
      this.commonService.obtenerHora()
      .subscribe( data => this.horaActual = data );

      this.commonService.obtenerItemsCarrito()
      .subscribe( data => {
        const res:any = data;
        if(res){
          this.itemsCarrito = res.length;
        } else {
          this.itemsCarrito = 0;
        }
      });
  }


  ngOnInit(): void {
    setInterval(this.obtenerFechaHora, 1000);

  }


  obtenerFechaHora() {
    let hoy = new Date();
    this.fechaActual = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
  }


}
