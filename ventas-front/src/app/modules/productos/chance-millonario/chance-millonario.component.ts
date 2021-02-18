import { Component, OnInit, ViewChild } from '@angular/core';
import { SummaryFooterComponent } from '../genericos/summary-footer/summary-footer.component';
import { ApuestaMillonariaComponent } from './apuesta-millonaria/apuesta-millonaria.component';
import { MenuCarritoComponent } from '../genericos/menu-carrito/menu-carrito.component';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-chance-millonario',
  templateUrl: './chance-millonario.component.html',
  styleUrls: ['./chance-millonario.component.css'],
  providers: [ProductosService]

})
export class ChanceMillonarioComponent implements OnInit {

  // esto aplica para chance
  @ViewChild(SummaryFooterComponent, {static: true}) summaryFooter: SummaryFooterComponent;
  @ViewChild(ApuestaMillonariaComponent) apuestaChanceMillonario: ApuestaMillonariaComponent;
  @ViewChild(MenuCarritoComponent, {static: true}) menuCarrito: MenuCarritoComponent;

  productoChanceMillonario = 'chance-millonario'

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

  agregarCliente(event) {
    this.summaryFooter.setCliente(event);
  }


  agregarModalidad(event) {
    this.summaryFooter.setModalidad(event);
  }

  borrarTodoReset(event) {
    // this.apuestaChanceMillonario.borrarTodo(1);
  }


  agregarProductos(event){
    this.menuCarrito.refrescarCarrito()
  }

  editarProducto(event){
    this.summaryFooter.editarProducto(event)
    this.apuestaChanceMillonario.editarProducto(event)
  }



}
