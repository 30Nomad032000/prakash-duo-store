'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, X, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BANGLE_SIZES = ['2.2', '2.4', '2.6', '2.8', '2.10'];

interface Category {
  id: string;
  name: string;
  slug: string;
}

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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(['']);
  const [isActive, setIsActive] = useState(true);
  const [stock, setStock] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();
      if (data.success && data.product) {
        const p = data.product;
        setProduct(p);
        setName(p.name);
        setPrice(p.price.toString());
        setCategory(p.category);
        setSubcategory(p.subcategory || '');
        setSelectedSizes(p.sizes);
        setImages(p.images.length > 0 ? p.images : ['']);
        setIsActive(p.is_active);

        // Set stock from inventory
        const stockMap: Record<string, number> = {};
        if (p.inventory) {
          p.inventory.forEach((inv: { size: string; quantity: number }) => {
            stockMap[inv.size] = inv.quantity;
          });
        }
        setStock(stockMap);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
      const newStock = { ...stock };
      delete newStock[size];
      setStock(newStock);
    } else {
      setSelectedSizes([...selectedSizes, size]);
      setStock({ ...stock, [size]: 0 });
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const validImages = images.filter((img) => img.trim() !== '');

      if (validImages.length === 0) {
        setError('At least one image URL is required');
        setSaving(false);
        return;
      }

      if (selectedSizes.length === 0) {
        setError('At least one size must be selected');
        setSaving(false);
        return;
      }

      const inventory = selectedSizes.map((size) => ({
        size,
        quantity: stock[size] || 0,
      }));

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          category,
          subcategory,
          sizes: selectedSizes,
          images: validImages,
          is_active: isActive,
          inventory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update product');
        return;
      }

      router.push('/admin/products');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-ochre"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-charcoal/50">Product not found</p>
        <Link
          href="/admin/products"
          className="mt-4 inline-flex items-center gap-2 text-deep-ochre hover:text-deep-ochre/80"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-charcoal/5 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-charcoal">Edit Product</h1>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Status Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-charcoal">
                Product Status
              </h2>
              <p className="text-sm text-charcoal/50">
                {isActive
                  ? 'Product is visible to customers'
                  : 'Product is hidden from customers'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-charcoal/5 text-charcoal/70'
              }`}
            >
              {isActive ? (
                <>
                  <Eye className="w-4 h-4" />
                  Active
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Inactive
                </>
              )}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1">
                Product ID
              </label>
              <input
                type="text"
                value={product.id}
                disabled
                className="w-full px-4 py-2.5 border border-gold/10 bg-warm-ivory/50 rounded-lg text-charcoal/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1">
                  Price (INR) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1">
                  Category *
                </label>
                <Select
                  value={category || undefined}
                  onValueChange={(val) => setCategory(val)}
                >
                  <SelectTrigger className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg h-auto">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1">
                Subcategory (optional)
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Sizes & Stock */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">
            Sizes & Stock
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-2">
                Available Sizes *
              </label>
              <div className="flex flex-wrap gap-2">
                {BANGLE_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                      selectedSizes.includes(size)
                        ? 'border-deep-ochre bg-deep-ochre/5 text-deep-ochre/80'
                        : 'border-gold/10 hover:border-charcoal/15'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {selectedSizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-2">
                  Stock per Size
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedSizes.map((size) => (
                    <div key={size} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-12">
                        Size {size}:
                      </span>
                      <input
                        type="number"
                        value={stock[size] || 0}
                        onChange={(e) =>
                          setStock({
                            ...stock,
                            [size]: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        className="flex-1 px-3 py-2 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">
            Product Images
          </h2>
          <div className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="flex-1 px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                    />
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {image && (
                    <div className="mt-2 relative w-20 h-20 bg-charcoal/5 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="flex items-center gap-2 text-deep-ochre hover:text-deep-ochre/80 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Another Image
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/admin/products"
            className="flex-1 px-6 py-3 border border-charcoal/15 rounded-lg text-center hover:bg-warm-ivory/50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
