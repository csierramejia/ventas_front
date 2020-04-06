/**
 * Estado del titulo y subtitulo de las paginas visualizadas
 */
export class TitleST {

  /** Es el titulo a mostrar en la pagina */
  public titulo: string;

  /** Es el sub-titulo a mostrar en la pagina */
  public subTitulo: string;

  /** Es el class para el titulo */
  public tituloClass: string;

  /**
   * Metodo que permite limpiar los datos de los titulos
   */
  public clear(): void {
    this.titulo = null;
    this.subTitulo = null;
    this.tituloClass = null;
  }
}
