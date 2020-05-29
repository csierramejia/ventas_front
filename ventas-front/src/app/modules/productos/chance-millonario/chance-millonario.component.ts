import { Component, OnInit, ViewChild } from '@angular/core';
import { ApuestaMillonariaComponent } from './apuesta-millonaria/apuesta-millonaria.component';
import { BolsaComponent } from '../chance/bolsa/bolsa.component';
import { ApuestaComponent } from '../chance/apuesta/apuesta.component';

@Component({
  selector: 'app-chance-millonario',
  templateUrl: './chance-millonario.component.html',
  styleUrls: ['./chance-millonario.component.css']
})
export class ChanceMillonarioComponent implements OnInit {

  @ViewChild(BolsaComponent) bolsaChild: BolsaComponent;
  @ViewChild(ApuestaComponent) apuestaChild: ApuestaComponent;
  @ViewChild(ApuestaMillonariaComponent) apuestaMillonariaComponent: ApuestaMillonariaComponent;

  esMillonaria:boolean;
  constructor() {

   }

  ngOnInit(): void {
    this.esMillonaria=true;
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
    if(!this.esMillonaria){
    this.apuestaChild.editBetSendEmit(event);
    }
    else{
      this.apuestaMillonariaComponent.editBetSendEmit(event);
    }
  }



  /**
   * @author Luis Hernandez
   * @param event
   * @description Metodo que se engarda de notificar
   * que la transaccion esta ok
   */
  creatingBet(event): void {
    if(!this.esMillonaria){
    this.apuestaChild.createBetSendEmit(event);
    }
    else{
      this.apuestaMillonariaComponent.createBetSendEmit(event);
    }
  }


}
