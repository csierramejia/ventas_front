import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { CommonComponent } from 'src/app/utilities/common.component';


@Component({
  selector: 'app-soat',
  templateUrl: './soat.component.html',
  styleUrls: ['./soat.component.css']
})
export class SoatComponent extends CommonComponent implements OnInit, OnDestroy  {


  /** componente steps para la creacion o edicion */
  @ViewChild('stepsoat') step: any;

  public index :number;
  public placa: string;

  

  ngOnInit(): void {
    this.index = 0;
    
  }

 public cerrarCaja(): void {}

 public consultarPlaca(): void {
  this.step.next();
   this.index = this.step._selectedIndex;
 }
 
  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
  
  }

}
