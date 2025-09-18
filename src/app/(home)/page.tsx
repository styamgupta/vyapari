"use client";

import { useState, useEffect } from "react";

interface Item {
  id: number;
  name: string;
  rate: number;
  preference: boolean; // ✅ preference from backend
}

type TransactionType = "BUY" | "SELL";

export default function QuickSalePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [weight, setWeight] = useState<number | "">("");
  const [total, setTotal] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<TransactionType>("BUY"); // ✅ new state

  // Fetch items (with preference)
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data: Item[] = await res.json();
      setItems(data);

      // ✅ Auto-select preference item
      const pref = data.find((i) => i.preference === true);
      if (pref) {
        setSelectedItem(pref);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to load items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Update total automatically
  useEffect(() => {
    if (selectedItem && weight) {
      setTotal(Number(weight) * selectedItem.rate);
    } else {
      setTotal(0);
    }
  }, [weight, selectedItem]);

  // Add Sale
  const addSale = async () => {
    if (!selectedItem || !weight) {
      return alert("Weight required");
    }

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedItem.id,
          weight,
          rate: selectedItem.rate,
          total,
          type, // ✅ send BUY or SELL
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Error saving sale");
        return;
      }

      setWeight("");
      setTotal(0);
      setMessage("✅ Sale added");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error adding sale");
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto text-sm">
      <h1 className="text-lg font-bold mb-3 text-center">➕ Quick Sale</h1>

      {message && (
        <div className="mb-2 text-center text-green-600 font-medium">
          {message}
        </div>
      )}

      {/* Product Dropdown */}
      <select
        value={selectedItem?.id || ""}
        onChange={(e) =>
          setSelectedItem(items.find((i) => i.id === Number(e.target.value)) || null)
        }
        className="border p-3 rounded w-full mb-3 text-lg"
      >
        <option value="">-- Select Product --</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} (₹{item.rate})
            {item.preference ? " ⭐" : ""}
          </option>
        ))}
      </select>

      {/* Product Info */}
      {selectedItem ? (
        <div className="bg-white shadow rounded p-3 mb-3">
          <p className="font-semibold text-gray-800">
            Product: {selectedItem.name}
          </p>
          <p className="text-gray-600">Rate: ₹{selectedItem.rate}</p>
        </div>
      ) : (
        <p className="text-red-500 text-center mb-3">⚠️ No product selected</p>
      )}

      {/* Transaction Type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value as TransactionType)}
        className="border p-3 rounded w-full mb-3 text-lg"
      >
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

      {/* Weight Input */}
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        placeholder="Weight (kg)"
        className="border p-3 rounded w-full mb-3 text-lg"
      />

      {/* Total */}
      {total > 0 && (
        <div className="mb-3 text-center font-semibold text-lg">
          Total: ₹{total}
        </div>
      )}

      <button
        onClick={addSale}
        disabled={!selectedItem || !weight}
        className="bg-green-600 w-full py-3 rounded text-white font-semibold text-lg active:scale-95 transition"
      >
        ✅ Add {type}
      </button>
    </div>
  );
}
