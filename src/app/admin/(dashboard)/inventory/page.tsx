'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  ChevronDown,
  Check,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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

interface GroupedProduct {
  product_id: string;
  product_name: string;
  product_image: string;
  category: string;
  sizes: InventoryItem[];
}

interface CategoryGroup {
  name: string;
  products: GroupedProduct[];
  totalProducts: number;
  totalStock: number;
  outOfStockCount: number;
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
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [addSizeModal, setAddSizeModal] = useState<GroupedProduct | null>(null);
  const [newSize, setNewSize] = useState('');
  const [newSizeQty, setNewSizeQty] = useState(0);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'all') params.set('category', category);
      if (filter && filter !== 'all') params.set('filter', filter);

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

  // Group inventory by product, then by category
  const categoryGroups = useMemo(() => {
    // First group by product
    const productMap = inventory.reduce((acc, item) => {
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
    }, {} as Record<string, GroupedProduct>);

    // Then group products by category
    const catMap = Object.values(productMap).reduce((acc, product) => {
      const catName = product.category || 'Uncategorized';
      if (!acc[catName]) {
        acc[catName] = {
          name: catName,
          products: [],
          totalProducts: 0,
          totalStock: 0,
          outOfStockCount: 0,
        };
      }
      acc[catName].products.push(product);
      acc[catName].totalProducts += 1;

      product.sizes.forEach((s) => {
        acc[catName].totalStock += s.quantity;
        if (s.quantity === 0) {
          acc[catName].outOfStockCount += 1;
        }
      });

      return acc;
    }, {} as Record<string, CategoryGroup>);

    // Sort categories alphabetically
    return Object.values(catMap).sort((a, b) => a.name.localeCompare(b.name));
  }, [inventory]);

  // Default all categories to expanded once data loads
  useEffect(() => {
    if (categoryGroups.length > 0 && expandedCategories.size === 0) {
      setExpandedCategories(new Set(categoryGroups.map((cg) => cg.name)));
    }
  }, [categoryGroups, expandedCategories.size]);

  const toggleCategory = (catName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catName)) {
        next.delete(catName);
      } else {
        next.add(catName);
      }
      return next;
    });
  };

  const updateUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
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
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setEditModal(null);
          fetchInventory();
        }, 800);
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

  const handleAddSize = async () => {
    if (!addSizeModal || !newSize.trim()) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/inventory/${addSizeModal.product_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size: newSize.trim(),
          quantity: newSizeQty,
          action: 'set',
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setAddSizeModal(null);
          setNewSize('');
          setNewSizeQty(0);
          fetchInventory();
        }, 800);
      }
    } catch (error) {
      console.error('Failed to add size:', error);
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditModal(item);
    setEditQuantity(item.quantity);
    setEditAction('set');
    setSaveSuccess(false);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return { label: 'OUT', color: 'border-red-300 bg-red-50', textColor: 'text-red-600' };
    }
    if (item.quantity <= item.low_stock_threshold) {
      return { label: 'LOW', color: 'border-amber-300 bg-amber-50', textColor: 'text-amber-600' };
    }
    return { label: '', color: 'border-green-300 bg-green-50', textColor: 'text-green-600' };
  };

  // Summary stats
  const totalItems = inventory.length;
  const totalOutOfStock = inventory.filter((i) => i.quantity === 0).length;
  const totalLowStock = inventory.filter(
    (i) => i.quantity > 0 && i.quantity <= i.low_stock_threshold
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-charcoal/50">
            Manage stock levels for all products
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 border border-charcoal/15 rounded-lg hover:bg-deep-ochre/5 transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-deep-ochre/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-deep-ochre" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal">{totalItems}</p>
            <p className="text-xs text-charcoal/50">Total Size Variants</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{totalOutOfStock}</p>
            <p className="text-xs text-charcoal/50">Out of Stock</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{totalLowStock}</p>
            <p className="text-xs text-charcoal/50">Low Stock</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
              />
            </div>
          </form>

          {/* Category filter - shadcn Select */}
          <Select
            value={category || 'all'}
            onValueChange={(value) => {
              setCategory(value === 'all' ? '' : value);
              updateUrl({ category: value });
            }}
          >
            <SelectTrigger className="w-full md:w-[200px] h-[42px] border-charcoal/15 rounded-lg">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stock filter - shadcn Select */}
          <Select
            value={filter || 'all'}
            onValueChange={(value) => {
              setFilter(value === 'all' ? '' : value);
              updateUrl({ filter: value });
            }}
          >
            <SelectTrigger className="w-full md:w-[200px] h-[42px] border-charcoal/15 rounded-lg">
              <SelectValue placeholder="All Stock Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Levels</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
              <SelectItem value="in">In Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventory - Grouped by Category */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-ochre mx-auto" />
        </div>
      ) : categoryGroups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-charcoal/50">
          <Package className="w-12 h-12 mx-auto mb-4 text-charcoal/20" />
          <p>No inventory found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categoryGroups.map((catGroup) => {
            const isExpanded = expandedCategories.has(catGroup.name);
            return (
              <div
                key={catGroup.name}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Category Accordion Header */}
                <button
                  onClick={() => toggleCategory(catGroup.name)}
                  className="w-full flex items-center justify-between p-5 hover:bg-warm-ivory/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`w-5 h-5 text-charcoal/40 transition-transform duration-200 ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                    <h3 className="text-lg font-semibold text-charcoal">
                      {catGroup.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-deep-ochre/10 text-deep-ochre border-0"
                    >
                      {catGroup.totalProducts} product{catGroup.totalProducts !== 1 ? 's' : ''}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 border-0"
                    >
                      {catGroup.totalStock} in stock
                    </Badge>
                    {catGroup.outOfStockCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-700 border-0"
                      >
                        {catGroup.outOfStockCount} out
                      </Badge>
                    )}
                  </div>
                </button>

                {/* Category Products */}
                {isExpanded && (
                  <div className="border-t border-charcoal/5 p-5 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {catGroup.products.map((product) => (
                        <div
                          key={product.product_id}
                          className="border border-charcoal/10 rounded-xl p-4 hover:border-charcoal/20 transition"
                        >
                          {/* Product Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="relative w-14 h-14 bg-charcoal/5 rounded-lg overflow-hidden flex-shrink-0">
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
                                className="font-medium text-charcoal hover:text-deep-ochre transition-colors line-clamp-1"
                              >
                                {product.product_name}
                              </Link>
                              <Badge
                                variant="outline"
                                className="mt-1 text-[10px] text-charcoal/50 border-charcoal/15"
                              >
                                {product.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Size Grid */}
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {product.sizes.map((item) => {
                              const status = getStockStatus(item);
                              return (
                                <button
                                  key={`${item.product_id}-${item.size}`}
                                  onClick={() => openEditModal(item)}
                                  className={`relative border-2 rounded-lg p-2.5 text-center transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${status.color}`}
                                >
                                  <p className="text-[11px] font-medium text-charcoal/60 mb-0.5">
                                    {item.size}
                                  </p>
                                  <p className="text-xl font-bold text-charcoal">
                                    {item.quantity}
                                  </p>
                                  {item.quantity === 0 ? (
                                    <p className="text-[10px] font-semibold text-red-500">OUT</p>
                                  ) : item.quantity <= item.low_stock_threshold ? (
                                    <p className="text-[10px] font-semibold text-amber-500">LOW</p>
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-green-500 mx-auto" />
                                  )}
                                  {item.reserved_quantity > 0 && (
                                    <p className="text-[9px] text-charcoal/40 mt-0.5">
                                      {item.reserved_quantity} rsv
                                    </p>
                                  )}
                                </button>
                              );
                            })}
                            {/* Add Size Button */}
                            <button
                              onClick={() => {
                                setAddSizeModal(product);
                                setNewSize('');
                                setNewSizeQty(0);
                                setSaveSuccess(false);
                              }}
                              className="border-2 border-dashed border-charcoal/20 rounded-lg p-2.5 text-center transition-all hover:border-deep-ochre hover:bg-deep-ochre/5 cursor-pointer flex flex-col items-center justify-center gap-1"
                            >
                              <Plus className="w-5 h-5 text-charcoal/40" />
                              <p className="text-[10px] font-medium text-charcoal/40">Add Size</p>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Stock Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              if (!saving) setEditModal(null);
            }}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className={`relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transition-colors duration-300 ${
                saveSuccess ? 'ring-2 ring-green-500 bg-green-50/30' : ''
              }`}
            >
              {/* Success overlay */}
              {saveSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-10">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-semibold">Updated!</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-charcoal">
                  Update Stock
                </h3>
                <button
                  onClick={() => setEditModal(null)}
                  className="p-2 hover:bg-charcoal/5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 flex items-start gap-3">
                <div className="relative w-12 h-12 bg-charcoal/5 rounded-lg overflow-hidden flex-shrink-0">
                  {editModal.product_image && (
                    <Image
                      src={editModal.product_image}
                      alt={editModal.product_name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium text-charcoal">
                    {editModal.product_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-charcoal/15"
                    >
                      Size: {editModal.size}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] border-0 ${
                        editModal.quantity === 0
                          ? 'bg-red-100 text-red-700'
                          : editModal.quantity <= editModal.low_stock_threshold
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      Current: {editModal.quantity}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-2">
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
                          ? 'border-deep-ochre bg-deep-ochre/5 text-deep-ochre/80'
                          : 'border-charcoal/10 hover:border-charcoal/15'
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
                          : 'border-charcoal/10 hover:border-charcoal/15'
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
                          : 'border-charcoal/10 hover:border-charcoal/15'
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) =>
                      setEditQuantity(parseInt(e.target.value) || 0)
                    }
                    min="0"
                    className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                  />
                </div>

                {editAction !== 'set' && (
                  <div className="p-3 bg-warm-ivory/50 rounded-lg">
                    <p className="text-sm text-charcoal/60">
                      New stock will be:{' '}
                      <span className="font-semibold text-charcoal">
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
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 border border-charcoal/15 rounded-lg hover:bg-deep-ochre/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStock}
                  disabled={saving || saveSuccess}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 disabled:opacity-50 transition"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Update Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Size Modal */}
      {addSizeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => { if (!saving) setAddSizeModal(null); }}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className={`relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transition-colors duration-300 ${
                saveSuccess ? 'ring-2 ring-green-500 bg-green-50/30' : ''
              }`}
            >
              {saveSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-10">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-semibold">Size Added!</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-charcoal">Add New Size</h3>
                <button
                  onClick={() => setAddSizeModal(null)}
                  className="p-2 hover:bg-charcoal/5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 flex items-start gap-3">
                <div className="relative w-12 h-12 bg-charcoal/5 rounded-lg overflow-hidden flex-shrink-0">
                  {addSizeModal.product_image && (
                    <Image
                      src={addSizeModal.product_image}
                      alt={addSizeModal.product_name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium text-charcoal">{addSizeModal.product_name}</p>
                  <p className="text-sm text-charcoal/50">
                    Current sizes: {addSizeModal.sizes.map((s) => s.size).join(', ') || 'None'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-2">
                    Size
                  </label>
                  {/* Quick pick from standard bangle sizes */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['2.2', '2.4', '2.6', '2.8', '2.10'].map((s) => {
                      const alreadyExists = addSizeModal.sizes.some((inv) => inv.size === s);
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={alreadyExists}
                          onClick={() => setNewSize(s)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition ${
                            newSize === s
                              ? 'border-deep-ochre bg-deep-ochre/10 text-deep-ochre'
                              : alreadyExists
                              ? 'border-charcoal/5 text-charcoal/20 cursor-not-allowed bg-charcoal/5'
                              : 'border-charcoal/15 hover:border-deep-ochre/50 text-charcoal/60'
                          }`}
                        >
                          {s}
                          {alreadyExists && <span className="text-[9px] ml-1">(exists)</span>}
                        </button>
                      );
                    })}
                  </div>
                  {/* Or type a custom size */}
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Or type a custom size..."
                    className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">
                    Initial Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newSizeQty}
                    onChange={(e) => setNewSizeQty(parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setAddSizeModal(null)}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 border border-charcoal/15 rounded-lg hover:bg-deep-ochre/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSize}
                  disabled={saving || saveSuccess || !newSize.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 disabled:opacity-50 transition"
                >
                  <Plus className="w-4 h-4" />
                  {saving ? 'Adding...' : 'Add Size'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
