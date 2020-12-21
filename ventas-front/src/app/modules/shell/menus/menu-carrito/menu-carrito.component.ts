import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstant } from '../../../../constants/router.constant';

/**
 * Es el Menu del shell a visualizar en la aplicacion
 */
@Component({
  selector: 'app-menu-carrito',
  templateUrl: './menu-carrito.component.html',
  styleUrls: ['./menu-carrito.component.css'],
})
export class MenuCarritoComponent implements OnInit {

  productos = [
    {id: 0, name: "policy001"},
    {id: 2, name: "policy002"},
    {id: 3, name: "policy003"},
    {id: 4, name: "policy004"},
  ];
 
  constructor(private router: Router) {}


  /**
   * Se indica que el menu ya esta cargado
   */
  ngOnInit(): void {
    
  }

  setProductosCarrito(event): void{
    console.log('-------------PINTAR-------------');
    console.log(event);
    console.log('-------------PINTAR-------------');

  }

  verResumenCompra(): void {
    this.router.navigate([RouterConstant.NAVIGATE_REVISA_PAGO]);
  }




}
