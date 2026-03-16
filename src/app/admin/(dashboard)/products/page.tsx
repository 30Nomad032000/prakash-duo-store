'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  is_active: boolean;
  inventory?: { size: string; quantity: number }[];
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [showInactive, setShowInactive] = useState(
    searchParams.get('inactive') === 'true'
  );
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const limit = 20;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (showInactive) params.set('inactive', 'true');
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category, showInactive, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl({ search, page: '1' });
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to toggle product status:', error);
    }
  };

  const getTotalStock = (product: Product) => {
    if (!product.inventory) return 0;
    return product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
  };

  const hasLowStock = (product: Product) => {
    if (!product.inventory) return false;
    return product.inventory.some((inv) => inv.quantity <= 5 && inv.quantity > 0);
  };

  const isOutOfStock = (product: Product) => {
    if (!product.inventory || product.inventory.length === 0) return true;
    return product.inventory.every((inv) => inv.quantity === 0);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-charcoal/50">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 transition"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
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

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-charcoal/40" />
            <Select
              value={category || "all"}
              onValueChange={(val) => {
                const newCategory = val === "all" ? "" : val;
                setCategory(newCategory);
                setPage(1);
                updateUrl({ category: newCategory, page: '1' });
              }}
            >
              <SelectTrigger className="w-full md:w-[200px] shrink-0 px-4 py-2.5 border border-charcoal/15 rounded-lg h-auto">
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
          </div>

          {/* Show inactive toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => {
                setShowInactive(e.target.checked);
                setPage(1);
                updateUrl({
                  inactive: e.target.checked ? 'true' : '',
                  page: '1',
                });
              }}
              className="w-4 h-4 text-deep-ochre rounded focus:ring-deep-ochre"
            />
            <span className="text-sm text-charcoal/60">Show inactive</span>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-ochre mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-charcoal/50">
            <Package className="w-12 h-12 mx-auto mb-4 text-charcoal/20" />
            <p>No products found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-warm-ivory/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/10">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-deep-ochre/5 ${
                        !product.is_active ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 bg-charcoal/5 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-charcoal truncate max-w-xs">
                              {product.name}
                            </p>
                            <p className="text-xs text-charcoal/50">
                              {product.sizes.length} size
                              {product.sizes.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-charcoal/60">
                          {product.category}
                        </span>
                        {product.subcategory && (
                          <span className="text-xs text-charcoal/40 block">
                            {product.subcategory}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              isOutOfStock(product)
                                ? 'text-red-600'
                                : hasLowStock(product)
                                ? 'text-amber-600'
                                : 'text-green-600'
                            }`}
                          >
                            {getTotalStock(product)}
                          </span>
                          {(hasLowStock(product) || isOutOfStock(product)) && (
                            <AlertTriangle
                              className={`w-4 h-4 ${
                                isOutOfStock(product)
                                  ? 'text-red-500'
                                  : 'text-amber-500'
                              }`}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-charcoal/10 text-charcoal'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-charcoal/50 hover:text-deep-ochre hover:bg-deep-ochre/5 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              toggleProductStatus(product.id, product.is_active)
                            }
                            className={`p-2 rounded-lg transition ${
                              product.is_active
                                ? 'text-charcoal/50 hover:text-red-600 hover:bg-red-50'
                                : 'text-charcoal/50 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={
                              product.is_active
                                ? 'Deactivate Product'
                                : 'Activate Product'
                            }
                          >
                            {product.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-charcoal/50">
                  Showing {(page - 1) * limit + 1} to{' '}
                  {Math.min(page * limit, total)} of {total} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPage(page - 1);
                      updateUrl({ page: (page - 1).toString() });
                    }}
                    disabled={page === 1}
                    className="p-2 rounded-lg border hover:bg-deep-ochre/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      setPage(page + 1);
                      updateUrl({ page: (page + 1).toString() });
                    }}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border hover:bg-deep-ochre/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
