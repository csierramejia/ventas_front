import { Component, OnInit, ViewChild } from '@angular/core';
import { BolsaComponent } from './bolsa/bolsa.component';


@Component({
  selector: 'app-chance',
  templateUrl: './chance.component.html',
  styleUrls: ['./chance.component.css']
})
export class ChanceComponent implements OnInit {

  @ViewChild(BolsaComponent) bolsaChild: BolsaComponent;

  constructor() { }

  ngOnInit(): void {

  }


  addBet(event): void {
    this.bolsaChild.cartItems.push(event);
    // console.log('new bet component father');
    // console.log(event);
    // console.log('new bet component father');
  }

}
