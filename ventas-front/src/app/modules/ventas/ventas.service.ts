import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { VentasAPIConstant } from 'src/app/constants/apis/ventas/ventas-api.constant';
import { PaginadorResponseDTO } from 'src/app/dtos/transversal/paginador-response.dto';

/**
 * Service que contiene los procesos de negocio para la Loterias en el sistema
 */
@Injectable()
export class VentasService {
 
  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) { }


}
