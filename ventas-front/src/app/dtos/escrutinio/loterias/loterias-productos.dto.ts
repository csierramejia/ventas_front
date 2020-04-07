import { ProductosResponsetDTO } from 'src/app/dtos/seguridad/productos/productos-response.dto';
import { EmpresaProductoLoteriaDTO } from './empresa-producto-loteria.dto';

export class LoteriaProductosDTO {
    
    public idLoteria: number;
    public codigo: string;
    public nombreCorto: string;
    public nombre: string;
    public telefono: string;
    public idEstado: string;
    public idEmpresa:number;
    public productos: Array<ProductosResponsetDTO>;
    public empresasProductosLoterias: Array<EmpresaProductoLoteriaDTO>;
}

