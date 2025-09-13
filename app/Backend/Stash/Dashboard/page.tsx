"use client";
import React, { useEffect, useState } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { ToastContainer, toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface InventoryItem {
  AssetNumber: string;
  Brand: string;
  AssetType: string;
  Model: string;
  Processor: string;
  Ram: string;
  Storage: string;
  SerialNumber: string;
  PurchaseDate: string;
  AssetAge: string;
  Amount: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch("/api/Backend/Asset/Inventory/fetch");
        const data = await res.json();
        setInventory(data.data || []);
        setFilteredInventory(data.data || []);
      } catch (err) {
        toast.error("Failed to fetch inventory.");
        console.error(err);
      }
    };
    fetchInventory();
  }, []);

  // Filter inventory by createdAt
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredInventory(inventory);
      return;
    }
    const filtered = inventory.filter((item) => {
      const created = new Date(item.createdAt);
      const start = startDate ? new Date(startDate) : new Date("1970-01-01");
      const end = endDate ? new Date(endDate) : new Date();
      return created >= start && created <= end;
    });
    setFilteredInventory(filtered);
  }, [startDate, endDate, inventory]);

  const typeCounts = filteredInventory.reduce<Record<string, number>>((acc, item) => {
    acc[item.AssetType] = (acc[item.AssetType] || 0) + 1;
    return acc;
  }, {});

  const brandCounts = filteredInventory.reduce<Record<string, number>>((acc, item) => {
    acc[item.Brand] = (acc[item.Brand] || 0) + 1;
    return acc;
  }, {});

  const amountByType = filteredInventory.reduce<Record<string, number>>((acc, item) => {
    acc[item.AssetType] = (acc[item.AssetType] || 0) + (item.Amount || 0);
    return acc;
  }, {});

  const assetAgeGroups = filteredInventory.reduce<Record<string, number>>((acc, item) => {
    const ageYears = parseInt(item.AssetAge?.split(" ")[0]) || 0;
    const range =
      ageYears < 1
        ? "0-1 yr"
        : ageYears < 3
        ? "1-3 yrs"
        : ageYears < 5
        ? "3-5 yrs"
        : "5+ yrs";
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF5"];

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-[15px] font-bold mb-4">Dashboard</h1>

          {/* Date Range Filter */}
          <div className="flex gap-4 mb-6 text-[12px]">
            <div>
              <label className="block font-semibold mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-1 rounded text-[12px]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-1 rounded text-[12px]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="bg-gray-400 text-white px-2 py-1 rounded mt-5 text-[12px]"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assets by Type */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-[15px] font-semibold mb-2">Assets by Type</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(typeCounts).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={{ fontSize: 12 }}
                  >
                    {Object.entries(typeCounts).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip itemStyle={{ fontSize: 12 }} labelStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Assets by Brand */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-[15px] font-semibold mb-2">Assets by Brand</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={Object.entries(brandCounts).map(([name, value]) => ({ name, value }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip itemStyle={{ fontSize: 12 }} labelStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Asset Age Distribution (LineChart) */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-[15px] font-semibold mb-2">Asset Age Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={Object.entries(assetAgeGroups).map(([name, value]) => ({ name, value }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip itemStyle={{ fontSize: 12 }} labelStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke="#FFBB28" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Total Amount by Type (LineChart) */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-[15px] font-semibold mb-2">Total Amount by Asset Type</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={Object.entries(amountByType).map(([name, value]) => ({ name, value }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip itemStyle={{ fontSize: 12 }} labelStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke="#FF8042" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <ToastContainer className="text-xs" autoClose={1000} />
      </ParentLayout>
    </SessionChecker>
  );
}
