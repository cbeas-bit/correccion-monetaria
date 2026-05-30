import { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';

const STORAGE_KEY = 'mujer-cobra-inventario-v1';

function loadFromStorage(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(item: InventoryItem) {
    setItems(prev => [...prev, item]);
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function updateItem(updated: InventoryItem) {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  }

  function clearAll() {
    setItems([]);
  }

  return { items, addItem, removeItem, updateItem, clearAll };
}
