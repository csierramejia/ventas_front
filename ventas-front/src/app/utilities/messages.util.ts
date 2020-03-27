import { Message } from 'primeng/api/message';
import { LabelsConstant } from './../constants/labels.constant';
import { MsjFrontConstant } from '../constants/messages-frontend.constant';


/**
 * Clase utilitaria para la administracion del los mensajes a visualizar en pantalla
 */
export class MsjUtil {

  /**
   * Metodo que permite construir el mensaje de Exitoso
   */
  public static getMsjSuccess(detail: string): Message {
    return this.getMsj(MsjFrontConstant.EXITOSO, detail, LabelsConstant.SUCCESS);
  }

  /**
   * Metodo que permite construir el mensaje de Informacion
   */
  public static getMsjInfo(detail: string): Message {
    return this.getMsj(MsjFrontConstant.INFORMACION, detail, LabelsConstant.INFO);
  }

  /**
   * Metodo que permite construir el mensaje de Advertencia
   */
  public static getMsjWarn(detail: string): Message {
    return this.getMsj(MsjFrontConstant.ADVERTENCIA, detail, LabelsConstant.WARN);
  }

  /**
   * Metodo que permite construir el mensaje de Error
   */
  public static getMsjError(detail: string): Message {
    return this.getMsj(MsjFrontConstant.ERROR, detail, LabelsConstant.ERROR);
  }

  /**
   * Metodo que permite construir el mensaje de Exitoso para toast
   */
  public static getToastSuccess(detail: string): Message {
    return this.getToast(MsjFrontConstant.EXITOSO, detail, LabelsConstant.SUCCESS);
  }

  /**
   * Metodo que permite construir el mensaje de INFO para toast
   */
  public static getToastInfo(detail: string): Message {
    return this.getToast(MsjFrontConstant.INFORMACION, detail, LabelsConstant.INFO);
  }

  /**
   * Metodo que permite construir el mensaje de Advertencia para toast
   */
  public static getToastWarn(detail: string): Message {
    return this.getToast(MsjFrontConstant.ADVERTENCIA, detail, LabelsConstant.WARN);
  }

  /**
   * Metodo que permite construir el mensaje de ERROR para toast
   */
  public static getToastError(detail: string): Message {
    return this.getToast(MsjFrontConstant.ERROR, detail, LabelsConstant.ERROR);
  }

  /**
   * Metodo que permite construir el mensaje de Error para toast Mediano
   */
  public static getToastErrorMedium(detail: string): Message {
    return this.getToastMedium(MsjFrontConstant.ERROR, detail, LabelsConstant.ERROR);
  }

  /**
   * Metodo que permite construir el mensaje de ERROR para toast largo
   */
  public static getToastErrorLng(detail: string): Message {
    return this.getToastLng(MsjFrontConstant.ERROR, detail, LabelsConstant.ERROR);
  }

  /**
   * Metodo que permite construir el mensaje de Exitoso para toast largo
   */
  public static getToastSuccessLng(detail: string): Message {
    return this.getToastLng(MsjFrontConstant.EXITOSO, detail, LabelsConstant.SUCCESS);
  }

  /**
   * Metodo que permite construir el mensaje de Exitoso para toast largo
   */
  public static getToastSuccessExtraLng(detail: string): Message {
    return this.getToastExtraLong(MsjFrontConstant.EXITOSO, detail, LabelsConstant.SUCCESS);
  }

  /**
   * Metodo que permite construir el mensaje de Exitoso para toast Mediano
   */
  public static getToastSuccessMedium(detail: string): Message {
    return this.getToastMedium(MsjFrontConstant.EXITOSO, detail, LabelsConstant.SUCCESS);
  }

  /**
   * Metodo que permite construir el mensaje informativo
   */
  public static getInfo(pdetail: string): Message {
    return {
      key: LabelsConstant.KEY_MESSAGE_INFO,
      severity: LabelsConstant.INFO,
      summary: MsjFrontConstant.INFORMACION,
      detail: pdetail
    };
  }

  /**
   * Metodo que permite construir el mensaje
   */
  private static getMsj(psummary: string, pdetail: string, pseverity: string): Message {
    return {
      key: LabelsConstant.KEY_MESSAGE,
      severity: pseverity,
      summary: psummary,
      detail: pdetail
    };
  }

  /**
   * Metodo que permite construir el mensaje tipo toast
   */
  private static getToast(psummary: string, pdetail: string, pseverity: string): Message {
    return {
      key: LabelsConstant.KEY_TOAST,
      sticky: false,
      severity: pseverity,
      summary: psummary,
      detail: pdetail
    };
  }

  /**
   * Metodo que permite construir el mensaje tipo toast largo
   */
  private static getToastLng(psummary: string, pdetail: string, pseverity: string): Message {
    return {
      key: LabelsConstant.KEY_TOAST_LONGER,
      sticky: false,
      severity: pseverity,
      summary: psummary,
      detail: pdetail
    };
  }

  /**
   * Metodo que permite construir el mensaje tipo toast medium
   */
  private static getToastMedium(psummary: string, pdetail: string, pseverity: string): Message {
    return {
      key: LabelsConstant.KEY_TOAST_MEDIUM,
      sticky: false,
      severity: pseverity,
      summary: psummary,
      detail: pdetail
    };
  }

  /**
   * Metodo que permite construir el mensaje tipo toast largo
   */
  private static getToastExtraLong(psummary: string, pdetail: string, pseverity: string): Message {
    return {
      key: LabelsConstant.KEY_TOAST_EXLONGER,
      sticky: false,
      severity: pseverity,
      summary: psummary,
      detail: pdetail
    };
  }
}
