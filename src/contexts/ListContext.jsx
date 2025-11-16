import { createContext, useContext, useState, useMemo } from "react";

const ListContext = createContext(null);

export function ListProvider({ children }) {
  const [list, setList] = useState([]);

  // Add/update item from backend object or from search
  function addOrUpdateItemFromBackend(item) {
    if (!item || !item.name) return;

    const qty = item.quantity ?? item.qty ?? item.qty ?? 1;
    const price = item.price ?? 0;
    const category = item.category ?? "";

    setList((prev) => {
      const idx = prev.findIndex(
        (p) => p.name.toLowerCase() === item.name.toLowerCase()
      );

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty, price, category, name: item.name };
        return copy;
      }

      return [{ name: item.name, qty, price, category }, ...prev];
    });
  }

  function removeItemByBackendName(name) {
    if (!name) return;
    setList((prev) =>
      prev.filter((p) => p.name.toLowerCase() !== name.toLowerCase())
    );
  }

  function updateQty(name, qty) {
    if (!name) return;
    if (qty <= 0) {
      removeItemByBackendName(name);
      return;
    }
    setList((prev) =>
      prev.map((p) =>
        p.name.toLowerCase() === name.toLowerCase() ? { ...p, qty } : p
      )
    );
  }

  // Unified backend handler
  function applyBackendAction(actionData) {
    if (!actionData) return;

    // backend returns a full Item object
    if (actionData.name && (actionData.quantity != null || actionData.qty != null)) {
      addOrUpdateItemFromBackend({
        name: actionData.name,
        quantity: actionData.quantity ?? actionData.qty,
        price: actionData.price,
        category: actionData.category
      });
      return;
    }

    // backend returns top-level removed item
    if (actionData.removed && actionData.removed.name) {
      removeItemByBackendName(actionData.removed.name);
      return;
    }

    // small action objects 
    const { action, name, qty, price } = actionData;
    if (action === "add") {
      addOrUpdateItemFromBackend({ name, quantity: qty ?? 1, price });
    } else if (action === "remove") {
      removeItemByBackendName(name);
    } else if (action === "update_qty") {
      updateQty(name, qty);
    } else if (action.type === "clear") {
      setList([]);
    } else {
      
      if (actionData.name) {
        addOrUpdateItemFromBackend({ name: actionData.name, quantity: actionData.quantity ?? 1, price: actionData.price });
      }
    }
  }

  // Public helpers
  function addOrUpdateItem(item) {
    addOrUpdateItemFromBackend(item);
  }

  function removeItem(name) {
    removeItemByBackendName(name);
  }

  const total = useMemo(() => {
    return list.reduce((s, it) => s + (it.price ?? 0) * (it.qty ?? it.quantity ?? 1), 0);
  }, [list]);

  return (
    <ListContext.Provider
      value={{
        list,
        addOrUpdateItem,
        removeItem,
        updateQty,
        applyBackendAction,
        total
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  return useContext(ListContext);
}
