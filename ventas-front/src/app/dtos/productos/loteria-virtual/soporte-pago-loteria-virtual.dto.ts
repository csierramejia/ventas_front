/**
 * Clase que contiene la informacion para generar el PDF soporte de pago
 */
export class SoportePagoLoteriaVirtualDTO {

  /** Nombre de la loteria */
  public loteria: string;

  /** Es el numero del sorteo */
  public sorteo: string;

  /** Es el numero del juego */
  public numeroJuego: string;

  /** Numero de la serie de la loteria */
  public serie: string;

  /** Cantida de fraciones jugadas */
  public fracciones: string;

  /** Colillas para la loteria */
  public colilla: string;

  /** Valor de cada fraccion */
  public valorFraccion: string;
}
