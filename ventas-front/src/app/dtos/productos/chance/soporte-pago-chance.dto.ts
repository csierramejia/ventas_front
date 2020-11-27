/**
 * Contiene la informacion para generar el PDF soporte de pago chance
 */
export class SoportePagoChanceDTO {

  /** Numero del del chance jugado */
  public numero: string;

  /** Modo de juego directo */
  public directo: string;

  /** Modo de juego combinado */
  public combinado: string;

  /** Modo de juego tres cifras */
  public tresCifras: string;

  /** Modo de juego dos cifras */
  public dosCifras: string;

  /** Modo de juego una cifra */
  public unaCifra: string;

  /** Loteria del chance jugado */
  public loteria: string;

  /** Fecha del sorteo de la loteria relacionado al chance */
  public fechaSorteo: string;
}
