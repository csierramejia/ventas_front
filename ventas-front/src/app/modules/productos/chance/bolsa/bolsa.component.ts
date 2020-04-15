import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-bolsa',
  templateUrl: './bolsa.component.html',
  styleUrls: ['./bolsa.component.css']
})
export class BolsaComponent implements OnInit {

  @Output() editBet: EventEmitter<any> = new EventEmitter();

  loterias = [];
  apuestas = [];

  lotteries = [
    {_id: 1, name: 'Huila'},
    {_id: 2, name: 'Boyaca'},
    {_id: 3, name: 'Quindio'},
    {_id: 4, name: 'Chontico'},
    {_id: 5, name: 'Risaralda'}
  ];

  cartItems = [];

  constructor() { }

  ngOnInit(): void {
  }


  /**
   * @author Luis Hernandez
   * @param event
   * @description metodo que se encarga de validar
   * cuando van agregar un producto nuevo
   * a la bolsa y cuando lo estan modificando
   */
  validCreateAndEdit(event): void {
    if (event.action === 1) {
      delete event.action;
      this.cartItems.push(event);
    } else {
      const keyResponse = this.getKeyObject(event._id);
      this.setData(keyResponse, event);
    }
  }


  /**
   * @author Luis Hernandez
   * @description metodo que aplica los cambios de la edición
   */
  setData(key, event): void {
    this.cartItems[key].documentCustomer = event.documentCustomer;
    this.cartItems[key].nameCustomer = event.nameCustomer;
    this.cartItems[key].numberPlayed = event.numberPlayed;
    this.cartItems[key].dataPlayed = event.dataPlayed;
    this.cartItems[key].direct = event.direct;
    this.cartItems[key].combined = event.combined;
    this.cartItems[key].threeC = event.threeC;
    this.cartItems[key].twoC = event.twoC;
    this.cartItems[key].oneC = event.oneC;
  }


  /**
   * @author Luis Hernandez
   * @param element
   * @description metodo que se encarga
   * de enviar al componente de apuesta
   * la información de la apuesta que
   * se desea modificar
   */
  editBetSend(element): void {
    this.editBet.emit(element);
  }


  /**
   * @author Luis Hernandez
   * @param element
   * @description Por medio de este metodo
   * eliminamos el item (apuesta) seleccionado
   * por el usuario
   */
  deleteBet(element): void {
    const keyResponse = this.getKeyObject(element._id);
    if ( keyResponse  !== -1 ) {
      this.cartItems.splice( keyResponse , 1 );
    }
  }


  /**
   * @author Luis Hernandez
   * @param id
   * @description metodo que se encarga
   * de buscar el punto dentro del array
   * de un producto
   */
  getKeyObject(id) {
    return this.cartItems.map((e) => {
      return e._id;
    }).indexOf(id);
  }


}
