'use client';

import { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  GripVertical,
  X,
  Save,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<Category | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formActive, setFormActive] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const openAddModal = () => {
    setFormName('');
    setFormSlug('');
    setFormActive(true);
    setAddModal(true);
  };

  const openEditModal = (category: Category) => {
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormActive(category.is_active);
    setEditModal(category);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const id = generateSlug(formName);
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: formName,
          slug: formSlug || id,
          is_active: formActive,
          sort_order: categories.length,
        }),
      });

      if (res.ok) {
        setAddModal(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/categories/${editModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          slug: formSlug,
          is_active: formActive,
        }),
      });

      if (res.ok) {
        setEditModal(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to update category:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategoryStatus = async (category: Category) => {
    try {
      await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !category.is_active }),
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to toggle category status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-ochre"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-charcoal/50">
            {categories.length} categories total
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 transition"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-charcoal/50">
            <FolderTree className="w-12 h-12 mx-auto mb-4 text-charcoal/20" />
            <p>No categories found</p>
          </div>
        ) : (
          <div className="divide-y">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`p-4 flex items-center gap-4 hover:bg-deep-ochre/5 ${
                  !category.is_active ? 'opacity-60' : ''
                }`}
              >
                <div className="text-charcoal/20 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal">{category.name}</p>
                  <p className="text-sm text-charcoal/50">/{category.slug}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-charcoal/10 text-charcoal'
                  }`}
                >
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-charcoal/50 hover:text-deep-ochre hover:bg-deep-ochre/5 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleCategoryStatus(category)}
                    className={`p-2 rounded-lg transition ${
                      category.is_active
                        ? 'text-charcoal/50 hover:text-red-600 hover:bg-red-50'
                        : 'text-charcoal/50 hover:text-green-600 hover:bg-green-50'
                    }`}
                    title={category.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {category.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(addModal || editModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              setAddModal(false);
              setEditModal(null);
            }}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-charcoal">
                  {editModal ? 'Edit Category' : 'Add Category'}
                </h3>
                <button
                  onClick={() => {
                    setAddModal(false);
                    setEditModal(null);
                  }}
                  className="p-2 hover:bg-charcoal/5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={editModal ? handleUpdate : handleAdd}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editModal) {
                        setFormSlug(generateSlug(e.target.value));
                      }
                    }}
                    required
                    placeholder="e.g., AD Stone Bangles"
                    className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g., ad-stone-bangles"
                    className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="w-4 h-4 text-deep-ochre rounded focus:ring-deep-ochre"
                  />
                  <span className="text-sm text-charcoal/70">Active</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAddModal(false);
                      setEditModal(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-charcoal/15 rounded-lg hover:bg-deep-ochre/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formName}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
