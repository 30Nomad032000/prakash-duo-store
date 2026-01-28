'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';

const BANGLE_SIZES = ['2.2', '2.4', '2.6', '2.8', '2.10'];

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(['']);
  const [initialStock, setInitialStock] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const generateProductId = () => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 50);
    const categorySlug = category
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
    return `${categorySlug}_${slug}`;
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
      const newStock = { ...initialStock };
      delete newStock[size];
      setInitialStock(newStock);
    } else {
      setSelectedSizes([...selectedSizes, size]);
      setInitialStock({ ...initialStock, [size]: 0 });
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
    setLoading(true);

    try {
      const productId = generateProductId();
      const validImages = images.filter((img) => img.trim() !== '');

      if (validImages.length === 0) {
        setError('At least one image URL is required');
        setLoading(false);
        return;
      }

      if (selectedSizes.length === 0) {
        setError('At least one size must be selected');
        setLoading(false);
        return;
      }

      const inventory = selectedSizes.map((size) => ({
        size,
        quantity: initialStock[size] || 0,
      }));

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          name,
          price: parseFloat(price),
          category,
          subcategory,
          sizes: selectedSizes,
          images: validImages,
          inventory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create product');
        return;
      }

      router.push('/admin/products');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Premium AD Stone Ruby Bangle"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (INR) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="1"
                  placeholder="e.g., 399"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory (optional)
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g., Ruby Collection"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Sizes & Stock */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sizes & Initial Stock
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {selectedSizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Stock per Size
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedSizes.map((size) => (
                    <div key={size} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-12">
                        Size {size}:
                      </span>
                      <input
                        type="number"
                        value={initialStock[size] || 0}
                        onChange={(e) =>
                          setInitialStock({
                            ...initialStock,
                            [size]: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
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
                    <div className="mt-2 relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
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
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Another Image
            </button>
            <p className="text-sm text-gray-500">
              Enter the URL path for product images (e.g.,
              /assets/category/product/1.webp)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/admin/products"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
