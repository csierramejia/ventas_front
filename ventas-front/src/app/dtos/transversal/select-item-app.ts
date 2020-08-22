import { SelectItem } from 'primeng/api';

/**
 * Se utiliza para expander mas los atributos que tiene selectitem de primeng
 */
export interface SelectItemApp extends SelectItem {

    /** Se utiliza para obtener otro value */
    otherValue: any;
}
