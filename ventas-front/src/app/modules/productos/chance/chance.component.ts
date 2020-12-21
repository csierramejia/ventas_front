import { Component, OnInit, ViewChild } from '@angular/core';
import { BolsaComponent } from './bolsa/bolsa.component';
import { SummaryFooterComponent } from './summary-footer/summary-footer.component';
import { ApuestaComponent } from './apuesta/apuesta.component';
import { ApuestaMillonariaComponent } from '../chance-millonario/apuesta-millonaria/apuesta-millonaria.component';

@Component({
  selector: 'app-chance',
  templateUrl: './chance.component.html',
  styleUrls: ['./chance.component.css']
})
export class ChanceComponent implements OnInit {

  // validar si estas sirve para las otras apuestas
  @ViewChild(BolsaComponent) bolsaChild: BolsaComponent;

  // esto aplica para chance y chance millonario
  @ViewChild(SummaryFooterComponent) summaryFooter: SummaryFooterComponent;


  @ViewChild(ApuestaComponent) apuestaChild: ApuestaComponent;
  esMillonaria: boolean;
  constructor() {

   }

  ngOnInit(): void {
    this.esMillonaria = false;
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
  agregarLoterias(event): void {
    this.summaryFooter.setLoterias(event);
    this.summaryFooter.setProducto('CHANCE');
  }


  agregarNumeros(event){
    this.summaryFooter.setNumeros(event);
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
