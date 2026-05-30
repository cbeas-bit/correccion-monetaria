import { SII_TABLES, MONTHS } from '../data/siiTables';
import type { InventoryItem, CalculatedResult } from '../types';

export function calcularCorreccion(
  item: InventoryItem,
  mesCierre: number,
  añoCierre: number,
): CalculatedResult {
  const table = SII_TABLES[añoCierre];
  if (!table) throw new Error(`Tabla SII ${añoCierre} no disponible.`);

  const esPeriodoAnterior = item.añoCompra < añoCierre;
  const esPrimerSemestre = item.mesCompra >= 1 && item.mesCompra <= 6;

  let formula: 1 | 2 | 3;
  let porcentaje: number | null;
  let valorReajustadoUnitario: number;
  let explicacion: string;

  if (esPeriodoAnterior) {
    formula = 3;
    const rawPct = table.rows['capital_inicial']?.data[mesCierre];
    if (rawPct === undefined) {
      throw new Error(
        `Datos de Capital Inicial para ${MONTHS[mesCierre - 1]} ${añoCierre} aún no publicados por el SII.`,
      );
    }
    porcentaje = Math.max(0, rawPct);
    valorReajustadoUnitario = item.valorUnitario * (1 + porcentaje / 100);
    const negNote = rawPct < 0 ? ` (original: ${rawPct}% → se aplica 0%)` : '';
    explicacion = `Ítem del período anterior (${item.añoCompra}) → IPC anual (Capital Inicial, columna ${MONTHS[mesCierre - 1]}): ${porcentaje}%${negNote}`;
  } else if (esPrimerSemestre) {
    formula = 1;
    if (item.mesCompra >= mesCierre) {
      throw new Error(
        `El mes de compra (${MONTHS[item.mesCompra - 1]}) debe ser anterior al mes de cierre (${MONTHS[mesCierre - 1]}).`,
      );
    }
    const rawPct = table.rows[String(item.mesCompra)]?.data[mesCierre];
    if (rawPct === undefined) {
      throw new Error(
        `Porcentaje SII no disponible: ${MONTHS[item.mesCompra - 1]} → ${MONTHS[mesCierre - 1]} ${añoCierre}. Es posible que el SII aún no haya publicado este dato.`,
      );
    }
    porcentaje = Math.max(0, rawPct);
    valorReajustadoUnitario = item.valorUnitario * (1 + porcentaje / 100);
    const negNote = rawPct < 0 ? ` → se aplica 0% (mínimo)` : '';
    explicacion = `Primer semestre → tabla SII fila ${MONTHS[item.mesCompra - 1]}, columna ${MONTHS[mesCierre - 1]}: ${rawPct}%${negNote}`;
  } else {
    formula = 2;
    if (!item.precioReposicion || item.precioReposicion <= 0) {
      throw new Error('Se requiere el precio de reposición para ítems del segundo semestre.');
    }
    porcentaje = null;
    valorReajustadoUnitario = item.precioReposicion;
    const diff = ((item.precioReposicion - item.valorUnitario) / item.valorUnitario) * 100;
    explicacion = `Segundo semestre → precio de reposición más alto del año: $${item.precioReposicion.toLocaleString('es-CL')} (variación implícita: ${diff.toFixed(2)}%)`;
  }

  const valorOriginalTotal = item.valorUnitario * item.cantidad;
  const valorReajustadoTotal = valorReajustadoUnitario * item.cantidad;
  const diferencia = valorReajustadoTotal - valorOriginalTotal;

  return {
    formula,
    porcentaje,
    valorReajustadoUnitario,
    valorOriginalTotal,
    valorReajustadoTotal,
    diferencia,
    explicacion,
  };
}
