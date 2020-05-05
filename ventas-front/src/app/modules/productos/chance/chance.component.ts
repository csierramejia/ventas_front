import { Component, OnInit, ViewChild } from '@angular/core';
import { BolsaComponent } from './bolsa/bolsa.component';
import { ApuestaComponent } from './apuesta/apuesta.component';

@Component({
  selector: 'app-chance',
  templateUrl: './chance.component.html',
  styleUrls: ['./chance.component.css']
})
export class ChanceComponent implements OnInit {

  @ViewChild(BolsaComponent) bolsaChild: BolsaComponent;
  @ViewChild(ApuestaComponent) apuestaChild: ApuestaComponent;


  constructor() { }

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
   * @description Metodo que se engarda de recibir
   * la informacion de las loterias
   */
  addLotteries(event): void {
    this.bolsaChild.addLotteries(event);
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
    this.apuestaChild.editBetSendEmit(event);
  }



  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se engarda de notificar
   * que la transaccion esta ok
   */
  creatingBet(event): void {
    this.apuestaChild.createBetSendEmit(event);
  }

}
