/**
 * Clase utilitaria para validar las expresiones regulares del sistema
 */
export class RegexUtil {

  /** Se utiliza para validar que la expresion sea solo numeros */
  public static readonly SOLO_NUMEROS: RegExp = /^[0-9]*$/;

  /** Alfanumerico sin caracteres especiales no incluye ! */
  public static readonly ALFANUMERICO: RegExp = /^[^!]+$/;

  /** Mensaje cuando el valor no es numerico */
  private static readonly SOLO_NUMEROS_MSJ = '? debe ser numérico';

  /**
   * Metodo que permite validar si una cadena es solo numero
   *
   * @param cadena , es el valor a evaluar
   */
  public static isValorNumerico(cadena: string): boolean {
    return this.SOLO_NUMEROS.test(cadena);
  }

  /**
   * Metodo que permite configurar el mensaje el campo
   * debe ser numerico para ser visualizado en pantalla
   *
   * @param nombreCampo , nombre del campo que debe ser numerico
   */
  public static getMsjSoloNumeros(nombreCampo: string): string {
    return this.SOLO_NUMEROS_MSJ.replace('?', nombreCampo);
  }
}
