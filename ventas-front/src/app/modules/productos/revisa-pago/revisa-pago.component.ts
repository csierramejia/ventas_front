import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterConstant } from '../../../constants/router.constant';
import { Router } from '@angular/router';
@Component({
  selector: 'app-revisa-pago',
  templateUrl: './revisa-pago.component.html',
  styleUrls: ['./revisa-pago.component.css']
})
export class RevisaPagoComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  volverAtras(): void {
    this.router.navigate([RouterConstant.NAVIGATE_CHANCE]);
  }


}
