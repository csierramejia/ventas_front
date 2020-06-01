import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ContentComponent } from '../../modules/shell/content/content.component';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ScreenST } from './shell-states/screen.st';
import { MenuST } from './shell-states/menu.st';
import { UserAccountST } from './shell-states/user-account.st';
import { BreadCrumbST } from './shell-states/breadcrumb.st';
import { RouterConstant } from 'src/app/constants/router.constant';
import { BienvenidaResponseDTO } from 'src/app/dtos/seguridad/bienvenida/bienvenida-response.dto';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { VentanaModalModel } from 'src/app/model-component/ventana-modal.model';
import { SessionStoreUtil } from 'src/app/utilities/session-store.util';
import { TipoEventoConstant } from 'src/app/constants/tipo-evento.constant';

/**
 * Se utiliza para administrar el estado del Shell de la aplicacion
 */
@Injectable({ providedIn: 'root' })
export class ShellState {

  /** Administra el estado de la pantalla del dispositivo */
  public screen: ScreenST;

  /** Administra el estado de la miga de pan */
  public breadCrumb: BreadCrumbST;

  /** Administra el estado del menu de la aplicacion */
  public menu: MenuST;

  /** Administra el estado de la cuenta de usuario */
  public userAccount: UserAccountST;

  /** Componente del shell content para manipular el scroll del DIV content main */
  public contentComponent: ContentComponent;

  /** Se utiliza para visualizar el modal timeout */
  public modalTimeOut: VentanaModalModel;

  /** cuenta regresiva para el timeout */
  public countdownIdle: string;

  /**
   * @param router, se utiliza para ser notificado cuando el router cambia
   * @param idle, se utiliza para activar el timeout
   * @param keepalive, se utiliza para hacer ping en la conexion
   */
  constructor(
    private router: Router,
    private idle: Idle,
    private keepalive: Keepalive, ) {

    // Estado para notificar el tamanio de la pantalla
    this.screen = new ScreenST();

    // Estado para administrar la cuenta del usuario
    this.userAccount = new UserAccountST();

    // Estado para administar la miga de pan
    this.breadCrumb = new BreadCrumbST();

    // Se utiliza para administrar el estado del Menu
    this.menu = new MenuST(this.screen, this.breadCrumb, this.router);

    // Se configura el timeout
    this.initIdle();

    // Se inicia el time out si existe una autenticacion
    this.initTimeOut();
  }

  /**
   *
   * Metodo que soporta el evento iniciar sesion del login
   *
   * @param dataBienvenida, DTO con los datos de bienvenida
   * @param dataAutenticacion, DTO con los datos de la autenticacion
   */
  public iniciarSesion(
    dataBienvenida: BienvenidaResponseDTO,
    dataAutenticacion: AutenticacionResponseDTO): void {

    // se cambia el estado de la cuenta a sesion iniciada
    this.userAccount.changeStateAutenticado(dataAutenticacion);

    // se construye el menu de la aplicacion
    this.menu.initMenu(dataBienvenida.itemsMenu);

    // se inicia el timeout sesion
    this.idle.watch();

    // se redirecciona a la pagina de bienvenida
    this.router.navigate([RouterConstant.NAVIGATE_BIENVENIDA]);
  }

  /**
   * Metodo que soporta el evento cerrar sesion del menu
   */
  public cerrarSesion(): void {

    // se cambia el estado de la cuenta a sesion cerrada
    this.userAccount.changeStateSesionCerrada();

    // se destruye el menu para limpiar memoria
    this.menu.destroyMenu();

    // se para el timeout sesion
    this.idle.stop();

    // se redirecciona al LOGIN
    this.router.navigate([RouterConstant.NAVIGATE_LOGIN]);
  }

  /**
   * Metodo que soporta el evento click del boton permanecer del modal timeout
   */
  public permanecer(): void {
    this.idle.watch();
    this.modalTimeOut.closeModal();
  }

  /**
   * Metodo que soporta el evento click del boton salir del modal timeout
   */
  public salir(): void {
    this.cerrarSesion();
    this.modalTimeOut.closeModal();
  }

  /**
   * Metodo que permite configurar el timeout
   */
  private initIdle(): void {

    // se configura el tiempo del timeout por 15 minutos
    this.idle.setIdle(900);

    // se configura el timeout periodo
    this.idle.setTimeout(15);

    // establece las interrupciones predeterminadas, en este caso,
    // cosas como clics, desplazamientos, toques del documento
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // ping de conexion cada 15 segundos
    this.keepalive.interval(15);

    // se activa cuando dectecta algun action
    this.idle.onIdleEnd.subscribe(() => {
      this.idle.watch();
    });

    // se cierra sesion cuando se cumple timeout
    this.idle.onTimeout.subscribe(() => {
      this.salir();
    });

    // se activa cuando se empieza la cuenta regresiva
    this.idle.onIdleStart.subscribe(() => {
       // se abre el modal
       if (this.modalTimeOut == null) {
        this.modalTimeOut = new VentanaModalModel();
       }
       this.modalTimeOut.showModal(null);
    });

    // cuenta regresiva para el timeout
    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.countdownIdle = countdown;
    });
  }

  /**
   * Metodo que permite configurar el timeOut cuando
   * existe una autenticacion en el session store
   */
  private initTimeOut() {
    const auth: AutenticacionResponseDTO = SessionStoreUtil.auth(TipoEventoConstant.GET);
    if (auth && auth.usuario && auth.usuario.idUsuario) {
      this.idle.watch();
    }
  }
}
