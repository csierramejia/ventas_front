import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TomadorDTO } from 'src/app/dtos/soat/tomador.dto';
import { EstadosConstant } from 'src/app/constants/estados.constant';
import { SelectItem } from 'primeng/api';
import { CommonComponent } from 'src/app/utilities/common.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/utilities/common.service';
import { ItemFiltroDTO } from 'src/app/dtos/transversal/item-filtro.dto';
import { MsjUtil } from 'src/app/utilities/messages.util';
import { LabelsConstant } from 'src/app/constants/labels.constant';
import { RecaudosService } from '../recaudos.service';
import { SpinnerState } from 'src/app/states/spinner.state';
import { VehiculoDTO } from 'src/app/dtos/soat/vehiculo.dto';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { TipoEventoConstant } from 'src/app/constants/tipo-evento.constant';
import { SessionStoreUtil } from 'src/app/utilities/session-store.util';
import { MsjFrontConstant } from 'src/app/constants/messages-frontend.constant';



@Component({
  selector: 'app-soat',
  templateUrl: './soat.component.html',
  styleUrls: ['./soat.component.css'],
  providers: [CommonService, RecaudosService],
})
export class SoatComponent extends CommonComponent implements OnInit, OnDestroy {


  /** componente steps para la creacion o edicion */
  @ViewChild('stepsoat') step: any;

  public index: number;
  public placa: string;
  public autorizacion: boolean;
  public activaPasoDatos: boolean;
  public activaPasoPago: boolean;


  /** Datos del tomador */
  public tomadorDTO: TomadorDTO;

  /** Datos del vehículo */
  public vehiculoDTO: VehiculoDTO;
  /** Variable que almacena el tipo de documento */
  public itemsTipoDocumento: SelectItem[];

  /** constante para el idioma espaniol para los calendar */
  public CALENDAR_SPANISH = LabelsConstant.CALENDAR_SPANISH;

  /** Placa vehículo 3 letras , 2 numeros y 1 letra o 3 números */
  public static readonly PLACA_VEHICULO: RegExp = /^[a-zA-Z]{3}[0-9]{3}$/;;


  /** Indica si ya se dio submit para la creacion del tomador */
  public isSubmit: boolean;

  /** Dto que contiene los datos de la autenticacion */
  private auth: AutenticacionResponseDTO;


  /**
 * @param messageService, Se utiliza para la visualizacion
 * de los mensajes en la pantalla
 *
 * @param confirmationService, se utiliza para mostrar el
 * modal de confirmacion para diferente procesos
 *
 * @param administracionService, se utiliza para consumir
 * los servicios relacionados a este proceso negocio
 *
 * @param commonService, se utiliza para obtener los items companias
 *
 * @param spinnerState, se utiliza para simular el spinner
 */


  tomadorForm = new FormGroup({
    tipoDocumento: new FormControl('', [Validators.required]),
    numeroDocumento: new FormControl('', [Validators.required]),
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    numeroCelular: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    fechaInicioVigencia: new FormControl('', [Validators.required])


  });
  constructor(
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private recaudosService: RecaudosService,
    private spinnerState: SpinnerState

  ) {
    super();
  }


  /**
   * Se debe inicializar las variables cuando se crea el component
   */
  ngOnInit(): void {
    this.init();


  }

  /**
   * Metodo que es invocado al momento de la creacion
   * del componente, donde se procede a consultar los
   * datos iniciales requeridos de la funcionalidad
   */
  private init(): void {
    this.vehiculoDTO = new VehiculoDTO();
    this.activaPasoDatos = true;
    this.activaPasoPago = true;
    // se obtiene los datos de la autenticacion
    this.auth = SessionStoreUtil.auth(TipoEventoConstant.GET);
    this.index = 0;
    this.obtenerTiposDocumento();
  }




  /**
   * Método encargado de consultar un vehículo por placaS
   */
  public consultarPlaca(): void {
    this.spinnerState.displaySpinner();
    setTimeout(() => {
      this.vehiculoDTO = new VehiculoDTO();
      if (this.placa) {
        this.recaudosService.consultarVehiculoPorPlaca(this.placa).subscribe(
          (data) => {
            if (data.placa) {
              this.vehiculoDTO = data;
              this.step.next();
              this.index = this.step._selectedIndex;
              this.isSubmit = false;
              this.activaPasoDatos = false;
            }
            else {
              this.messageService.add(MsjUtil.getMsjError('La placa ingresada no se encuentra en el sistema'));
            }
          },
          (error) => {
            this.messageService.add(
              MsjUtil.getMsjError(this.showMensajeError(error))
            );
          }
        );
        this.isSubmit = false;
      }
      else {
        this.isSubmit = true;
        this.messageService.add(MsjUtil.getToastErrorMedium('Por favor ingresar la placa del vehículo'));

      }

      this.spinnerState.hideSpinner();
    }, 100);
  }

  /**
   * Se utiliza para limpiar los mensajes visualizados pantalla y titulos
   */
  ngOnDestroy(): void {

  }

  /**
   * Permite obtener los tipos de documentos existentes en el sistema
   */
  public obtenerTiposDocumento(): void {

    // se consultan los items de los tipos de documentos ACTIVOS
    const filtroTipDocs = new ItemFiltroDTO();
    filtroTipDocs.estado = EstadosConstant.ACTIVO;
    this.itemsTipoDocumento = [];
    this.commonService.getItemsTiposDocumentos(filtroTipDocs).subscribe(
      (data) => {
        this.itemsTipoDocumento = data;
      },
      (error) => {
        this.messageService.add(
          MsjUtil.getMsjError(this.showMensajeError(error))
        );
      }
    );

  }

