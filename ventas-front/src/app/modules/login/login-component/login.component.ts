import { Component, OnInit } from '@angular/core';
import { AutenticacionRequestDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-request.dto';
import { CommonComponent } from 'src/app/utilities/common.component';
import { ShellState } from 'src/app/states/shell/shell.state';
import { BienvenidaRequestDTO } from 'src/app/dtos/seguridad/bienvenida/bienvenida-request.dto';
import { SeguridadService } from '../seguridad.service';
import { TransversalConstant } from 'src/app/constants/transversal.constant';
import { VentanaModalModel } from 'src/app/model-component/ventana-modal.model';
import { PapeleriaRolloDTO } from 'src/app/dtos/transversal/papeleria-rollo.dto';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';

/**
 * Componente para la autenticacion del sistema ADMIN
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SeguridadService]
})
export class LoginComponent extends CommonComponent implements OnInit {

  /** Indica si ya se dio submit para la creacion o edicion de roles */
  public isSubmit: boolean;

  /** Se utiliza para capturar las credenciales del usuario */
  public credenciales: AutenticacionRequestDTO;

  /** Contiene el mensaje de error presentada en la autenticacion */
  public msjError: string;

  /** Se utiliza para visualizar el modal de salida de saldo */
  public modalOperatividad: VentanaModalModel;
  /** Contiene la información del inicio de operaciones */
  public serieOperacion: PapeleriaRolloDTO;

  /** Contiene la información de bienvenida */
  public request: BienvenidaRequestDTO;

  /** Contiene la información de autenticación */
  public dataAutenticacion: AutenticacionResponseDTO;

  public listaSeries: PapeleriaRolloDTO[];

  /**
   * @param shellState, se utiliza para notificar el inicio de sesion
   * @param SeguridadService, contiene los servicios para la autenticacion
   * @param router, Router para la navegacion a la pagina bienvenida
   */
  constructor(
    private shellState: ShellState,
    private seguridadService: SeguridadService) {
    super();
  }

  /**
   * Aca se debe inicializar las variables globales del LOGIN
   */
  ngOnInit() {
    this.init();
  }

  /**
   * Metodo que soporta el evento click del boton iniciar sesion
   */
  public iniciarSesion(formLogin): void {

    // se valida la nulalidad de las credenciales
    if (this.credenciales && this.credenciales.claveIngreso && this.credenciales.usuarioIngreso) {

      // se procede a iniciar sesion en el sistema
      this.seguridadService.iniciarSesion(this.credenciales).subscribe(
        dataAutenticacion => {

          // se procede a obtener lo datos de bienvenida de la app
          this.request = new BienvenidaRequestDTO();
          this.request.idUsuario = dataAutenticacion.usuario.idUsuario;
          this.request.idAplicacion = TransversalConstant.ID_APLICACION_VENTAS;
          this.dataAutenticacion = dataAutenticacion;
          if (dataAutenticacion.usuario.administrador) {
            this.iniciarSesionUsuario(formLogin,);
          }
          else {
            this.obtnerSeriesVendedor(this.request.idUsuario);

          }

        },
        error => {
          this.showError(error, formLogin);
        }
      );

    }
  }

  /**
   * Metodo que es ejecutado antes de invocar el metodo iniciar sesion
   */
  public beforeIniciarSesion(): boolean {
    this.msjError = null;
    return true;
  }

  /**
   * Metodo que permite inicializar las variables globales
   */
  private init(): void {
    this.credenciales = new AutenticacionRequestDTO();
  }

  /**
   * Metodo que permite mostrar el error al momento consumir una API
   */
  private showError(error, formLogin): void {
    this.msjError = this.showMensajeError(error);
    this.credenciales.claveIngreso = null;
    formLogin.submitted = false;
  }


  /**
   * Método encargado de iniciar operaciones
   * @param formLogin 
   */
  public iniciarOperacion(formLogin): void {
    if (this.serieOperacion.serie && this.serieOperacion.rangoInicial) {
      this.iniciarSesionUsuario(formLogin);
    }
    else {
      this.isSubmit = true;
      return;
    }

  }

  /**
   * Método encargado de obtener la lista de rollos asociados a un vendedor
   * @param idVendedor 
   */
  public obtnerSeriesVendedor(idVendedor): void {
    this.listaSeries = [];
    this.isSubmit = false;
    this.seguridadService.obtenerSeriesVendedor(idVendedor).subscribe(
      data => {
        if (data.length > 0) {
          this.listaSeries = data;
          this.serieOperacion = new PapeleriaRolloDTO();
          this.modalOperatividad = new VentanaModalModel();
          this.modalOperatividad.showModal(this.modalOperatividad);
        } 
       
      },
      error => {
        this.showError(error, idVendedor);
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
    this.dataAutenticacion.usuario.idRollo = serie.idRollo;

  }



  /**
   * Método que permite ingresar a las opciones de de la aplicación
   * @param formLogin 
   */
  public iniciarSesionUsuario(formLogin): void {
    this.seguridadService.getDatosBienvenida(this.request).subscribe(
      dataBienvenida => {
        // se indica el shell que hay un nuevo inicio de sesion
        this.shellState.iniciarSesion(dataBienvenida, this.dataAutenticacion);
      },
      error => {
        this.showError(error, formLogin);
      }
    );
  }

 


}
