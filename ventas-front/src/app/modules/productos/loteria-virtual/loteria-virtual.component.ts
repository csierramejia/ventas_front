import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SpinnerState } from 'src/app/states/spinner.state';
import { LoteriaVirtualConfiguracionDTO } from 'src/app/dtos/productos/loteria-virtual/loteria-virtual-configuracion.dto';

/**
 * Componente para las ventas de las loterias virtual
 */
@Component({
  templateUrl: './loteria-virtual.component.html',
  styleUrls: ['./loteria-virtual.component.css']
})
export class LoteriaVirtualComponent extends CommonComponent implements OnInit, OnDestroy {

  /** Se utiliza para mostrar la fecha-hora actual */
  public fechaActual = new Date();

  /** Son las loterias con sus configuraciones */
  public loterias: Array<LoteriaVirtualConfiguracionDTO>;

  /** Es la loteria seleccionada para el proceso */
  public loteriaSeleccionada: LoteriaVirtualConfiguracionDTO;

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
   * Metodo que permite soporta el evento click de las loteria a seleccionar
   */
  public seleccionarLoteria(loteria: LoteriaVirtualConfiguracionDTO): void {
    this.loteriaSeleccionada = loteria;
  }

  /**
   * Metodo que es invocado al momento de la creacion
   * del componente, donde se procede a consultar los
   * datos iniciales requeridos de la funcionalidad
   */
  private init(): void {
    this.loterias = new Array<LoteriaVirtualConfiguracionDTO>();
    const loteria1 = new LoteriaVirtualConfiguracionDTO();
    loteria1.loteria = 'Quindio';
    loteria1.id = 1;
    const loteria2 = new LoteriaVirtualConfiguracionDTO();
    loteria2.loteria = 'Pereira';
    loteria2.id = 2;
    const loteria3 = new LoteriaVirtualConfiguracionDTO();
    loteria3.loteria = 'Manizales';
    loteria3.id = 3;
    const loteria4 = new LoteriaVirtualConfiguracionDTO();
    loteria4.loteria = 'Medellin';
    loteria4.id = 4;
    const loteria5 = new LoteriaVirtualConfiguracionDTO();
    loteria5.loteria = 'Bogota';
    loteria5.id = 5;
    this.loterias.push(loteria1);
    this.loterias.push(loteria2);
    this.loterias.push(loteria3);
    this.loterias.push(loteria4);
    this.loterias.push(loteria5);
  }
}
