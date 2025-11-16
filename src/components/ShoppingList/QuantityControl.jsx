import { useList } from "../../contexts/ListContext";



export default function QuantityControl({ name, qty }) {
  const { updateQty } = useList();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateQty(name, qty - 1)}
        className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full active:scale-95"
      >
        -
      </button>

      <div classname="w-6 text-center text-sm">{qty}</div>

      <button
        onClick={() => updateQty(name, qty + 1)}
        className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full active:scale-95"
      >
        +
      </button>
    </div>
  );
}
