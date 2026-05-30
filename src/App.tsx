import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import { calcularCorreccion } from './lib/calculator';
import { getLatestAvailablePeriod } from './data/siiTables';
import type { PeriodConfig, ItemWithCalc } from './types';
import Header from './components/Header';
import PeriodSelector from './components/PeriodSelector';
import ItemForm from './components/ItemForm';
import SiiTable from './components/SiiTable';
import InventoryTable from './components/InventoryTable';
import EditItemModal from './components/EditItemModal';
import ExportButton from './components/ExportButton';
import EmptyState from './components/EmptyState';

const defaultPeriod = getLatestAvailablePeriod();

export default function App() {
  const [period, setPeriod] = useState<PeriodConfig>({
    añoCierre: defaultPeriod.año,
    mesCierre: defaultPeriod.mes,
  });
  const { items, addItem, removeItem, updateItem, clearAll } = useInventory();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const editingItem = editingItemId ? items.find(i => i.id === editingItemId) ?? null : null;

  const itemsWithCalc: ItemWithCalc[] = items.map(item => {
    try {
      const resultado = calcularCorreccion(item, period.mesCierre, period.añoCierre);
      return { item, resultado, error: null };
    } catch (err) {
      return {
        item,
        resultado: null,
        error: err instanceof Error ? err.message : 'Error de cálculo',
      };
    }
  });

  const validItems = itemsWithCalc.filter(i => i.resultado !== null);
  const totalOriginal = validItems.reduce((s, i) => s + i.resultado!.valorOriginalTotal, 0);
  const totalReajustado = validItems.reduce((s, i) => s + i.resultado!.valorReajustadoTotal, 0);

  const highlightedCells = validItems.map(({ item }) => ({
    rowKey: item.añoCompra < period.añoCierre ? 'capital_inicial' : String(item.mesCompra),
    col: period.mesCierre,
  }));

  function handleClearAll() {
    if (showClearConfirm) {
      clearAll();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="main">
        <PeriodSelector period={period} onChange={p => { setPeriod(p); setShowClearConfirm(false); }} />

        <div className="content-grid">
          <div className="panel-form">
            <ItemForm period={period} onAdd={addItem} />
          </div>
          <div className="panel-table">
            <SiiTable
              año={period.añoCierre}
              mesCierre={period.mesCierre}
              highlightedCells={highlightedCells}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <InventoryTable
            items={itemsWithCalc}
            period={period}
            totalOriginal={totalOriginal}
            totalReajustado={totalReajustado}
            onRemove={removeItem}
            onEdit={setEditingItemId}
          />
        )}

        {items.length > 0 && (
          <div className="actions">
            <ExportButton
              items={itemsWithCalc}
              period={period}
              totalOriginal={totalOriginal}
              totalReajustado={totalReajustado}
            />
            <button
              className={`btn ${showClearConfirm ? 'btn-danger-confirm' : 'btn-danger'}`}
              onClick={handleClearAll}
            >
              {showClearConfirm ? '¿Confirmar limpieza?' : 'Limpiar todo'}
            </button>
            {showClearConfirm && (
              <button className="btn btn-secondary" onClick={() => setShowClearConfirm(false)}>
                Cancelar
              </button>
            )}
          </div>
        )}
      </main>

      {editingItem && (
        <EditItemModal
          item={editingItem}
          period={period}
          onSave={updated => { updateItem(updated); setEditingItemId(null); }}
          onClose={() => setEditingItemId(null)}
        />
      )}

      <footer className="footer">
        <p>
          Fuente oficial:{' '}
          <a
            href={`https://www.sii.cl/valores_y_fechas/correccion_monetaria/correccion${period.añoCierre}.htm`}
            target="_blank"
            rel="noopener noreferrer"
          >
            SII — Tabla de Corrección Monetaria {period.añoCierre}
          </a>
        </p>
        <p>Taller de Ingeniería de Software — Sección 302, UTEM · Cliente: Mujer Cobra (Bárbara Becerra)</p>
      </footer>
    </div>
  );
}
