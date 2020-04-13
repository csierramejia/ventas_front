import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoteriasDTO } from 'src/app/dtos/escrutinio/loterias/loterias.dto';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { ProductosAPIConstant } from 'src/app/constants/apis/productos/productos-api.constant';


/**
 * Service que contiene los procesos de negocio para la Loterias en el sistema
 */
@Injectable()
export class ProductosService {

  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) { }


  // public consultarLoterias(filtros: LoteriaProductosDTO): Observable<LoteriasDTO[]> {
  public consultarLoterias(): Observable<LoteriasDTO[]> {
    // const loteriasRequestDTO = Object.assign({}, filtros);
    //  return this.http.get<LoteriasDTO[]>('http://localhost:8086/clientes/clienteApuesta/{}');
    //  const loteriasRequestDTO = Object.assign({}, filtros);
    const v = encodeURI(JSON.stringify({numeroIdentificacion: '1094918212'}));
    return this.http.get<LoteriasDTO[]>('http://localhost:8086/clientes/clienteApuesta/'+ v);
    // return this.http.get<LoteriasDTO[]>(`${ProductosAPIConstant.URL_CONSULTAR_LOTERIAS}/${JSON.stringify(loteriasRequestDTO)}`
    // );
     // return this.http.get<LoteriasDTO[]>(`${ProductosAPIConstant.URL_CONSULTAR_LOTERIAS}/${JSON.stringify(loteriasRequestDTO)}`
    // );
  }


  /**
   * @author Luis Hernandez
   * @param cliente
   * @description funcion que hace la peticion de validación de existencia de un cliente
   */
  public clienteApuesta(cliente: ClientesDTO): Observable<ClientesDTO> {
    return this.http.get<ClientesDTO>(`${ProductosAPIConstant.URL_CONSULTAR_CLIENTE}/${cliente.numeroDocumento}`);
  }

}
