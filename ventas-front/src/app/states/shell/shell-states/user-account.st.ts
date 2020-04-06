import { TipoEventoConstant } from './../../../constants/tipo-evento.constant';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { SessionStoreUtil } from 'src/app/utilities/session-store.util';

/**
 * Estado para administrar la cuenta del usuario
 */
export class UserAccountST {

  /** Son los datos de la utenticacion */
  public auth: AutenticacionResponseDTO;

  /**
   * Cuando se carga la pagina se crea la instancia del
   * estado de la cuenta del user, se debe tomar los datos
   * del session-store, dado que en este punto son nulos
   */
  constructor() {
    this.init();
  }

  /**
   * Metodo que es invocado del constructor de este State
   */
  private init(): void {
    this.auth = SessionStoreUtil.auth(TipoEventoConstant.GET);
  }

  /**
   * Metodo que permite cambiar el estado a autenticado
   *
   * @param datos, contiene los datos de la autenticacion
   */
  public changeStateAutenticado(autenticacion: AutenticacionResponseDTO): void {

    // Se configura los datos de la autenticacion en el session-store
    SessionStoreUtil.auth(TipoEventoConstant.SET, autenticacion);

    // se configura los datos del usuario
    this.auth = autenticacion;
  }

  /**
   * Metodo que permite cambiar el estado a sesion cerrada
   */
  public changeStateSesionCerrada(): void {

    // Se limpia todo los registros del local-store
    SessionStoreUtil.cleanAll();

    // Se limpia las variables globales para notificar los demas componentes
    this.auth = null;
  }
}
