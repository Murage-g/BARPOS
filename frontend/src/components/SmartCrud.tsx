"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

// 🔹 Type definitions
interface Field {
  name: string;
  label: string;
}

interface SmartCRUDProps {
  title: string;
  endpoint: string;
  fields: Field[];
}

interface Item {
  [key: string]: any; // Each field can have any value type (string, number, etc.)
}

export default function SmartCRUD({ title, endpoint, fields }: SmartCRUDProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState<Item>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch data from API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  // Handle form input changes
  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  // Handle add/update
  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        // Update
        await api.put(`${endpoint}/${editingId}`, form);
      } else {
        // Create
        await api.post(endpoint, form);
      }
      setForm({});
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Failed to save item:", err);
    }
  };

  // Handle edit
  const handleEdit = (item: Item, id: number) => {
    setForm(item);
    setEditingId(id);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{f.label}</label>
              <input
                type="text"
                value={form[f.name] ?? ""}
                onChange={(e) => handleChange(f.name, e.target.value)}
                className="border rounded-md p-2 text-sm"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {editingId !== null ? "Update" : "Add"}
          </button>
          {editingId !== null && (
            <button
              onClick={() => { setForm({}); setEditingId(null); }}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No items found.</p>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                {fields.map((f) => (
                  <th key={f.name} className="py-2 px-3 text-left">{f.label}</th>
                ))}
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: Item, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {fields.map((f) => (
                    <td key={f.name} className="py-2 px-3">{item[f.name]}</td>
                  ))}
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(item, item.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
