export type Unidad = 'kg' | 'g' | 'm' | 'unidad';

export interface InventoryItem {
  id: string;
  nombre: string;
  unidad: Unidad;
  cantidad: number;
  valorUnitario: number;
  mesCompra: number;
  añoCompra: number;
  precioReposicion?: number;
}

export interface CalculatedResult {
  formula: 1 | 2 | 3;
  porcentaje: number | null;
  valorReajustadoUnitario: number;
  valorOriginalTotal: number;
  valorReajustadoTotal: number;
  diferencia: number;
  explicacion: string;
}

export interface ItemWithCalc {
  item: InventoryItem;
  resultado: CalculatedResult | null;
  error: string | null;
}

export interface PeriodConfig {
  añoCierre: number;
  mesCierre: number;
}
