'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, Info, Tag, IndianRupee, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    discount: {
      type: 'percentage',
      value: 0,
    },
    images: [] as string[],
    inStock: true,
    stockQuantity: 0,
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
          discount: data.data.discount || { type: 'percentage', value: 0 },
        });
      } else {
        setError(data.error || 'Failed to fetch artifact');
      }
    } catch (err) {
      setError('Connection error while fetching artifact');
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
        images: [...prev.images, newImageUrl.trim()]
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
        setError(data.error || 'Failed to update artifact');
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
           <span className="label-text opacity-40">Syncing Artifact</span>
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
                 Edit <br /><span className="italic font-normal text-primary">Artifact.</span>
               </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 overflow-hidden animate-fade-up">
            <div className="bg-heritage-dark px-10 py-6 border-b border-white/5">
              <span className="label-text text-primary">Manifest Editor</span>
              <p className="body-text text-white/50 text-xs mt-1 italic">Update heritage piece details for the sanctuary.</p>
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
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Artifact Name</label>
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
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Archive Category</label>
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
                          <option value="food">Artisan Food</option>
                          <option value="clothing">Heritage Clothing</option>
                          <option value="craft">Puri Crafts</option>
                          <option value="festive">Festival Sanctuary</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Archive URL Slug</label>
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
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Narrative Description</label>
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
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Lead Artisan</label>
                    <input
                      type="text"
                      name="artisanName"
                      value={formData.artisanName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Artifact Inventory</label>
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
              </div>

              {/* Section: Pricing */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 label-text opacity-30">
                   <Tag className="w-3.5 h-3.5" /> Pricing Manifest
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Base Valuation (₹)</label>
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
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Handshake Discount</label>
                    <select
                      name="discount.type"
                      value={formData.discount.type}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium cursor-pointer"
                    >
                      <option value="percentage">Percentage Archive (%)</option>
                      <option value="fixed">Fixed Valuation (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Discount Magnitude</label>
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
                   <ImageIcon className="w-3.5 h-3.5" /> Artifact Visuals
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="External Image URL (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="btn-outline px-10 py-4 flex items-center gap-3"
                  >
                    <Plus className="w-4 h-4" /> Add to Archive
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-heritage-dark/5 shadow-sm bg-heritage-bone">
                      <img src={img} alt={`Artifact ${idx}`} className="w-full h-full object-cover" />
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

              {/* Section: Authorization */}
              <div className="space-y-8 pt-10 border-t border-heritage-dark/5">
                <div className="flex items-center gap-3 label-text text-heritage-red opacity-50">
                   <ShieldCheck className="w-3.5 h-3.5" /> High-Level Authorization
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-red/40 uppercase tracking-widest ml-1">Sanctuary Key</label>
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
                  Cancel Manifest
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] btn-primary py-5 rounded-xl flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoadingSpinner className="w-5 h-5 border-white/30 border-t-white" />
                  ) : (
                    <>Update Manifest <Save className="w-4 h-4 transition-transform group-hover:scale-110" /></>
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
