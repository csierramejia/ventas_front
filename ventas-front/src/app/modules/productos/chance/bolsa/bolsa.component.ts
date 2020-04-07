import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-bolsa',
  templateUrl: './bolsa.component.html',
  styleUrls: ['./bolsa.component.css']
})
export class BolsaComponent implements OnInit {

  loterias = [];
  apuestas = [];

  lotteries = [
    {_id: 1, name: 'Huila'},
    {_id: 2, name: 'Boyaca'},
    {_id: 3, name: 'Quindio'},
    {_id: 4, name: 'Chontico'},
    {_id: 5, name: 'Risaralda'}
  ];

  cartItems = [
     // { numberPlayed: '1234', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '2736', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '1525', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '6252', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '2615', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '1291', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '8171', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '1711', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '1716', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 },
     // { numberPlayed: '3625', dataPlayed: '26/03/2020', direct: 2000, combined: 0, threeC: 500, twoC: 500, oneC: 500 }
  ];


  constructor() { }

  ngOnInit(): void {
  }


}
