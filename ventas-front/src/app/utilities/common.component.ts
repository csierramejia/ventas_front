import { HttpErrorResponse } from '@angular/common/http';
import { MessagesBackendConstant } from './../constants/messages-backend.constant';
import { MessagesBackendKeyConstant } from '../constants/messages-backend-key.constant';
import { ErrorResponse } from './error-response';
import { TransversalConstant } from '../constants/transversal.constant';
import { SelectItem } from 'primeng/api';

/**
 * Contiene los metodos comunes para los componentes de la aplicacion,
 * los componentes deben heredar de esta clase
 */
export class CommonComponent {

  /**
   * Metodo que permite mostrar solo el mensaje de error
   *
   * @param error, Es el Http error retornado del servidor
   */
  protected showMensajeError(error: HttpErrorResponse): string {
    const errorResponse: ErrorResponse = this.getErrorResponse(error);
    if (errorResponse && errorResponse.mensaje) {
      return errorResponse.mensaje.mensaje;
    }
    return MessagesBackendConstant.INTERNAL_SERVER_ERROR;
  }

  /**
   * Metodo que permite construir el mensaje de error con el
   * codigo del status de un error-response del servidor
   *
   * @param error, Es el Http error retornado del servidor
   * @returns Objecto construido con el mensaje y codigo-status del error
   */
  protected getErrorResponse(error: HttpErrorResponse): ErrorResponse {
    const status: number = error.status;
    let mensaje: string;

    // se valida si hay codigo del mensaje en el body del error
    if (error.error && error.error.mensaje) {

      // del server siempre llega el codigo del mensaje
      const codigoMensaje: string = error.error.mensaje;

      // se valida el status-response
      switch (status) {

        // status para los errores de negocio
        case TransversalConstant.BAD_REQUEST: {
          mensaje = this.getBusinessMessage(codigoMensaje);
          break;
        }

        // status cuando intentan ingresar un recurso sin el TOKEN
        case TransversalConstant.UNAUTHORIZED: {
          mensaje = MessagesBackendConstant.AUTORIZACION_FALLIDA;
          break;
        }

        // si no es ninguna de las anteriores, se define como internal server error
        default: {
          mensaje = MessagesBackendConstant.INTERNAL_SERVER_ERROR + codigoMensaje;
          break;
        }
      }
    } else {
      if (error.error && error.error.message) {
        mensaje = error.error.message;
      } else {
        mensaje = MessagesBackendConstant.INTERNAL_SERVER_ERROR;
      }
    }

    // se construye el errorResponse a retornar
    const errorResponse: ErrorResponse = new ErrorResponse();
    errorResponse.mensaje.mensaje = mensaje;
    errorResponse.status = status;
    return errorResponse;
  }

  /**
   * Metodo remueve los espacios en blanco del comienzo y final
   */
  protected setTrim(valor: string): string {
    return (valor) ? valor.trim() : valor;
  }

  /**
   * Metodo remueve los espacios en blanco del comienzo y final
   * para los componentes de filtro de busqueda
   */
  protected setTrimFilter(valor: string): string {
    valor = (valor) ? valor.trim() : null;
    valor = (valor !== null && valor.length === 0) ? null : valor;
    return valor;
  }

  /**
   * Metodo que permite obtener el business mensaje que corresponsa al codigo
   */
  private getBusinessMessage(codBusinessMsj: string): string {
    let businessMsj = '';

    // se verifica que tipo de business msj corresponde
    switch (codBusinessMsj) {

      case MessagesBackendKeyConstant.KEY_AUTENTICACION_FALLIDA: {
        businessMsj = MessagesBackendConstant.AUTENTICACION_FALLIDA;
        break;
      }

      case MessagesBackendKeyConstant.KEY_CREDENCIALES_INCORRECTOS: {
        businessMsj = MessagesBackendConstant.CREDENCIALES_INCORRECTOS;
        break;
      }

      case MessagesBackendKeyConstant.KEY_CODIGO_LOTERIA_DUPLICADO: {
        businessMsj = MessagesBackendConstant.CODIGO_LOTERIA_DUPLICADO;
        break;
      }

      case MessagesBackendKeyConstant.KEY_CREDENCIALES_INCORRECTOS: {
        businessMsj = MessagesBackendConstant.ERROR_CREAR_LOTERIA;
        break;
      }

      case MessagesBackendKeyConstant.KEY_ID_FIND_NULO: {
        businessMsj = MessagesBackendConstant.ID_FIND_NULO;
        break;
      }

      case MessagesBackendKeyConstant.KEY_NO_DATA: {
        businessMsj = MessagesBackendConstant.NO_DATA;
        break;
      }

      case MessagesBackendKeyConstant.KEY_SIN_RELACION_EMPRESA_POR_IDUSUARIO: {
        businessMsj = MessagesBackendConstant.SIN_RELACION_EMPRESA_POR_IDUSUARIO;
        break;
      }

      case MessagesBackendKeyConstant.KEY_SIN_ASOCIACION_PRODUCTOS_EMPRESA_SELECCIONADA: {
        businessMsj = MessagesBackendConstant.SIN_ASOCIACION_PRODUCTOS_EMPRESA_SELECCIONADA;
        break;
      }

      case MessagesBackendKeyConstant.KEY_SIN_ASOCIACION_COMISION_PRODUCTOS_EMPRESA: {
        businessMsj = MessagesBackendConstant.SIN_ASOCIACION_COMISION_PRODUCTOS_EMPRESA;
        break;
      }
    }
    return businessMsj;
  }

  /**
   * se utiliza para no propagar el evento y asi evitar
   * que seleccione o deseleccione la fila de la tabla
   */
  protected stopPropagation(event): void {
    if (event) {
      event.stopPropagation();
    }
  }

  /**
   * Metodo que permite obtener el label de una lista
   * de items a partir de su value
   */
  protected getLabel(items: SelectItem[], value: any): string {
    if (items && items.length && value) {
      for (const item of items) {
        if (item.value === value) {
          return item.label;
        }
      }
    }
  }
}
