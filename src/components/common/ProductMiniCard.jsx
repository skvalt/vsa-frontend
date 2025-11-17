import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { Tag } from "lucide-react";

export default function ProductMiniCard({ product }) {
  const { addToCart } = useCart();

  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(false);

  const oldPrice = product.oldPrice || Math.round(product.price * 1.25);
  const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100);

  async function handleAddClick() {
    if (qty === 0) {
      setQty(1);
      return;
    }

    try {
      setLoading(true);

      await addToCart({
        userId: product.userId,
        productId: product.id || product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        brand: product.brand,
        category: product.category,
        unit: product.unit,
      });

      setQty(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative bg-gray-900 p-4 rounded-2xl border border-gray-700 hover:border-blue-500/40 transition">

      {/* Discount */}
      <div className="absolute -top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
        <Tag size={12} /> {discount}% OFF
      </div>

      <div className="text-white font-semibold text-sm mt-4 truncate">
        {product.name}
      </div>
      <div className="text-xs text-gray-400">{product.brand || "Brand"}</div>

      <div className="flex items-center gap-2 mt-2">
        <div className="text-blue-300 font-bold">₹{product.price}</div>
        <div className="text-gray-500 text-xs line-through">₹{oldPrice}</div>
      </div>

      <div className="text-xs text-gray-500">{product.unit}</div>

      {/* Add */}
      <div className="mt-3">
        {qty === 0 ? (
          <button
            onClick={handleAddClick}
            className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm active:scale-95"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center"
            >
              -
            </button>
            <div className="text-white w-6 text-center">{qty}</div>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center"
            >
              +
            </button>
            <button
              disabled={loading}
              onClick={handleAddClick}
              className="flex-1 py-2 bg-blue-500 text-white rounded-xl text-sm active:scale-95"
            >
              {loading ? "..." : "Add"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
