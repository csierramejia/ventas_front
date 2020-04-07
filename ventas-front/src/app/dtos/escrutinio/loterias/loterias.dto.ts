import { EmpresaProductoLoteriaDTO } from './empresa-producto-loteria.dto';

export class LoteriasDTO {

    public idLoteria: number;
    public codigo: string;
    public nombreCorto: string;
    public nombre: string;
    public telefono: string;
    public idEstado: string;
    public empresasProductosLoterias: Array<EmpresaProductoLoteriaDTO>;
}
