import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AutenticacionRequestDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-request.dto';
import { AutenticacionResponseDTO } from 'src/app/dtos/seguridad/autenticacion/autenticacion-response.dto';
import { AutenticacionAPIConstant } from 'src/app/constants/apis/seguridad/autenticacion-api.constant';
import { BienvenidaResponseDTO } from 'src/app/dtos/seguridad/bienvenida/bienvenida-response.dto';
import { BienvenidaRequestDTO } from 'src/app/dtos/seguridad/bienvenida/bienvenida-request.dto';

/**
 * Clase que contiene los procesos de negocio para la autenticacion en el sistema
 */
@Injectable()
export class SeguridadService {

  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) {}

  /**
   * Servicio que permite soportar el proceso de iniciar sesion
   *
   * @param credenciales, contiene las credenciales del USER
   * @return DTO con los datos inciales
   */
  public iniciarSesion(credenciales: AutenticacionRequestDTO): Observable<AutenticacionResponseDTO> {
    return this.http.post<AutenticacionResponseDTO>(
      AutenticacionAPIConstant.URL_LOGIN,
      credenciales
    );
  }

  /**
   * Servicio para obtener los datos necesarios de bienvenida de la app
   * cuando la autenticacion es OK
   *
   * @param data, parametros necesarios para obtener los datos de bienvenida
   * @return DTO con los datos configurados para la bienvenida de la app
   */
  public getDatosBienvenida(data: BienvenidaRequestDTO): Observable<BienvenidaResponseDTO> {
    return this.http.post<BienvenidaResponseDTO>(
      AutenticacionAPIConstant.URL_BIENVENIDA,
      data
    );
  }
}
