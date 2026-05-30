// Fuente: https://www.sii.cl/valores_y_fechas/correccion_monetaria/
// Actualizar manualmente cuando el SII publique nuevas tablas.

export interface SiiTableRow {
  label: string;
  data: Record<number, number>;
}

export interface SiiTableData {
  source: string;
  rows: Record<string, SiiTableRow>;
}

export const SII_TABLES: Record<number, SiiTableData> = {
  2026: {
    source: 'https://www.sii.cl/valores_y_fechas/correccion_monetaria/correccion2026.htm',
    rows: {
      capital_inicial: { label: 'Capital Inicial', data: { 1: -0.2, 2: 0.2, 3: 0.2, 4: 1.2 } },
      '1': { label: 'Enero',    data: { 2: 0.4, 3: 0.4, 4: 1.4 } },
      '2': { label: 'Febrero',  data: { 3: 0.0, 4: 0.9 } },
      '3': { label: 'Marzo',    data: { 4: 1.0 } },
      '4': { label: 'Abril',    data: {} },
      '5': { label: 'Mayo',     data: {} },
      '6': { label: 'Junio',    data: {} },
      '7': { label: 'Julio',    data: {} },
      '8': { label: 'Agosto',   data: {} },
      '9': { label: 'Septiembre', data: {} },
      '10': { label: 'Octubre', data: {} },
      '11': { label: 'Noviembre', data: {} },
      '12': { label: 'Diciembre', data: {} },
    },
  },
  2025: {
    source: 'https://www.sii.cl/valores_y_fechas/correccion_monetaria/correccion2025.htm',
    rows: {
      capital_inicial: { label: 'Capital Inicial', data: { 1: -0.2, 2: 0.9, 3: 1.3, 4: 1.8, 5: 2.0, 6: 2.2, 7: 1.7, 8: 2.6, 9: 2.7, 10: 3.1, 11: 3.2, 12: 3.4 } },
      '1':  { label: 'Enero',      data: { 2: 1.1, 3: 1.5, 4: 2.0, 5: 2.2, 6: 2.4, 7: 2.0, 8: 2.8, 9: 2.9, 10: 3.3, 11: 3.4, 12: 3.6 } },
      '2':  { label: 'Febrero',    data: { 3: 0.4, 4: 0.9, 5: 1.1, 6: 1.3, 7: 0.9, 8: 1.8, 9: 1.8, 10: 2.2, 11: 2.3, 12: 2.6 } },
      '3':  { label: 'Marzo',      data: { 4: 0.5, 5: 0.7, 6: 0.9, 7: 0.5, 8: 1.4, 9: 1.4, 10: 1.8, 11: 1.9, 12: 2.2 } },
      '4':  { label: 'Abril',      data: { 5: 0.2, 6: 0.4, 7: 0.0, 8: 0.9, 9: 0.9, 10: 1.3, 11: 1.4, 12: 1.6 } },
      '5':  { label: 'Mayo',       data: { 6: 0.2, 7: -0.2, 8: 0.7, 9: 0.7, 10: 1.1, 11: 1.2, 12: 1.4 } },
      '6':  { label: 'Junio',      data: { 7: -0.4, 8: 0.5, 9: 0.5, 10: 0.9, 11: 1.0, 12: 1.2 } },
      '7':  { label: 'Julio',      data: { 8: 0.9, 9: 0.9, 10: 1.4, 11: 1.4, 12: 1.7 } },
      '8':  { label: 'Agosto',     data: { 9: 0.0, 10: 0.5, 11: 0.5, 12: 0.8 } },
      '9':  { label: 'Septiembre', data: { 10: 0.4, 11: 0.5, 12: 0.7 } },
      '10': { label: 'Octubre',    data: { 11: 0.0, 12: 0.3 } },
      '11': { label: 'Noviembre',  data: { 12: 0.3 } },
      '12': { label: 'Diciembre',  data: {} },
    },
  },
  2024: {
    source: 'https://www.sii.cl/valores_y_fechas/correccion_monetaria/correccion2024.htm',
    rows: {
      capital_inicial: { label: 'Capital Inicial', data: { 1: -0.5, 2: 0.1, 3: 0.7, 4: 1.1, 5: 1.6, 6: 1.9, 7: 1.8, 8: 2.6, 9: 2.8, 10: 2.9, 11: 3.9, 12: 4.2 } },
      '1':  { label: 'Enero',      data: { 2: 0.7, 3: 1.3, 4: 1.6, 5: 2.2, 6: 2.5, 7: 2.4, 8: 3.1, 9: 3.4, 10: 3.5, 11: 4.5, 12: 4.7 } },
      '2':  { label: 'Febrero',    data: { 3: 0.6, 4: 1.0, 5: 1.5, 6: 1.8, 7: 1.7, 8: 2.4, 9: 2.7, 10: 2.8, 11: 3.8, 12: 4.0 } },
      '3':  { label: 'Marzo',      data: { 4: 0.4, 5: 0.9, 6: 1.2, 7: 1.1, 8: 1.8, 9: 2.1, 10: 2.2, 11: 3.2, 12: 3.4 } },
      '4':  { label: 'Abril',      data: { 5: 0.5, 6: 0.8, 7: 0.7, 8: 1.5, 9: 1.7, 10: 1.8, 11: 2.8, 12: 3.0 } },
      '5':  { label: 'Mayo',       data: { 6: 0.3, 7: 0.2, 8: 0.9, 9: 1.2, 10: 1.3, 11: 2.2, 12: 2.5 } },
      '6':  { label: 'Junio',      data: { 7: -0.1, 8: 0.6, 9: 0.9, 10: 1.0, 11: 2.0, 12: 2.2 } },
      '7':  { label: 'Julio',      data: { 8: 0.7, 9: 1.0, 10: 1.1, 11: 2.1, 12: 2.3 } },
      '8':  { label: 'Agosto',     data: { 9: 0.2, 10: 0.3, 11: 1.3, 12: 1.6 } },
      '9':  { label: 'Septiembre', data: { 10: 0.1, 11: 1.1, 12: 1.3 } },
      '10': { label: 'Octubre',    data: { 11: 1.0, 12: 1.2 } },
      '11': { label: 'Noviembre',  data: { 12: 0.3 } },
      '12': { label: 'Diciembre',  data: {} },
    },
  },
};

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const AVAILABLE_YEARS = Object.keys(SII_TABLES)
  .map(Number)
  .sort()
  .reverse();

// Retorna el período más reciente con datos disponibles en la tabla capital_inicial
export function getLatestAvailablePeriod(): { año: number; mes: number } {
  for (const año of AVAILABLE_YEARS) {
    const capInicial = SII_TABLES[año]?.rows['capital_inicial'];
    if (capInicial) {
      const meses = Object.keys(capInicial.data).map(Number).sort().reverse();
      if (meses.length > 0) return { año, mes: meses[0] };
    }
  }
  return { año: 2025, mes: 12 };
}
