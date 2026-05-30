import { AVAILABLE_YEARS, MONTHS } from '../data/siiTables';
import type { PeriodConfig } from '../types';

interface Props {
  period: PeriodConfig;
  onChange: (p: PeriodConfig) => void;
}

export default function PeriodSelector({ period, onChange }: Props) {
  return (
    <section className="card period-selector" aria-label="Configuración del período contable">
      <h2 className="section-title">Período Contable</h2>
      <div className="period-fields">
        <div className="field">
          <label htmlFor="año-cierre">Año fiscal</label>
          <select
            id="año-cierre"
            value={period.añoCierre}
            onChange={e => onChange({ ...period, añoCierre: Number(e.target.value) })}
          >
            {AVAILABLE_YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mes-cierre">Mes de cierre del período</label>
          <select
            id="mes-cierre"
            value={period.mesCierre}
            onChange={e => onChange({ ...period, mesCierre: Number(e.target.value) })}
          >
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div className="period-info">
          <p className="period-desc">
            La tabla SII aplicada corresponde al año <strong>{period.añoCierre}</strong>.
            El mes de cierre determina la columna de referencia.
          </p>
        </div>
      </div>
    </section>
  );
}
