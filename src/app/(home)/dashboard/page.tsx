"use client";

import { useEffect, useState } from "react";

type Selling = {
  id: number;
  weight: number;
  rate: number;
  total: number;
  type: "BUY" | "SELL";
  createdAt: string;
  item: { name: string };
};

type DashboardData = {
  summary: {
    totalBuy: number;
    totalSell: number;
    profit: number;
  };
  sellings: Selling[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sales")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6 text-red-600">Error loading dashboard</div>;

  const { summary, sellings } = data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Buy</h2>
          <p className="text-xl font-bold text-green-700">₹{summary.totalBuy.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Sell</h2>
          <p className="text-xl font-bold text-blue-700">₹{summary.totalSell.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Profit / Loss</h2>
          <p
            className={`text-xl font-bold ${
              summary.profit >= 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            ₹{summary.profit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Weight</th>
              <th className="p-2 text-left">Rate</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {sellings.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="p-2">{s.item.name}</td>
                <td className="p-2">{s.weight}</td>
                <td className="p-2">₹{s.rate}</td>
                <td className="p-2 font-semibold">₹{s.total}</td>
                <td
                  className={`p-2 font-bold ${
                    s.type === "BUY" ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {s.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
