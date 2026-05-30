import type { ItemWithCalc, PeriodConfig } from '../types';
import { MONTHS } from '../data/siiTables';

interface Props {
  items: ItemWithCalc[];
  period: PeriodConfig;
  totalOriginal: number;
  totalReajustado: number;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

function clp(value: number) {
  return value.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  });
}

const FORMULA_LABELS: Record<number, string> = {
  1: 'Tabla SII',
  2: 'Reposición',
  3: 'IPC anual',
};

export default function InventoryTable({
  items,
  period,
  totalOriginal,
  totalReajustado,
  onRemove,
  onEdit,
}: Props) {
  const totalDiff = totalReajustado - totalOriginal;

  return (
    <section className="card inventory-section" aria-label="Inventario revalorizado">
      <h2 className="section-title">
        Inventario Revalorizado
        <span className="period-label">
          {MONTHS[period.mesCierre - 1]} {period.añoCierre}
        </span>
      </h2>
      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th scope="col">Ítem</th>
              <th scope="col">Cantidad</th>
              <th scope="col">V. Original unit.</th>
              <th scope="col">V. Original total</th>
              <th scope="col">Fórmula</th>
              <th scope="col">%</th>
              <th scope="col">V. Reajustado total</th>
              <th scope="col">Diferencia</th>
              <th scope="col">Detalle</th>
              <th scope="col" className="actions-col"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ item, resultado, error }) => {
              if (error || !resultado) {
                return (
                  <tr key={item.id} className="item-row item-error">
                    <td>
                      <strong>{item.nombre}</strong>
                      <span className="item-meta">{MONTHS[item.mesCompra - 1]} {item.añoCompra}</span>
                    </td>
                    <td className="num">{item.cantidad} {item.unidad}</td>
                    <td className="num">{clp(item.valorUnitario)}</td>
                    <td className="num">{clp(item.valorUnitario * item.cantidad)}</td>
                    <td colSpan={5}>
                      <span className="error-inline" title={error ?? ''}>
                        ⚠ No calculable para el período actual
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => onEdit(item.id)}
                        aria-label={`Editar ${item.nombre}`}
                        title="Editar ítem"
                      >
                        ✎
                      </button>
                      <button
                        className="btn-icon btn-remove"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Eliminar ${item.nombre}`}
                        title="Eliminar ítem"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={item.id} className={`item-row formula-row-${resultado.formula}`}>
                  <td>
                    <strong>{item.nombre}</strong>
                    <span className="item-meta">{MONTHS[item.mesCompra - 1]} {item.añoCompra}</span>
                  </td>
                  <td className="num">{item.cantidad} {item.unidad}</td>
                  <td className="num">{clp(item.valorUnitario)}</td>
                  <td className="num">{clp(resultado.valorOriginalTotal)}</td>
                  <td>
                    <span className={`badge badge-f${resultado.formula}`}>
                      F{resultado.formula} — {FORMULA_LABELS[resultado.formula]}
                    </span>
                  </td>
                  <td className="num">
                    {resultado.porcentaje !== null ? `${resultado.porcentaje}%` : '—'}
                  </td>
                  <td className="num reajustado">{clp(resultado.valorReajustadoTotal)}</td>
                  <td className={`num ${resultado.diferencia >= 0 ? 'diff-pos' : 'diff-neg'}`}>
                    {resultado.diferencia >= 0 ? '+' : ''}{clp(resultado.diferencia)}
                  </td>
                  <td className="explicacion-cell">
                    <details>
                      <summary>Ver cálculo</summary>
                      <p className="explicacion-text">{resultado.explicacion}</p>
                    </details>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => onEdit(item.id)}
                      aria-label={`Editar ${item.nombre}`}
                      title="Editar ítem"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-remove"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Eliminar ${item.nombre}`}
                      title="Eliminar ítem"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td colSpan={3}><strong>Total general</strong></td>
              <td className="num"><strong>{clp(totalOriginal)}</strong></td>
              <td colSpan={2}></td>
              <td className="num total-reajustado"><strong>{clp(totalReajustado)}</strong></td>
              <td className={`num ${totalDiff >= 0 ? 'diff-pos' : 'diff-neg'}`}>
                <strong>{totalDiff >= 0 ? '+' : ''}{clp(totalDiff)}</strong>
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
