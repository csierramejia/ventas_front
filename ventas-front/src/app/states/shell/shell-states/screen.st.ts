/**
 * Estado para notificar el tamanio de la pantalla
 * del monitor o celular, se utiliza para el
 * responsive de la app
 */
export class ScreenST {

  /** Es el largo minimo que identifica una resolucion grande */
  public largeBreakpoint = 1024;

  /** Es el ancho de la pantalla, este valor es dinamico si el dispositivo cambia */
  public screenWidth = 1000;

  /**
   * Se hace la inscripcion con la ventana del navegador
   * para ser notificado si el dispositivo cambia su resolucion
   */
  constructor() {
    try {
      this.screenWidth = window.innerWidth;
      window.addEventListener('resize', event => this.onResize(event));
    } catch (e) {
      // we're going with default screen dimensions
    }
  }

  /**
   * Metodo que identifica si la resolucion de la pantalla es grande
   */
  public isBigScreen(): boolean {
    return this.screenWidth >= this.largeBreakpoint;
  }

  /**
   * Metodo que es invocado cuando el tamanio de la pantalla cambia
   */
  private onResize($event): void {
    this.screenWidth = window.innerWidth;
  }
}
