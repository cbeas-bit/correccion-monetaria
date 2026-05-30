import { useState, useEffect } from 'react';
import type { InventoryItem, PeriodConfig, Unidad } from '../types';
import { MONTHS, SII_TABLES } from '../data/siiTables';
import { calcularCorreccion } from '../lib/calculator';

interface Props {
  item: InventoryItem;
  period: PeriodConfig;
  onSave: (updated: InventoryItem) => void;
  onClose: () => void;
}

const UNIDADES: { value: Unidad; label: string }[] = [
  { value: 'kg', label: 'kg — Kilogramo' },
  { value: 'g', label: 'g — Gramo' },
  { value: 'm', label: 'm — Metro' },
  { value: 'unidad', label: 'Unidad' },
];

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

export default function EditItemModal({ item, period, onSave, onClose }: Props) {
  const [nombre, setNombre] = useState(item.nombre);
  const [unidad, setUnidad] = useState<Unidad>(item.unidad);
  const [cantidad, setCantidad] = useState(String(item.cantidad));
  const [valorUnitario, setValorUnitario] = useState(String(item.valorUnitario));
  const [mesCompra, setMesCompra] = useState(String(item.mesCompra));
  const [añoCompra, setAñoCompra] = useState(String(item.añoCompra));
  const [precioReposicion, setPrecioReposicion] = useState(
    item.precioReposicion ? String(item.precioReposicion) : '',
  );
  const [error, setError] = useState('');

  const mesNum = Number(mesCompra);
  const añoNum = Number(añoCompra);
  const esSegundoSemestre = mesNum >= 7 && mesNum <= 12 && añoNum === period.añoCierre;

  const purchaseYears = Array.from(
    { length: period.añoCierre - 2020 + 1 },
    (_, i) => period.añoCierre - i,
  );

  const preview = getPorcentajePreview(mesNum, añoNum, period.mesCierre, period.añoCierre);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleAñoCompraChange(val: string) {
    setAñoCompra(val);
    if (Number(val) < period.añoCierre && mesNum >= 7) {
      setMesCompra('1');
    }
  }

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

    const updated: InventoryItem = {
      id: item.id,
      nombre: nombre.trim(),
      unidad,
      cantidad: cant,
      valorUnitario: val,
      mesCompra: mesNum,
      añoCompra: añoNum,
      ...(esSegundoSemestre ? { precioReposicion: Number(precioReposicion) } : {}),
    };

    try {
      calcularCorreccion(updated, period.mesCierre, period.añoCierre);
      onSave(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular la corrección.');
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Editar ítem"
    >
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar Ítem</h2>
          <button className="btn-icon modal-close" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="field">
            <label htmlFor="edit-nombre">Nombre del ítem</label>
            <input
              id="edit-nombre"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Cobre en barra 2mm"
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="edit-cantidad">Cantidad</label>
              <input
                id="edit-cantidad"
                type="number"
                min="0.001"
                step="any"
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="field">
              <label htmlFor="edit-unidad">Unidad</label>
              <select
                id="edit-unidad"
                value={unidad}
                onChange={e => setUnidad(e.target.value as Unidad)}
              >
                {UNIDADES.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="edit-valor">Valor unitario de compra (CLP $)</label>
            <input
              id="edit-valor"
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
              <label htmlFor="edit-mes-compra">Mes de compra</label>
              <select
                id="edit-mes-compra"
                value={mesCompra}
                onChange={e => setMesCompra(e.target.value)}
              >
                {MONTHS.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="edit-año-compra">Año de compra</label>
              <select
                id="edit-año-compra"
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
              <label htmlFor="edit-reposicion">
                Precio de reposición más alto del año (CLP $)
                <span className="field-hint">Fórmula 2 — Segundo semestre</span>
              </label>
              <input
                id="edit-reposicion"
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

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
