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



@Component({
  selector: 'app-soat',
  templateUrl: './soat.component.html',
  styleUrls: ['./soat.component.css'],
  providers: [CommonService],
})
export class SoatComponent extends CommonComponent implements OnInit, OnDestroy {


  /** componente steps para la creacion o edicion */
  @ViewChild('stepsoat') step: any;

  public index: number;
  public placa: string;
  public autorizacion: boolean;

  /** Datos del tomador */
  public tomadorDTO: TomadorDTO;
  /** Variable que almacena el tipo de documento */
  public itemsTipoDocumento: SelectItem[];

  /** constante para el idioma espaniol para los calendar */
  public CALENDAR_SPANISH = LabelsConstant.CALENDAR_SPANISH;

   /** Indica si ya se dio submit para la creacion del tomador */
   public isSubmit: boolean;


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
    numeroCelular: new FormControl('', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
     correo: new FormControl('', [Validators.required, Validators.email]),
    fechaInicioVigencia: new FormControl('', [Validators.required])
  

  });
  constructor(
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService

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
    this.tomadorDTO = new TomadorDTO();
    this.index = 0;
    this.obtenerTiposDocumento();
  }

  public cerrarCaja(): void { }


 

  public consultarPlaca(): void {
    this.step.next();
    this.index = this.step._selectedIndex;
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




  public pagar(): void { }

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
        const clientSend = {
          tipoDocumento : this.tomadorForm.get('tipoDocumento').value,
          numeroDocumento: this.tomadorForm.get('numeroDocumento').value,
          nombres: this.tomadorForm.get('nombres').value,
          apellidos: this.tomadorForm.get('apellidos').value,
          fechaNacimiento : this.tomadorForm.get('fechaNacimiento').value,
          ciudad : this.tomadorForm.get('ciudad').value,
          direccion : this.tomadorForm.get('direccion').value,
          numeroCelular : this.tomadorForm.get('numeroCelular').value,
          correo : this.tomadorForm.get('correo').value,
          fechaInicioVigencia : this.tomadorForm.get('fechaInicioVigencia').value
          
        };
         // se indica que ya se dio commit
        this.isSubmit = false;
       // this.createTomadorService(clientSend);
       this.step.next();
       this.index = this.step._selectedIndex;
    } else {
       // se indica que ya se dio commit
       this.isSubmit = true;
      this.messageService.add(MsjUtil.getToastErrorMedium('Por favor diligenciar todos los campos'));
    }
  }


}
