import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SpinnerState } from 'src/app/states/spinner.state';

/**
 * Componente para las ventas de las loterias virtual
 */
@Component({
  templateUrl: './loteria-virtual.component.html',
  styleUrls: ['./loteria-virtual.component.css']
})
export class LoteriaVirtualComponent extends CommonComponent implements OnInit, OnDestroy {

  /**
   * @param messageService, Se utiliza para la visualizacion
   * de los mensajes en la pantalla
   *
   * @param confirmationService, se utiliza para mostrar el
   * modal de confirmacion para diferente procesos
   *
   * @param spinnerState, se utiliza para simular el spinner
   */
  constructor(
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinnerState: SpinnerState) {
    super();
  }

  /**
   * Se debe inicializar las variables cuando se crea el component
   */
  ngOnInit(): void {
    this.init();
  }

  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla
   */
  ngOnDestroy(): void {
    this.messageService.clear();
  }

  /**
   * Metodo que es invocado al momento de la creacion
   * del componente, donde se procede a consultar los
   * datos iniciales requeridos de la funcionalidad
   */
  private init(): void {
  }
}
