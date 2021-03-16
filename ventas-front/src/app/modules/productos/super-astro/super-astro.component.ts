import { Component, OnInit, ViewChild } from '@angular/core';
import { SummaryFooterComponent } from '../genericos/summary-footer/summary-footer.component';
import { ApuestaSuperAstroComponent } from './apuesta-super-astro/apuesta-super-astro.component';
import { MenuCarritoComponent } from '../genericos/menu-carrito/menu-carrito.component';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-super-chance',
  templateUrl: './super-astro.component.html',
  styleUrls: ['./super-astro.component.css'],
  providers: [ProductosService]

})
export class SuperAstroComponent implements OnInit {

  // esto aplica para chance
  @ViewChild(SummaryFooterComponent, {static: true}) summaryFooter: SummaryFooterComponent;
  @ViewChild(ApuestaSuperAstroComponent) apuestaSuperAstro: ApuestaSuperAstroComponent;
  @ViewChild(MenuCarritoComponent, {static: true}) menuCarrito: MenuCarritoComponent;

  productoSuperChance = 'super-astro'

  constructor(private productosService: ProductosService) {
  }

  ngOnInit(): void {

  }

  /**
   * @author Luis Hernandez
   * @param event
   * @description funcion que se encarga de setear las loterias en la bolsa
   */
  agregarLoterias(event): void {
    this.summaryFooter.setLoterias(event);
    this.summaryFooter.setProducto('CHANCE');
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description funcion que se encarga de setear la variable 
   */
  reiniciarEdit(event){
    this.summaryFooter.edit = event;
  }


  agregarNumeros(event) {
    this.summaryFooter.setNumeros(event);
  }


  agregarModalidades(event) {
    this.summaryFooter.setModalidades(event);
  }


  agregarCliente(event) {
    this.summaryFooter.setCliente(event);
  }


  borrarTodoReset(event) {
    this.apuestaSuperAstro.borrarTodo(3);
    this.summaryFooter.limpiar();

  }


  agregarProductos(event){
    this.menuCarrito.refrescarCarrito()
  }

  editarProducto(event){
    this.summaryFooter.editarProducto(event)
    this.apuestaSuperAstro.editarProducto(event)
  }



}