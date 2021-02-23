import { Component, OnInit, ViewChild } from '@angular/core';
import { BolsaComponent } from '../genericos/bolsa/bolsa.component';
import { ApuestaSuperComponent } from './apuesta-super/apuesta-super.component';

@Component({
  selector: 'app-super-chance',
  templateUrl: './super-chance.component.html',
  styleUrls: ['./super-chance.component.css']
})
export class SuperChanceComponent implements OnInit {

  @ViewChild(BolsaComponent) bolsaChild: BolsaComponent;
  @ViewChild(ApuestaSuperComponent) apuestaMillonariaComponent: ApuestaSuperComponent;

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
    this.bolsaChild.setProducto("SUPER_CHANCE")
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
