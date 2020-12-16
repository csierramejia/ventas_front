import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductosService } from '../../productos.service';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { NotificacionSoportePagoDTO } from 'src/app/dtos/correos/notificacion-soporte-pago.dto';

@Component({
  selector: 'app-summary-footer',
  templateUrl: './summary-footer.component.html',
  styleUrls: ['./summary-footer.component.css'],
  providers: [ProductosService]
})

export class SummaryFooterComponent extends CommonComponent implements OnInit, OnDestroy  {


  constructor(
    private productosService: ProductosService,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private shellState: ShellState
  ) {
    super();
  }

  ngOnInit(): void {
  }







  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

}
