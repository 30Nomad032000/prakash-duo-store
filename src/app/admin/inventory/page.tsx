'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  AlertTriangle,
  Package,
  Download,
  Plus,
  Minus,
  Save,
  X,
} from 'lucide-react';

interface InventoryItem {
  product_id: string;
  product_name: string;
  product_image: string;
  category: string;
  size: string;
  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
}

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || '');
  const [editModal, setEditModal] = useState<InventoryItem | null>(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [editAction, setEditAction] = useState<'set' | 'add' | 'subtract'>('set');
  const [saving, setSaving] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (filter) params.set('filter', filter);

      const res = await fetch(`/api/admin/inventory?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setInventory(data.inventory);
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category, filter]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const updateUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/inventory?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search });
  };

  const handleUpdateStock = async () => {
    if (!editModal) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/inventory/${editModal.product_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size: editModal.size,
          quantity: editQuantity,
          action: editAction,
        }),
      });

      if (res.ok) {
        setEditModal(null);
        fetchInventory();
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/inventory/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export inventory:', error);
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditModal(item);
    setEditQuantity(item.quantity);
    setEditAction('set');
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    }
    if (item.quantity <= item.low_stock_threshold) {
      return { label: 'Low Stock', color: 'bg-amber-100 text-amber-800' };
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  // Group inventory by product
  const groupedInventory = inventory.reduce((acc, item) => {
    if (!acc[item.product_id]) {
      acc[item.product_id] = {
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        category: item.category,
        sizes: [],
      };
    }
    acc[item.product_id].sizes.push(item);
    return acc;
  }, {} as Record<string, { product_id: string; product_name: string; product_image: string; category: string; sizes: InventoryItem[] }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Manage stock levels for all products
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </form>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              updateUrl({ category: e.target.value });
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Stock filter */}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              updateUrl({ filter: e.target.value });
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          >
            <option value="">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
            <option value="in">In Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          </div>
        ) : Object.keys(groupedInventory).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No inventory found</p>
          </div>
        ) : (
          <div className="divide-y">
            {Object.values(groupedInventory).map((product) => (
              <div key={product.product_id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.product_image && (
                      <Image
                        src={product.product_image}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/products/${product.product_id}`}
                      className="font-medium text-gray-900 hover:text-amber-600"
                    >
                      {product.product_name}
                    </Link>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {product.sizes.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <div
                        key={`${item.product_id}-${item.size}`}
                        className="border rounded-lg p-3 hover:border-amber-300 transition cursor-pointer"
                        onClick={() => openEditModal(item)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Size {item.size}</span>
                          {item.quantity <= item.low_stock_threshold && (
                            <AlertTriangle
                              className={`w-4 h-4 ${
                                item.quantity === 0
                                  ? 'text-red-500'
                                  : 'text-amber-500'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">
                            {item.quantity}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        {item.reserved_quantity > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.reserved_quantity} reserved
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Stock Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setEditModal(null)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Stock
                </h3>
                <button
                  onClick={() => setEditModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="font-medium text-gray-900">
                  {editModal.product_name}
                </p>
                <p className="text-sm text-gray-500">Size: {editModal.size}</p>
                <p className="text-sm text-gray-500">
                  Current Stock: {editModal.quantity}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditAction('set');
                        setEditQuantity(editModal.quantity);
                      }}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                        editAction === 'set'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Set to
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditAction('add');
                        setEditQuantity(0);
                      }}
                      className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg border-2 font-medium transition ${
                        editAction === 'add'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditAction('subtract');
                        setEditQuantity(0);
                      }}
                      className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg border-2 font-medium transition ${
                        editAction === 'subtract'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) =>
                      setEditQuantity(parseInt(e.target.value) || 0)
                    }
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                {editAction !== 'set' && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      New stock will be:{' '}
                      <span className="font-medium">
                        {editAction === 'add'
                          ? editModal.quantity + editQuantity
                          : Math.max(0, editModal.quantity - editQuantity)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStock}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Update Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
