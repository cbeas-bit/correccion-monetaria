import { useState } from 'react';
import type { InventoryItem, PeriodConfig, Unidad } from '../types';
import { MONTHS, SII_TABLES } from '../data/siiTables';
import { calcularCorreccion } from '../lib/calculator';

interface Props {
  period: PeriodConfig;
  onAdd: (item: InventoryItem) => void;
}

const UNIDADES: { value: Unidad; label: string }[] = [
  { value: 'kg', label: 'kg — Kilogramo' },
  { value: 'g', label: 'g — Gramo' },
  { value: 'm', label: 'm — Metro' },
  { value: 'unidad', label: 'Unidad' },
];

function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getPorcentajePreview(
  mesCompra: number,
  añoCompra: number,
  mesCierre: number,
  añoCierre: number,
): { label: string; tipo: 'positivo' | 'cero' | 'formula2' | 'nodisponible' } | null {
  const table = SII_TABLES[añoCierre];
  if (!table) return null;

  if (añoCompra < añoCierre) {
    const rawPct = table.rows['capital_inicial']?.data[mesCierre];
    if (rawPct === undefined)
      return { label: 'Datos de Capital Inicial aún no publicados', tipo: 'nodisponible' };
    const pct = Math.max(0, rawPct);
    const neg = rawPct < 0 ? ` (original: ${rawPct}% → 0%)` : '';
    return {
      label: `Fórmula 3 — IPC anual (Capital Inicial): ${pct}%${neg}`,
      tipo: pct > 0 ? 'positivo' : 'cero',
    };
  }

  if (mesCompra >= 1 && mesCompra <= 6) {
    if (mesCompra >= mesCierre) return null;
    const rawPct = table.rows[String(mesCompra)]?.data[mesCierre];
    if (rawPct === undefined)
      return { label: 'Porcentaje SII aún no publicado para este período', tipo: 'nodisponible' };
    const pct = Math.max(0, rawPct);
    const neg = rawPct < 0 ? ` → 0% (mínimo)` : '';
    return {
      label: `Fórmula 1 — Tabla SII: ${rawPct}%${neg}`,
      tipo: pct > 0 ? 'positivo' : 'cero',
    };
  }

  return { label: 'Fórmula 2 — Se usará el precio de reposición más alto del año', tipo: 'formula2' };
}

export default function ItemForm({ period, onAdd }: Props) {
  const [nombre, setNombre] = useState('');
  const [unidad, setUnidad] = useState<Unidad>('kg');
  const [cantidad, setCantidad] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [mesCompra, setMesCompra] = useState('1');
  const [añoCompra, setAñoCompra] = useState(String(period.añoCierre));
  const [precioReposicion, setPrecioReposicion] = useState('');
  const [error, setError] = useState('');

  const mesNum = Number(mesCompra);
  const añoNum = Number(añoCompra);
  const esSegundoSemestre = mesNum >= 7 && mesNum <= 12 && añoNum === period.añoCierre;

  const purchaseYears = Array.from(
    { length: period.añoCierre - 2020 + 1 },
    (_, i) => period.añoCierre - i,
  );

  const preview = getPorcentajePreview(mesNum, añoNum, period.mesCierre, period.añoCierre);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) return setError('Ingresa el nombre del ítem.');
    const cant = Number(cantidad);
    const val = Number(valorUnitario);
    if (!cantidad || cant <= 0) return setError('La cantidad debe ser mayor a 0.');
    if (!valorUnitario || val <= 0) return setError('El valor de compra debe ser mayor a 0.');
    if (esSegundoSemestre && (!precioReposicion || Number(precioReposicion) <= 0)) {
      return setError('Para ítems del segundo semestre, ingresa el precio de reposición.');
    }

    const item: InventoryItem = {
      id: generarId(),
      nombre: nombre.trim(),
      unidad,
      cantidad: cant,
      valorUnitario: val,
      mesCompra: mesNum,
      añoCompra: añoNum,
      ...(esSegundoSemestre ? { precioReposicion: Number(precioReposicion) } : {}),
    };

    try {
      calcularCorreccion(item, period.mesCierre, period.añoCierre);
      onAdd(item);
      setNombre('');
      setCantidad('');
      setValorUnitario('');
      setPrecioReposicion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular la corrección.');
    }
  }

  // Al cambiar año de compra, resetear mes si es necesario
  function handleAñoCompraChange(val: string) {
    setAñoCompra(val);
    if (Number(val) < period.añoCierre && (mesNum >= 7)) {
      setMesCompra('1');
    }
  }

  return (
    <section className="card item-form" aria-label="Agregar insumo al inventario">
      <h2 className="section-title">Agregar Insumo</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="nombre">Nombre del ítem</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej: Cobre en barra 2mm"
            autoComplete="off"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              type="number"
              min="0.001"
              step="any"
              value={cantidad}
              onChange={e => setCantidad(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="field">
            <label htmlFor="unidad">Unidad</label>
            <select id="unidad" value={unidad} onChange={e => setUnidad(e.target.value as Unidad)}>
              {UNIDADES.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="valor">Valor unitario de compra (CLP $)</label>
          <input
            id="valor"
            type="number"
            min="1"
            step="1"
            value={valorUnitario}
            onChange={e => setValorUnitario(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="mes-compra">Mes de compra</label>
            <select id="mes-compra" value={mesCompra} onChange={e => setMesCompra(e.target.value)}>
              {MONTHS.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="año-compra">Año de compra</label>
            <select
              id="año-compra"
              value={añoCompra}
              onChange={e => handleAñoCompraChange(e.target.value)}
            >
              {purchaseYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {esSegundoSemestre && (
          <div className="field field-reposicion">
            <label htmlFor="reposicion">
              Precio de reposición más alto del año (CLP $)
              <span className="field-hint">Fórmula 2 — Segundo semestre</span>
            </label>
            <input
              id="reposicion"
              type="number"
              min="1"
              step="1"
              value={precioReposicion}
              onChange={e => setPrecioReposicion(e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        {preview && (
          <div className={`pct-preview pct-${preview.tipo}`} role="status">
            {preview.label}
          </div>
        )}

        {error && (
          <p className="error-msg" role="alert">{error}</p>
        )}

        <button type="submit" className="btn btn-primary btn-full">
          + Agregar ítem
        </button>
      </form>

      <div className="formulas-legend">
        <h3>Fórmulas aplicadas</h3>
        <ul>
          <li><span className="badge badge-f1">F1</span> 1.º semestre del año de cierre → tabla SII</li>
          <li><span className="badge badge-f2">F2</span> 2.º semestre del año de cierre → precio reposición</li>
          <li><span className="badge badge-f3">F3</span> Año anterior al cierre → IPC anual</li>
        </ul>
        <p className="legend-note">Regla: si el porcentaje es negativo, se aplica 0%.</p>
      </div>
    </section>
  );
}
