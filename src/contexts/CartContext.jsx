// src/contexts/CartContext.jsx
import { createContext, useContext, useState } from "react";
import Api from "../api/Api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });

  function recalc(items) {
    return items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0);
  }

  async function loadCart(userId) {
    const data = await Api.Cart.get(userId);
    const items = data?.items ?? [];
    setCart({ items, total: recalc(items) });
  }

  async function addToCart(item) {
    const updated = await Api.Cart.add(item);
    const items = updated?.items ?? [];
    setCart({ items, total: recalc(items) });
  }


  //  increment using correct ID

  async function increment(item) {
    const itemId = item.id || item._id;
    const updated = await Api.Cart.updateQty(itemId, item.quantity + 1);
    const items = updated?.items ?? [];
    setCart({ items, total: recalc(items) });
  }


  // decrement using correct ID

  async function decrement(item) {
    const itemId = item.id || item._id;
    const newQty = item.quantity - 1;

    if (newQty <= 0) {
      return remove(item);
    }

    const updated = await Api.Cart.updateQty(itemId, newQty);
    const items = updated?.items ?? [];
    setCart({ items, total: recalc(items) });
  }


  // remove using correct ID

  async function remove(item) {
    const itemId = item.id || item._id;
    await Api.Cart.remove(itemId);

    const newItems = cart.items.filter((i) => (i.id || i._id) !== itemId);
    setCart({ items: newItems, total: recalc(newItems) });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loadCart,
        addToCart,
        increment,
        decrement,
        remove,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
