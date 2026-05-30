import { SII_TABLES, MONTHS, MONTHS_SHORT } from '../data/siiTables';

interface HighlightCell {
  rowKey: string;
  col: number;
}

interface Props {
  año: number;
  mesCierre: number;
  highlightedCells: HighlightCell[];
}

const ROW_KEYS = [
  'capital_inicial',
  '1', '2', '3', '4', '5', '6',
  '7', '8', '9', '10', '11', '12',
];

export default function SiiTable({ año, mesCierre, highlightedCells }: Props) {
  const table = SII_TABLES[año];
  if (!table) {
    return (
      <section className="card sii-table-section">
        <h2 className="section-title">Tabla SII {año}</h2>
        <p className="table-note">Tabla no disponible para el año seleccionado.</p>
      </section>
    );
  }

  // Calcular valor máximo para el heatmap
  let maxVal = 0;
  for (const row of Object.values(table.rows)) {
    for (const v of Object.values(row.data)) {
      if (v > maxVal) maxVal = v;
    }
  }

  function isHighlighted(rowKey: string, col: number) {
    return highlightedCells.some(c => c.rowKey === rowKey && c.col === col);
  }

  function getCellStyle(val: number, highlighted: boolean): React.CSSProperties | undefined {
    if (highlighted || val <= 0) return undefined;
    const intensity = maxVal > 0 ? val / maxVal : 0;
    const alpha = Math.round(intensity * 0.3 * 255).toString(16).padStart(2, '0');
    return { backgroundColor: `#B87333${alpha}` };
  }

  function formatVal(val: number) {
    return val < 0 ? `${val}%→0` : `${val}%`;
  }

  return (
    <section className="card sii-table-section" aria-label={`Tabla SII de corrección monetaria ${año}`}>
      <h2 className="section-title">
        <span>Tabla SII {año}</span>
        <a
          href={table.source}
          target="_blank"
          rel="noopener noreferrer"
          className="table-source-link"
          aria-label={`Fuente oficial SII ${año}`}
        >
          ↗ Fuente oficial
        </a>
      </h2>
      <div className="sii-table-wrapper">
        <table className="sii-table" role="grid" aria-label="Porcentajes de corrección monetaria SII">
          <thead>
            <tr>
              <th scope="col">Mes compra \ Cierre</th>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(col => (
                <th
                  key={col}
                  scope="col"
                  className={col === mesCierre ? 'col-closing' : ''}
                  aria-label={col === mesCierre ? `${MONTHS[col - 1]} (mes de cierre)` : MONTHS[col - 1]}
                >
                  {MONTHS_SHORT[col - 1]}
                  {col === mesCierre && <span className="col-closing-marker" aria-hidden="true">▼</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_KEYS.map(rowKey => {
              const row = table.rows[rowKey];
              if (!row) return null;
              return (
                <tr key={rowKey}>
                  <td className="row-label" scope="row">
                    {rowKey === 'capital_inicial'
                      ? 'Capital Inicial'
                      : MONTHS[Number(rowKey) - 1]}
                  </td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(col => {
                    const val = row.data[col];
                    const highlighted = isHighlighted(rowKey, col);
                    const isClosing = col === mesCierre;

                    if (val === undefined) {
                      return (
                        <td
                          key={col}
                          className={`sii-cell sii-cell-empty${isClosing ? ' col-closing' : ''}`}
                          aria-label="No aplica"
                        >
                          —
                        </td>
                      );
                    }

                    return (
                      <td
                        key={col}
                        className={[
                          'sii-cell',
                          highlighted ? 'sii-cell-highlighted' : '',
                          isClosing ? 'col-closing' : '',
                          val < 0 ? 'sii-cell-negative' : '',
                        ].filter(Boolean).join(' ')}
                        style={getCellStyle(val, highlighted)}
                        aria-label={`${row.label} → ${MONTHS[col - 1]}: ${val}%${val < 0 ? ' (se aplica 0%)' : ''}`}
                      >
                        {formatVal(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="table-note">
        {highlightedCells.length > 0
          ? <>Celdas resaltadas = ítems del inventario. Columna <strong>{MONTHS[mesCierre - 1]}</strong> = mes de cierre.</>
          : <>Columna <strong>{MONTHS[mesCierre - 1]}</strong> = mes de cierre seleccionado. Las celdas resaltarán al agregar ítems.</>
        }
      </p>
    </section>
  );
}
