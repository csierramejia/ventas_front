
import { VehiculoDTO } from 'src/app/dtos/soat/vehiculo.dto';

/**
 * DTO que contiene los atributos del tomador
 */
export class TomadorDTO {

    public idUsuario: number;
    public nombres: string;
    public apellidos: string;
    public tipoDocumento: string;
    public numeroDocumento: string;
    public fechaNacimiento: Date;
    public ciudad: string;
    public direccion: string;
    public correo: string;
    public numeroCelular: string;
    public fechaInicioVigencia: Date;
    public vehiculo: VehiculoDTO;
}
