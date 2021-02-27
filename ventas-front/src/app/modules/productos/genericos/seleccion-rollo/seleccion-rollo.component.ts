import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { CommonComponent } from 'src/app/utilities/common.component';
import { VentanaModalModel } from 'src/app/model-component/ventana-modal.model';
import { PapeleriaRolloDTO } from 'src/app/dtos/transversal/papeleria-rollo.dto';
import { ProductosService } from '../../productos.service';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { SessionStoreUtil } from 'src/app/utilities/session-store.util';
import { TipoEventoConstant } from 'src/app/constants/tipo-evento.constant';

import { UserAccountST } from '../../../../states/shell/shell-states/user-account.st';


/**
 * Componente para la autenticacion del sistema ADMIN
 */
@Component({
  selector: 'app-seleccion-rollo',
  templateUrl: './seleccion-rollo.component.html',
  styleUrls: ['./seleccion-rollo.component.css'],
  providers: [ProductosService]
})
export class SeleccionRolloComponent extends CommonComponent implements OnInit {

  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() enviaRollo: EventEmitter<PapeleriaRolloDTO> = new EventEmitter();

  /** Indica si ya se dio submit para la creacion o edicion de roles */
  public isSubmit: boolean;

  /** Se utiliza para visualizar el modal de salida de saldo */
  public modalOperatividad: VentanaModalModel;
  /** Contiene la información del inicio de operaciones */
  public serieOperacion: PapeleriaRolloDTO;

  /** Lista de colillas disponibles para consumir */
  public listaSeries: PapeleriaRolloDTO[];

  /** Dto que contiene los datos de la autenticacion */
  private auth: AutenticacionResponseDTO;

   /** Administra el estado de la cuenta de usuario */
   public userAccount: UserAccountST;

    /** Contiene la información de autenticación */
  public dataAutenticacion: AutenticacionResponseDTO;

  constructor( private productosService: ProductosService
   ) {
    super();
    // se obtiene los datos de la autenticacion
    this.auth = SessionStoreUtil.auth(TipoEventoConstant.GET);
     // Estado para administrar la cuenta del usuario
   this.userAccount = new UserAccountST();
   this.serieOperacion = new PapeleriaRolloDTO();
  }

  /**
   * Aca se debe inicializar las variables globales del LOGIN
   */
  ngOnInit() {
    this.init();
  }

  
  /**
   * Metodo que permite inicializar las variables globales
   */
  private init(): void {
       this.obtnerSeriesVendedor(this.auth.usuario.idUsuario);
       
   }


  

  /**
   * Método encargado de obtener la lista de rollos asociados a un vendedor
   * @param idVendedor 
   */
  public obtnerSeriesVendedor(idVendedor): void {
    this.listaSeries = [];
   
    this.productosService.obtenerSeriesVendedor(idVendedor).subscribe(
      data => {
        if (data.length > 0) {
          this.listaSeries = data;
          this.modalOperatividad = new VentanaModalModel();
         }
        else { return; }

      },
      error => {
        this.showMensajeError(error);
      }
    );

  }

  /**
   * Método que permite seleccionar la serie para inicio de operaciones
   * @param serie 
   */
  public seleccionarSerie(serie: PapeleriaRolloDTO) {
    this.serieOperacion.serie = serie.serie;
    this.serieOperacion.rangoInicial = serie.rangoInicial;
    this.serieOperacion.nroInicialSerie = serie.nroInicialSerie;
    this.serieOperacion.idRollo = serie.idRollo;
    this.dataAutenticacion = this.auth;
    this.dataAutenticacion.usuario.idRollo = serie.idRollo;
   

  }


/**
   * Método encargado de iniciar operaciones
   *
   */
  public iniciarOperacion(): void {
    if (this.serieOperacion.serie && this.serieOperacion.rangoInicial) {
      this.userAccount.changeStateAutenticado(this.dataAutenticacion);
      this.dataAutenticacion = this.auth;
      this. iniciaOperacion();
      this.closePopup.emit(false);
    }
    else {
      this.isSubmit = true;
      return;
    }

  }
 
  closeModal(): void {
    this.closePopup.emit(false);
  }

  iniciaOperacion():void {
    let papeleriaRolloDTO = new PapeleriaRolloDTO;
    papeleriaRolloDTO.serie = this.serieOperacion.serie;
    papeleriaRolloDTO.rangoInicial = this.serieOperacion.rangoInicial;
    papeleriaRolloDTO.nroInicialSerie = this.serieOperacion.nroInicialSerie;
    papeleriaRolloDTO.idRollo = this.serieOperacion.idRollo;
    this.enviaRollo.emit(papeleriaRolloDTO);

  }


}
