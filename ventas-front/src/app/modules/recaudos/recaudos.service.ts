import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SoatAPIConstant } from 'src/app/constants/apis/soat/soat-api.constants';
import { VehiculoDTO } from 'src/app/dtos/soat/vehiculo.dto';
import { TomadorDTO } from 'src/app/dtos/soat/tomador.dto';


/**
 * Service que contiene los procesos de negocio para la Loterias en el sistema
 */

@Injectable()
export class  RecaudosService{


    /**
     * @param HTTP para hacer las peticiones a los servicios REST
     */
    constructor(private http: HttpClient) { }

/**
   * @author Jhon Rivera
   * @param placa
   * @description Metodo que trae del back la información del vehiculo
   */
  public consultarVehiculoPorPlaca(placa: string): Observable<VehiculoDTO> {
    return this.http.get<VehiculoDTO>(`${SoatAPIConstant.URL_CONSULTAR_VEHICULO}/${placa}`);
  }


   /**
   * @author Jhon Rivera
   * @param iva
   * @description Metodo que envia la transacción de pago de apuesta
   */
  public registrarPagoTomador(tomador : TomadorDTO): Observable<any> {
    return this.http.post<any>(
      SoatAPIConstant.URL_ALMACENAR_TOMADOR,
      tomador
    );
  }

}
