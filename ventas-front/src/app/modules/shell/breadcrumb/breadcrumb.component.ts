import { Component, OnInit, ViewChild } from '@angular/core';
import { ShellState } from './../../../states/shell/shell.state';
import { CommonService } from "../../../utilities/common.service";
import { MenuCarritoComponent } from '../../productos/chance/menu-carrito/menu-carrito.component';

/**
 * Miga de pan que se visualiza en el Shell de la aplicacion
 */
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  providers: [ CommonService ]
})
export class BreadcrumbComponent implements OnInit {

  @ViewChild(MenuCarritoComponent) menuCarritoComponent: MenuCarritoComponent;

  hoy = new Date();
  fechaActual = this.hoy.getDate() + '/' + (this.hoy.getMonth() + 1) + '/' + this.hoy.getFullYear();
  horaActual: Date;
  // horaActual = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();


  /**
   * @param shellState , se utiliza para obtener
   * los valores de la miga de pan
   */
  constructor(
    public shellState: ShellState,
    private commonService: CommonService
    ) {
      this.commonService.obtenerHora()
      .subscribe( data => this.horaActual = data );
  }


  ngOnInit(): void {
    setInterval(this.obtenerFechaHora, 1000);
  }


  obtenerFechaHora() {
    let hoy = new Date();
    this.fechaActual = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
    // this.horaActual = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    // console.log(this.fechaActual+' '+this.horaActual);
  }


}
