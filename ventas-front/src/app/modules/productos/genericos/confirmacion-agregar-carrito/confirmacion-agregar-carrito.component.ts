import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ProductosService } from '../../productos.service';
import { MessageService } from 'primeng/api';
import { ShellState } from 'src/app/states/shell/shell.state';
import { RolloColillaDTO} from 'src/app/dtos/transversal/rollo-colilla.dto'


@Component({
  selector: 'app-confirmacion-agregar-carrito',
  templateUrl: './confirmacion-agregar-carrito.component.html',
  styleUrls: ['./confirmacion-agregar-carrito.component.css'],
  providers: [ProductosService]
})

export class ConfirmacionAgregarCarritoComponent extends CommonComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: no-output-native
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() eventoCrearEditar: EventEmitter<any> = new EventEmitter();
  @Input() productoParent: string;
  isCreate = false;

  colilla = '';
  numeros = '';

  numerosSupeAstro = []
  loteriasAstros = []
  listaValores = []


  loterias = '';
  apostado = 0;
  iva = 0;
  total = 0;
  public idRollo: number;
  public rolloColilla : RolloColillaDTO;
  public idUsuario: number;

  super_astro = false;
  


  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private shellState: ShellState
  ) {
    super();
  }

  ngOnInit(): void {
    if(this.productoParent == 'super-astro') {
      this.super_astro = true;
    } else {
      this.super_astro = false;
    }
  }


  validEventoCrearEditar(){
    this.eventoCrearEditar.emit(true);
  }

  closePopupE(): void {
    this.closePopup.emit(false);
  }



  ngOnDestroy(): void {
    this.messageService.clear();
  }

}
