import { TipoEventoConstant } from './../constants/tipo-evento.constant';
import { AutenticacionResponseDTO } from '../dtos/seguridad/autenticacion/autenticacion-response.dto';
import { TransversalConstant } from '../constants/transversal.constant';
import { MenuItemDTO } from '../dtos/seguridad/menu/menu-item.dto';

/**
 * Clase utilitaria para la administracion del sessionstore
 */
export class SessionStoreUtil {

  /** Key que representa los datos de la autenticacion del usuario */
  private static readonly KEY_AUTENTICACION: string = 'AUTH';

  /** Key que representa los datos del Menu */
  private static readonly KEY_MENU: string = 'MENU';

  /**
   * Metodo que permite administrar el DTO que contiene
   * los datos de inicio de sesion en el sistema
   */
  public static auth(evento: TipoEventoConstant, auth?: AutenticacionResponseDTO): AutenticacionResponseDTO {
    return this.implementarEvento(evento, this.KEY_AUTENTICACION, auth);
  }

  /**
   * Metodo que permite administrar los items del menu
   */
  public static menu(evento: TipoEventoConstant, items?: Array<MenuItemDTO>): Array<MenuItemDTO> {
    return this.implementarEvento(evento, this.KEY_MENU, items);
  }

  /**
   * Metodo que permite obtener el identificador del usuario autenticado
   */
  public static getIdCurrentUsuario(): number {

    // se inicializa como usuario no autenticado o no existente
    let idUsuario = TransversalConstant.ID_USUARIO_NO_EXISTE;

    // se obtiene los datos de la autenticacion
    const auth = this.auth(TipoEventoConstant.GET);

    // la autenticacion en el sistema es requerido
    if (auth && auth.usuario && auth.usuario.idUsuario) {
      idUsuario = auth.usuario.idUsuario;
    }
    return idUsuario;
  }

  /**
   * Metodo que permite limpiar todo el session-store para ADMIN
   */
  public static cleanAll(): void {
    sessionStorage.removeItem(this.KEY_AUTENTICACION);
    sessionStorage.removeItem(this.KEY_MENU);
  }

  /**
   * Metodo que permite implementar un evento solicitado
   *
   * @param evento , indica que tipo de evento es
   * @param key , identifica el key del local-store
   * @param dataUpdate , valor actualizar en el local, es opcional
   */
  private static implementarEvento(evento: TipoEventoConstant, key: string, dataUpdate?: any): any {
    // contiene el resultado a retornar, opcional
    let resultado = null;

    // se verifica que tipo de evento es solicitado
    switch (evento) {

      // evento para OBTENER algun valor del local-store
      case TipoEventoConstant.GET: {
        const value = sessionStorage.getItem(key);
        if (value) {
          resultado = JSON.parse(value);
        }
        break;
      }

      // evento para REMOVER algun valor del local-store
      case TipoEventoConstant.ELIMINAR: {
        sessionStorage.removeItem(key);
        break;
      }

      // evento para SET algun valor del local-store
      case TipoEventoConstant.SET: {
        sessionStorage.setItem(key, JSON.stringify(dataUpdate));
        break;
      }
    }
    return resultado;
  }
}
