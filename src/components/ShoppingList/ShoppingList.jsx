import ItemCard from "./ItemCard";
import { useList } from "../../contexts/ListContext";
import { Link } from "react-router-dom";

//Main shopping list container. Shows current list items + navigation to search.


export default function ShoppingList() {
  const { list, total } = useList();

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Your Shopping List</h2>

        <Link
          to="/search"
          className="text-sm text-indigo-600 underline underline-offset-2"
        >
          Search Items
        </Link>
      </div>

      <div className="rounded-lg border bg-white divide-y">
        {list.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Your list is empty. Start with a voice command or search.
          </div>
        ) : (
          list.map((item) => <ItemCard key={item.name} item={item} />)
        )}
      </div>

      <div className="mt-3 px-4">
        <div className="text-sm text-gray-600">Total: <span className="font-semibold">₹{total.toFixed(2)}</span></div>
      </div>
    </section>
  );
}
