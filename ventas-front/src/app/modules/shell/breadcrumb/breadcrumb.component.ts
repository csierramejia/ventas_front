import { Component, OnInit, ViewChild } from '@angular/core';
import { ShellState } from './../../../states/shell/shell.state';
import { CommonService } from "../../../utilities/common.service";
import { MenuCarritoComponent } from '../../productos/genericos/menu-carrito/menu-carrito.component';
import { ProductosService } from '../../productos/productos.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  subscription: any;
  clienteOperacion:any;
  verCarrito = false;
  itemsCarrito = 0;
  @ViewChild(MenuCarritoComponent) menuCarritoComponent: MenuCarritoComponent;
  hoy = new Date();
  fechaActual = this.hoy.getDate() + '/' + (this.hoy.getMonth() + 1) + '/' + this.hoy.getFullYear();
  horaActual: Date;

  urlChance = '/autenticado/productos/chance';
  urlMillonario = '/autenticado/productos/chance-millonario';
  urlSuperChance = '/autenticado/productos/super-chance';
  urlSuperAstro = '/autenticado/productos/super-astro';


  /**
   * @param shellState , se utiliza para obtener
   * los valores de la miga de pan
   */
  constructor(
    public shellState: ShellState,
    private commonService: CommonService,
    private productosService:ProductosService,
    private router: Router,
    ) {
      router.events.pipe(
        filter(event => event instanceof NavigationEnd)  
      ).subscribe((event:any) => {
        this.commonService.obtenerHora().subscribe(data => this.horaActual = data);
        this.verCarrito = true;
        this.itemsCarrito = 0;
        if(event.url == this.urlChance) {
          this.eventos_operaciones('chanceApuesta');
        } else if(event.url == this.urlMillonario){
          this.eventos_operaciones('chanceApuestaMillonario');
        } else if(event.url == this.urlSuperChance){
          this.eventos_operaciones('superChanceApuesta');
        } else if(event.url == this.urlSuperAstro){
          this.eventos_operaciones('superAstroApuesta');
        }
      });

      // subscribe evento busqueda de cliente
      this.subscription = this.shellState.getEventoCliente().subscribe(evento => { 
        if(evento){
          this.obtenerInfoCliente()
        }
      });
  }


  ngOnInit(): void {
    setInterval(this.obtenerFechaHora, 1000);
    this.obtenerInfoCliente();
  }


  eventos_operaciones(eventoProducto){
    this.obtenerInfoCarrito(eventoProducto);
    this.shellState.getEventoCarrito().subscribe(evento => { 
      if(evento){
        this.obtenerInfoCarrito(eventoProducto)
      }
    });

    this.shellState.getEventoCarritoEliminar().subscribe(evento => { 
      if(evento){
        this.obtenerInfoCarrito(eventoProducto)
      }
    });
  }


  obtenerFechaHora() {
    let hoy = new Date();
    this.fechaActual = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
  }


  /**
   * @author Luis Fernando Hernandez
   * @description Metodo que se encarga
   * de obtener la información del cliente
   * que reposa en el localstorage
   */
  obtenerInfoCliente(){
    this.clienteOperacion = JSON.parse(localStorage.getItem('clienteOperacion'))
  }



  /**
   * @author Luis Fernando Hernandez
   * @description Metodo que se encarga
   * de obtener la información del cliente
   * que reposa en el localstorage
   */
  obtenerInfoCarrito(producto){
    this.itemsCarrito = 0;
    this.verCarrito = true;
    let res:any = JSON.parse(localStorage.getItem(producto))
    if(res){
      this.itemsCarrito = res.length;
    } else {
      this.itemsCarrito = 0;
    }

  }


  agregarCliente(){
    this.shellState.agregarEventoCliente(true);
  }


  eliminarCliente(){
    localStorage.removeItem('clienteOperacion');
    delete this.clienteOperacion;
    // llamamos evento observable que se encarga notificar a la apuesta que se borro el cliente
    this.shellState.borrarEventoCliente(true);
  }






  


}
