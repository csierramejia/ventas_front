import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {

  // tslint:disable-next-line: no-output-native
  @Output() closePopup: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  closePopupE(): void {
    this.closePopup.emit(false);
  }

}
