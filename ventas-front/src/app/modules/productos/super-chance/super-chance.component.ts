import { Component, OnInit, ViewChild } from '@angular/core';
import { SummaryFooterComponent } from '../genericos/summary-footer/summary-footer.component';
import { ApuestaSuperComponent } from './apuesta-super/apuesta-super.component';
import { MenuCarritoComponent } from '../genericos/menu-carrito/menu-carrito.component';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-super-chance',
  templateUrl: './super-chance.component.html',
  styleUrls: ['./super-chance.component.css'],
  providers: [ProductosService]

})
export class SuperChanceComponent implements OnInit {

  // esto aplica para chance
  @ViewChild(SummaryFooterComponent, {static: true}) summaryFooter: SummaryFooterComponent;
  @ViewChild(ApuestaSuperComponent) apuestaChanceMillonario: ApuestaSuperComponent;
  @ViewChild(MenuCarritoComponent, {static: true}) menuCarrito: MenuCarritoComponent;

  productoSuperChance = 'super-chance'

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
    this.apuestaChanceMillonario.borrarTodo(3);
    this.summaryFooter.limpiar();

  }


  agregarProductos(event){
    this.menuCarrito.refrescarCarrito()
  }

  editarProducto(event){
    this.summaryFooter.editarProducto(event)
    this.apuestaChanceMillonario.editarProducto(event)
  }

   /**
   * @author Jhon Rivera
   * @param event
   * @description Metodo que se engarda de cambiar la serie seleccionada
   */
  updateSerie(event): void {
    this.apuestaMillonariaComponent.updateSerie(event);
  }



}
