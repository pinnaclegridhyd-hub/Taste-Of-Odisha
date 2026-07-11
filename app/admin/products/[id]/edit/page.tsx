'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, Info, Tag, IndianRupee, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getDisplayImageUrl } from '@/lib/image-url';
import { normalizeProductImageList, normalizeProductImagePath } from '@/lib/image-path';

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to load lineages:', err);
      }
    };
    fetchCategories();
  }, []);
  const [adminKey, setAdminKey] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'food',
    price: 0,
    weight: '',
    discount: {
      type: 'percentage',
      value: 0,
    },
    images: [] as string[],
    inStock: true,
    stockQuantity: 0,
    variants: [] as Array<{ name: string; price: number; stockQuantity: number; image?: string }>,
    artisanName: '',
    description: '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
    }
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminKey')}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        setFormData({
           ...data.data,
           images: normalizeProductImageList(data.data.images),
           weight: data.data.weight || '',
           variants: Array.isArray(data.data.variants)
             ? data.data.variants.map((variant: any) => ({
                 ...variant,
                 image: normalizeProductImagePath(variant.image),
               }))
             : [],
          discount: data.data.discount || { type: 'percentage', value: 0 },
        });
      } else {
        setError(data.error || 'Failed to fetch product');
      }
    } catch (err) {
      setError('Connection error while fetching product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('discount.')) {
      const subField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        discount: {
          ...prev.discount,
          [subField]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : (type === 'checkbox' ? (e.target as HTMLInputElement).checked : value)
      }));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, normalizeProductImagePath(newImageUrl)]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({ ...prev, variants: [...prev.variants, { name: '', price: 0, stockQuantity: 0, image: '' }] }));
  };

  const updateVariant = (index: number, field: 'name' | 'price' | 'stockQuantity' | 'image', value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => i === index ? { ...variant, [field]: field === 'price' || field === 'stockQuantity' ? Number(value) : value } : variant),
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({ id, ...formData })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adminKey', adminKey);
        router.push('/admin/products');
      } else {
        setError(data.error || 'Failed to update product');
      }
    } catch (err) {
      setError('Connection error during validation');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
           <span className="label-text opacity-40">Syncing Product</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* Header */}
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-16 mb-12">
        <div className="container-sanctuary">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6">
               <Link href="/admin/products" className="flex items-center gap-2 label-text text-primary hover:opacity-70 transition-opacity">
                  <ArrowLeft className="w-3 h-3" /> Catalog
               </Link>
               <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
                 Edit <br /><span className="italic font-normal text-primary">Product.</span>
               </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 overflow-hidden animate-fade-up">
            <div className="bg-heritage-dark px-10 py-6 border-b border-white/5">
              <span className="label-text text-primary">Product Editor</span>
              <p className="body-text text-white/50 text-xs mt-1 italic">Update product details for the catalog.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-16">
              {error && (
                <div className="bg-heritage-red/5 border border-heritage-red/10 text-heritage-red px-6 py-4 rounded-xl flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              {/* Section: Basic Info */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 label-text opacity-30">
                   <Info className="w-3.5 h-3.5" /> Basic Information
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Product Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                      {categories.length === 0 && (
                        <>
                          <option value="food">Odisha Food</option>
                          <option value="clothing">Traditional Clothing</option>
                          <option value="craft">Puri Specialties</option>
                          <option value="festive">Festive Collection</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">URL Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. puri-painting-large"
                    className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium leading-relaxed"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Maker / Prepared By</label>
                    <input
                      type="text"
                      name="artisanName"
                      value={formData.artisanName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      required
                      min="0"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Weight Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Weight (e.g. 200g, 500g)</label>
                  <input
                    type="text"
                    name="weight"
                    value={(formData as any).weight || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 200g"
                    className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Section: Pricing */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 label-text opacity-30">
                   <Tag className="w-3.5 h-3.5" /> Pricing
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-heritage-dark/20" />
                      <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-14 pr-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium font-serif italic"
                      />
                    </div>
                  </div>
                  <div className="flex items-end pb-4">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={formData.inStock}
                          onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="w-5 h-5 rounded border-heritage-dark/10 checked:bg-primary transition-all cursor-pointer"
                        />
                      </div>
                      <span className="text-sm font-bold text-heritage-dark/60 group-hover:text-primary transition-colors">Product In Stock</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-heritage-bone/30 p-8 rounded-xl border border-heritage-dark/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Discount Type</label>
                    <select
                      name="discount.type"
                      value={formData.discount.type}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Discount Value</label>
                    <input
                      type="number"
                      name="discount.value"
                      min="0"
                      value={formData.discount.value}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Images */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 label-text opacity-30">
                   <ImageIcon className="w-3.5 h-3.5" /> Product Images
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="/TASTE OF ODISHA/... or https://..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="btn-outline px-10 py-4 flex items-center gap-3"
                  >
                    <Plus className="w-4 h-4" /> Add to Gallery
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-heritage-dark/5 shadow-sm bg-heritage-bone">
                       <img src={getDisplayImageUrl(img)} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-3 right-3 bg-heritage-red text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 rounded-xl border border-heritage-dark/5 bg-heritage-bone/30 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-heritage-dark">Sizes / pack options</h3>
                    <p className="text-xs text-heritage-dark/50 mt-1">Each option has its own weight label, price, stock and optional image.</p>
                  </div>
                  <button type="button" onClick={addVariant} className="btn-outline px-5 py-3 flex items-center justify-center gap-2 text-xs"><Plus className="w-4 h-4" /> Add size</button>
                </div>
                {formData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_0.8fr_1.4fr_auto] gap-3 items-end rounded-lg bg-white p-4 border border-heritage-dark/5">
                    <label className="text-xs text-heritage-dark/60">Size / label<input required type="text" value={variant.name} onChange={(e) => updateVariant(index, 'name', e.target.value)} placeholder="500g" className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-heritage-dark/10" /></label>
                    <label className="text-xs text-heritage-dark/60">Price (₹)<input required min="0" type="number" value={variant.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-heritage-dark/10" /></label>
                    <label className="text-xs text-heritage-dark/60">Stock<input required min="0" type="number" value={variant.stockQuantity} onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-heritage-dark/10" /></label>
                    <label className="text-xs text-heritage-dark/60">Optional image URL or public path<input type="text" value={variant.image || ''} onChange={(e) => updateVariant(index, 'image', e.target.value)} placeholder="/TASTE OF ODISHA/... or https://..." className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-heritage-dark/10" /></label>
                    <button type="button" onClick={() => removeVariant(index)} className="mb-0.5 p-3 text-heritage-red hover:bg-heritage-red/5 rounded-lg" aria-label="Remove size"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {/* Section: Authorization */}
              <div className="space-y-8 pt-10 border-t border-heritage-dark/5">
                <div className="flex items-center gap-3 label-text text-heritage-red opacity-50">
                   <ShieldCheck className="w-3.5 h-3.5" /> High-Level Authorization
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-red/40 uppercase tracking-widest ml-1">Admin Key</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter secret custodian key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full px-6 py-4 bg-heritage-red/[0.02] border border-heritage-red/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-heritage-red/5 focus:border-heritage-red transition-all text-sm font-medium tracking-[0.3em]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-6 pt-10">
                <Link
                  href="/admin/products"
                  className="flex-1 btn-outline py-5 rounded-xl text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] btn-primary py-5 rounded-xl flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoadingSpinner className="w-5 h-5 border-white/30 border-t-white" />
                  ) : (
                    <>Save Changes <Save className="w-4 h-4 transition-transform group-hover:scale-110" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditProductPage;
