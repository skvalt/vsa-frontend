import { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { Plus, Minus, Trash, ShoppingBag, Banknote, ShoppingCart } from "lucide-react";
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
    <div className="pb-36 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Premium Header with Gradient */}
      <div className="relative mt-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-indigo-600/20 blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Shopping Cart
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {cart?.items?.length || 0} {cart?.items?.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Empty State */}
      {cart?.items?.length === 0 && (
        <div className="relative mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 blur-2xl"></div>
          <div className="relative bg-gray-900/40 border border-white/5 rounded-3xl p-12 text-center backdrop-blur-xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
              <ShoppingCart className="text-purple-400" size={36} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-200 mb-2">Your cart is empty</h3>
            <p className="text-gray-500">Add some products to get started</p>
          </div>
        </div>
      )}

      {/* Premium Cart Items */}
      <div className="space-y-4 mt-6">
        {cart?.items?.map((i, idx) => (
          <div
            key={i.id || i._id}
            className="group relative"
            style={{
              animation: `slideIn 0.4s ease-out ${idx * 0.1}s both`
            }}
          >
            {/* Glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-2xl transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-purple-500/20">
              
              <div className="flex justify-between items-start gap-4">
                
                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    
                    {/* Decorative Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-600/10 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                      <ShoppingBag className="text-purple-400" size={24} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-1 truncate">{i.name}</h3>
                      <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
                        <span className="text-xs font-medium text-purple-300">{i.category}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ₹{i.price}
                        </span>
                        <span className="text-sm text-gray-500">per item</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => remove(i)}
                  className="w-11 h-11 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-red-500/20"
                >
                  <Trash size={20} />
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 font-medium">Quantity</span>
                  
                  <div className="flex items-center gap-3 bg-gray-800/50 rounded-2xl p-1.5 border border-white/5">
                    <button
                      onClick={() => decrement(i)}
                      className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl text-gray-200 hover:from-purple-600 hover:to-indigo-600 hover:text-white transition-all duration-300 active:scale-90 shadow-lg hover:shadow-purple-500/30 border border-white/5"
                    >
                      <Minus size={18} strokeWidth={2.5} />
                    </button>

                    <span className="text-2xl text-white font-bold min-w-[3rem] text-center">
                      {i.quantity}
                    </span>

                    <button
                      onClick={() => increment(i)}
                      className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl text-white hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 active:scale-90 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Subtotal</div>
                  <div className="text-xl font-bold text-white">
                    ₹{((i.price || 0) * i.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Total Bar */}
      {cart?.items?.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-2 sm:px-2 flex justify-center z-50 mb-5">
          <div className="w-full max-w-2xl relative">

            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 blur-2xl opacity-50 rounded-3xl"></div>

            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-3xl p-4 shadow-2xl backdrop-blur-xl border border-white/20">
              <div className="flex justify-between items-center">
                
                <div>
                  <div className="text-sm text-purple-100 flex items-center gap-2">
                    <Banknote size={14} />
                    <span>Total Amount</span>
                  </div>
                  <span className="text-xl font-black tracking-tight pl-1">
                    ₹{total?.toLocaleString()}
                  </span>
                </div>

                <button className="mr-2 px-3 py-2 bg-white text-purple-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all duration-300 active:scale-95 shadow-xl hover:shadow-2xl">
                  Checkout
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED STYLE TAG — REMOVED jsx */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}
