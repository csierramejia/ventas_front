import { Component, OnInit, ViewChild } from '@angular/core';
import { SummaryFooterComponent } from './summary-footer/summary-footer.component';
import { ApuestaChanceComponent } from './apuesta-chance/apuesta-chance.component';
import { MenuCarritoComponent } from '../genericos/menu-carrito/menu-carrito.component';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-chance',
  templateUrl: './chance.component.html',
  styleUrls: ['./chance.component.css'],
  providers: [ProductosService]

})
export class ChanceComponent implements OnInit {

  // esto aplica para chance
  @ViewChild(SummaryFooterComponent, {static: true}) summaryFooter: SummaryFooterComponent;
  @ViewChild(ApuestaChanceComponent) apuestaChance: ApuestaChanceComponent;
  @ViewChild(MenuCarritoComponent, {static: true}) menuCarrito: MenuCarritoComponent;

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


  borrarTodoReset(event) {
    this.apuestaChance.borrarTodo(1);
  }


  agregarProductos(event){
    this.menuCarrito.refrescarCarrito()
    // this.apuestaChance.validarEstadoHabiltarCamposCliente();
  }

  editarProducto(event){
    this.summaryFooter.editarProducto(event)
    this.apuestaChance.editarProducto(event)
  }



}
