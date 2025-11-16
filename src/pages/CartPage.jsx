import { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { Plus, Minus, Trash } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function CartPage() {
  const { user } = useAuth();
  const { cart, loadCart, increment, decrement, remove } = useCart();

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) loadCart(userId);
  }, [userId]);

  const total = cart?.items?.reduce(
    (acc, i) => acc + (i.price || 0) * i.quantity,
    0
  );

  return (
    <div className="pb-28">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Your Cart
      </h2>

      {cart?.items?.length === 0 && (
        <div className="text-gray-500 dark:text-gray-300 mt-4">
          Your cart is empty.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {cart?.items?.map((i) => {
          return (
            <div
              key={i.id || i._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {i.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {i.category}
                  </div>
                  <div className="text-purple-600 dark:text-purple-300 font-medium mt-1">
                    ₹{i.price}
                  </div>
                </div>

                <button
                  onClick={() => remove(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <button
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  onClick={() => decrement(i)}
                >
                  <Minus size={18} />
                </button>

                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {i.quantity}
                </span>

                <button
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  onClick={() => increment(i)}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-16 left-0 right-0 px-4">
        <div className="bg-purple-600 text-white rounded-xl p-4 shadow-xl flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold">₹{total}</span>
        </div>
      </div>
    </div>
  );
}
