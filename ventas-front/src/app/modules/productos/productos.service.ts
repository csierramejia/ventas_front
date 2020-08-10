import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoteriasDTO } from 'src/app/dtos/escrutinio/loterias/loterias.dto';
import { ClientesDTO } from 'src/app/dtos/productos/chance/clientes.dto';
import { PersonaDTO } from 'src/app/dtos/productos/chance/persona.dto';
import { ImpuestosDTO } from 'src/app/dtos/productos/chance/impuestos.dto';
import { ProductosAPIConstant } from 'src/app/constants/apis/productos/productos-api.constant';
import { ResponseDTO } from 'src/app/dtos/productos/chance/response.dto';
import { ModalidadesDTO } from 'src/app/dtos/escrutinio/loterias/modalidades.dto';
/**
 * Service que contiene los procesos de negocio para la Loterias en el sistema
 */
@Injectable()
export class ProductosService {


  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) { }

  /**
   * @author Luis Hernandez
   * @param fechaSorteoFilter
   * @description Metodo que devuelve las loterias habilitadas para el sorteo de la fecha seleccionada
   */
  public consultarLoterias(fechaSorteoFilter, idProducto): Observable<LoteriasDTO[]> {
    const v = encodeURI(JSON.stringify({fechaSorteo: fechaSorteoFilter,producto:idProducto }));
    return this.http.get<LoteriasDTO[]>(`${ProductosAPIConstant.URL_CONSULTAR_LOTERIAS}/${v}`);
  }

  public consultarSignos() :Observable<any[]> {
    return this.http.get<any[]>(`${ProductosAPIConstant.URL_CONSULTAR_SIGNOS}`);
  }

  public consultarPaquetes() :Observable<any[]> {
    return this.http.get<any[]>(`${ProductosAPIConstant.URL_CONSULTAR_PAQUETES}`);
  }

  public consultarOperadores() :Observable<any[]> {
    return this.http.get<any[]>(`${ProductosAPIConstant.URL_CONSULTAR_OPERADORES}`);
  }

  public consultarNumeroSerieApuesta(nombreProducto:string) :Observable<any> {
    return this.http.get<any>(`${ProductosAPIConstant.URL_CONSULTAR_SERIE_APUESTAS}/${nombreProducto}`);
  }


  public consultarSemanaServidor() :Observable<any[]> {
    return this.http.get<any[]>(`${ProductosAPIConstant.URL_CONSULTAR_SEMANA}`);
  }

  public consultarValoresModalidad(nombreProducto:string, idModalidad:number): Observable<number[]> {
    return this.http.get<number[]>(`${ProductosAPIConstant.URL_CONSULTAR_MODALIDADES_VALORES}/${nombreProducto}/${idModalidad}`);
  }


  /**
   * @author Luis Hernandez
   * @param cliente
   * @description funcion que hace la peticion de validación de existencia de un cliente
   */
  public clienteApuesta(cliente: ClientesDTO): Observable<ClientesDTO> {
    return this.http.get<ClientesDTO>(`${ProductosAPIConstant.URL_CONSULTAR_CLIENTE}/${cliente.numeroDocumento}/${cliente.tipoDocumento}`);
  }


  /**
   * @author Luis Hernandez
   * @param iva
   * @description Metodo que trae del back la información del iva a aplicar
   */
  public consultarIva(iva): Observable<ImpuestosDTO> {
    return this.http.get<ImpuestosDTO>(`${ProductosAPIConstant.URL_IMPUESTO_IVA}/${iva}`);
  }


  /**
   * @author Luis Hernandez
   * @param iva
   * @description Metodo que envia la transacción de pago de apuesta
   */
  public registrarRecarga(bet): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(
      ProductosAPIConstant.URL_REGISTRAR_RECARGA,
      bet
    );
  }

  public registrarApuesta(bet): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(
      ProductosAPIConstant.URL_REGISTRAR_APUESTA,
      bet
    );
  }


  /**
   * @author Luis Hernandez
   * @param cliente
   * @description Metodo que se encarga de enviar
   * los datos para la creacion de un cliente
   */
  public registrarCliente(cliente): Observable<PersonaDTO> {
    return this.http.post<PersonaDTO>(
      ProductosAPIConstant.URL_REGISTRAR_CLIENTE,
      cliente
    );
  }

  public consultarRutaImagenes(): Observable<any> {
    return this.http.get<any>(`${ProductosAPIConstant.URL_CONSULTAR_RUTA_IMAGENES}`);
  }


}
