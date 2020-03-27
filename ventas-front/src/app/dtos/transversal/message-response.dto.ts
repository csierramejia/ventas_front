/**
 * Se utiliza para recibir un solo mensaje del servidor
 */
export class MessageResponseDTO {

  /**
   * Cuando el error es un Internal server error,
   * El mensaje es la  descripcion de la exception.
   *
   * Cuando el error es provocado por un business exeption,
   * El mensaje contiene el codigo que representa el mensaje de business error
   *
   */
  public mensaje: string;
}
