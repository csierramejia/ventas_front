import { Component, OnInit, ViewChild } from '@angular/core';
import { ApuestaMillonariaComponent } from './apuesta-millonaria/apuesta-millonaria.component';
import { BolsaComponent } from '../genericos/bolsa/bolsa.component';

@Component({
  selector: 'app-chance-millonario',
  templateUrl: './chance-millonario.component.html',
  styleUrls: ['./chance-millonario.component.css']
})
export class ChanceMillonarioComponent implements OnInit {

  @ViewChild(BolsaComponent) bolsaChild: BolsaComponent;
  @ViewChild(ApuestaMillonariaComponent) apuestaMillonariaComponent: ApuestaMillonariaComponent;

  constructor() {

  }

  ngOnInit(): void {

  }

  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se engarda de recibir
   * la informacion del chance que viene del
   * componente apuesta y lo envia para el
   * componente bolsa
   */
  addBet(event): void {
    this.bolsaChild.validCreateAndEdit(event);
  }

  /**
   * @author Luis Hernandez
   * @param event
   * @description funcion que se encarga de setear las loterias en la bolsa
   */
  addLotteries(event): void {
    this.bolsaChild.setLotteries(event);
    this.bolsaChild.setProducto("CHANCE_MILLONARIO")
  }




  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se engarda de recibir
   * la informacion del chance que viene del
   * componente bolsa y lo envia para el
   * componente chance
   */
  editBet(event): void {
      this.apuestaMillonariaComponent.editBetSendEmit(event);
    
  }



  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se engarda de notificar
   * que la transaccion esta ok
   */
  creatingBet(event): void {
      this.apuestaMillonariaComponent.createBetSendEmit(event);
    
  }


}
