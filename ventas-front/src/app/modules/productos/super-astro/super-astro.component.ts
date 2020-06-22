import { Component, OnInit, ViewChild } from '@angular/core';
import { BolsaComponent } from '../chance/bolsa/bolsa.component';
import { ApuestaComponent } from '../chance/apuesta/apuesta.component';
import { ApuestaSuperAstroComponent } from './apuesta-super-astro/apuesta-super-astro.component';

@Component({
  selector: 'app-astro-chance',
  templateUrl: './super-astro.component.html',
  styleUrls: ['./super-astro.component.css']
})
export class SuperAstroComponent implements OnInit {

  @ViewChild(BolsaComponent) bolsaChild: BolsaComponent;
  @ViewChild(ApuestaComponent) apuestaChild: ApuestaComponent;
  @ViewChild(ApuestaSuperAstroComponent) apuestaMillonariaComponent: ApuestaSuperAstroComponent;

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
