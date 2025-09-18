"use client";

import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [rate, setRate] = useState<number | "">("");
  const [preferenceId, setPreferenceId] = useState<number | "">("");
  const [message, setMessage] = useState("");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items", { credentials: "include" });
      if (!res.ok) {
        setMessage("❌ Failed to fetch items");
        return;
      }
      const data = await res.json();
      setItems(data);

      // 👇 default preference agar koi hai
      const prefItem = data.find((i: any) => i.preference === true);
      if (prefItem) {
        setPreferenceId(prefItem.id);
      } else if (data.length === 1) {
        // ek hi item hai to auto preference
        setPreferenceId(data[0].id);
      }
    } catch (err) {
      setMessage("⚠️ Error loading items");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // item select hone par name & rate auto fill
  const handleSelect = (id: number | "") => {
    setSelectedId(id);
    if (id) {
      const item = items.find((i) => i.id === id);
      if (item) {
        setName(item.name);
        setRate(item.rate);
      }
    } else {
      setName("");
      setRate("");
    }
  };

  // ✅ preference update
  const handlePreferenceSave = async () => {
    if (!preferenceId) return;

    try {
      const res = await fetch("/api/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId: preferenceId, userId: 1 }), // 👈 userId actual login se aayega
      });

      if (!res.ok) {
        setMessage("❌ Failed to save preference");
        return;
      }

      setMessage("✅ Preference updated");
      fetchItems(); // 👈 reload karo taaki naya preference dikhe
    } catch (err) {
      setMessage("⚠️ Error saving preference");
      console.error(err);
    }
  };

  // ✅ item save/update
  const handleSave = async () => {
    if (!name) return alert("Name required");

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: selectedId || undefined,
          name,
          rate: rate ? Number(rate) : 0,
        }),
      });

      if (!res.ok) {
        setMessage("❌ Failed to save item");
        return;
      }

      setName("");
      setRate("");
      setSelectedId("");
      fetchItems(); // 👈 list refresh
    } catch (err) {
      setMessage("⚠️ Error saving item");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">📦 Items</h1>

      {message && <p className="mb-3 text-sm text-gray-700">{message}</p>}

      {/* ✅ Preference dropdown */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">🌟 Preference</label>
        <select
          value={preferenceId}
          onChange={(e) =>
            setPreferenceId(e.target.value ? Number(e.target.value) : "")
          }
          className="border rounded p-2 w-full"
        >
          <option value="">-- Select Preference --</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {item.preference ? " ✅" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={handlePreferenceSave}
          className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
        >
          Save Preference
        </button>
      </div>

      {/* Item CRUD */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">📝 Item</label>
        <select
          value={selectedId}
          onChange={(e) =>
            handleSelect(e.target.value ? Number(e.target.value) : "")
          }
          className="border rounded p-2 w-full"
        >
          <option value="">➕ New Item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <input
          type="text"
          placeholder="Item name (e.g. गेहूँ)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Rate (₹)"
          value={rate}
          onChange={(e) =>
            setRate(e.target.value ? Number(e.target.value) : "")
          }
          className="border rounded p-2"
        />

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          {selectedId ? "Update" : "Save"}
        </button>
      </div>

      <ul className="divide-y border rounded mb-24">
        {items.length > 0 ? (
          items.map((p) => (
            <li
              key={p.id}
              className="p-2 flex justify-between"
            >
              <span>
                {p.name}{" "}
                {p.preference && <span className="text-green-600">🌟</span>}
              </span>
              <span className="text-sm text-gray-600">₹{p.rate}</span>
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-500 text-center">No items yet</li>
        )}
      </ul>
    </div>
  );
}
