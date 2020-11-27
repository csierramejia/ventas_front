import { NotificacionSoportePagoDTO } from '../../correos/notificacion-soporte-pago.dto';


export class ResponseDTO {
    public idTransaccion: number;
    public exito: boolean;
    public fecha: Date;
    public hora: string;
    public codigo: string;
    public mensaje: string;
    public notificacionSoportePago: NotificacionSoportePagoDTO;
}