  /**
   * 
   * @description Funcion que permite valida que el usuario
   * solo ingrese numeros en los campos donde se espera solo numeros
   * @param e
   */
  keyPressNumber(e) {
    const key = window.Event ? e.which : e.keyCode;
    e.key.replace(/\D|\-/, '');
    return (key >= 48 && key <= 57);
  }

  /**
   * 
   * @description Funcion que permite valida que el usuario
   * solo ingrese letras en los campos donde se espera solo letras
   * @param e
   */
  keyPressChart(e) {
    const filtro = '1234567890'; // Caracteres invalidos
    for (let i = 0; i < e.key.length; i++) {
      console.log(filtro.indexOf(e.key.charAt(i)) === -1);
      if (filtro.indexOf(e.key.charAt(i)) === -1) {
        return true;
      } else {
        return false;
      }
    }
  }


  /**
 * 
 * @description Funcion que permite valida que el usuario
 * solo ingrese letras en los campos donde se espera solo letras
 * @param e
 */
  keyPressPlaca(e) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    for (let i = 0; i < e.key.length; i++) {
      if (!regex.test(e.key.charAt(i))) {
        return false;
      }
      return true;
    }
  }


  /**
   * Método quer permite realizar el pago del soat
   */
  public pagar(): void {
    this.spinnerState.displaySpinner();
    setTimeout(() => {

      this.tomadorDTO = new TomadorDTO();
      this.tomadorDTO.idUsuario = this.auth.usuario.idUsuario;
      this.tomadorDTO.tipoDocumento = this.tomadorForm.get('tipoDocumento').value;
      this.tomadorDTO.numeroDocumento = this.tomadorForm.get('numeroDocumento').value;
      this.tomadorDTO.nombres = this.tomadorForm.get('nombres').value;
      this.tomadorDTO.apellidos = this.tomadorForm.get('apellidos').value;
      this.tomadorDTO.fechaNacimiento = this.tomadorForm.get('fechaNacimiento').value;
      this.tomadorDTO.ciudad = this.tomadorForm.get('ciudad').value;
      this.tomadorDTO.direccion = this.tomadorForm.get('direccion').value;
      this.tomadorDTO.numeroCelular = this.tomadorForm.get('numeroCelular').value;
      this.tomadorDTO.correo = this.tomadorForm.get('correo').value;
      this.tomadorDTO.fechaInicioVigencia = this.tomadorForm.get('fechaInicioVigencia').value;
      this.tomadorDTO.vehiculo = this.vehiculoDTO;
      this.tomadorDTO.idTipoTransaccion = 2;
      this.tomadorDTO.idCanal = 1;
      this.tomadorDTO.idEmpresa = 1;
      this.tomadorDTO.idCliente = 0;
      this.tomadorDTO.idDispositivo = 1;
      this.tomadorDTO.idProducto = 0;

      this.recaudosService.registrarPagoTomador(this.tomadorDTO).subscribe(
        (data) => {
          this.vehiculoDTO = data;
          this.placa = null;
          this.isSubmit = false;
          this.messageService.add(MsjUtil.getToastSuccessMedium('Transacción realizada exitosamente'));
          this.activaPasoDatos = true;
          this.activaPasoPago = true;
          this.step.reset();
        },
        (error) => {
          this.messageService.add(
            MsjUtil.getMsjError(this.showMensajeError(error))
          );
        }
      );
      this.isSubmit = false;


      this.spinnerState.hideSpinner();
    }, 100);

  }

  /**
  * @author Jhon Rivera
  * @description Metodo que se encarga de validar
  * si van los campos obligatorios para almacenar el tomador
  */
  public comprar(): void {
    this.messageService.clear();
    if (
      this.tomadorForm.get('tipoDocumento').valid &&
      this.tomadorForm.get('numeroDocumento').valid &&
      this.tomadorForm.get('nombres').valid &&
      this.tomadorForm.get('apellidos').valid &&
      this.tomadorForm.get('fechaNacimiento').valid &&
      this.tomadorForm.get('ciudad').valid &&
      this.tomadorForm.get('direccion').valid &&
      this.tomadorForm.get('numeroCelular').valid &&
      this.tomadorForm.get('correo').valid &&
      this.tomadorForm.get('fechaInicioVigencia').valid &&
      this.autorizacion
    ) {

      // se indica que ya se dio commit
      this.isSubmit = false;
      this.step.next();
      this.index = this.step._selectedIndex;
      this.activaPasoPago = false;
    } else {
      // se indica que ya se dio commit
      this.isSubmit = true;
      this.messageService.add(MsjUtil.getToastErrorMedium('Por favor diligenciar todos los campos'));
    }
  }


  /**
  * Metodo que permite validar la placa d
  */
  public static isPlacaValido(cadena: string): boolean {
    return this.PLACA_VEHICULO.test(cadena);
  }


  /**
   * Metodo que permite capturar el evento de los pasos 
   * @param event 
   */
  public onStepChange(event: any): void {

  }

  /**
   * Metodo que permite consultar oprimiendo enter
   */
  public onEnter(event) {
    this.consultarPlaca();
  }



  /**
   * Método que permite limpiar la placa del vehículo
   */
  public volver(): void {
    // se muestra el mensaje de confirmacion
    this.confirmationService.confirm({
      message: MsjFrontConstant.SEGURO_SALIR,
      header: MsjFrontConstant.CONFIRMACION,
      accept: () => {

        // se limpia los datos 
        this.spinnerState.displaySpinner();
        setTimeout(() => {
          this.messageService.clear();
          this.placa = null;
          this.activaPasoDatos = true;
          this.activaPasoPago = true;
          this.step.reset();
          this.spinnerState.hideSpinner();
        }, 100);
      }
    });

  }

}
