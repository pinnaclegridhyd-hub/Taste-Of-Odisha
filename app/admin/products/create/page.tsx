'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, Info, Tag, IndianRupee, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: data.data[0].slug }));
          }
        }
      } catch (err) {
        console.error('Failed to load lineages:', err);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    price: '',
    discount: {
      type: 'percentage',
      value: '',
      startDate: '',
      endDate: '',
    },
    images: '',
    inStock: true,
    stockQuantity: '',
    artisanName: '',
    description: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as any;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      discount: {
        ...prev.discount,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const key = localStorage.getItem('adminKey');
      if (!key) {
        router.push('/admin/dashboard');
        return;
      }

      const payload: any = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        inStock: formData.inStock,
        artisanName: formData.artisanName || undefined,
        description: formData.description,
        images: formData.images
          .split(',')
          .map((url) => url.trim())
          .filter((url) => url),
      };

      if (formData.discount.value) {
        payload.discount = {
          type: formData.discount.type,
          value: parseFloat(formData.discount.value),
          startDate: formData.discount.startDate
            ? new Date(formData.discount.startDate)
            : undefined,
          endDate: formData.discount.endDate
            ? new Date(formData.discount.endDate)
            : undefined,
        };
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create heritage piece');
        setLoading(false);
        return;
      }

      router.push('/admin/products');
    } catch (err) {
      setError('Connection error during manifest creation');
      setLoading(false);
    }
  };

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
                 Create <br /><span className="italic font-normal text-primary">Artifact.</span>
               </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 overflow-hidden animate-fade-up">
            <div className="bg-heritage-dark px-10 py-6 border-b border-white/5">
              <span className="label-text text-primary">Genesis Editor</span>
              <p className="body-text text-white/50 text-xs mt-1 italic">Initiate a new heritage entry into the sanctuary catalog.</p>
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
                      {categories.length === 0 && <option value="food">Artisan Food</option>}
                    </select>
                  </div>
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
              </div>

              {/* Section: Stock & Financials */}
              <div className="space-y-8">
                 <div className="flex items-center gap-3 label-text opacity-30">
                    <Tag className="w-3.5 h-3.5" /> Manifest Details
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2 md:col-span-1">
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
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Inventory Count</label>
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
                    <div className="flex items-end pb-4 md:col-span-1">
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
              </div>

              {/* Section: Discount */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 label-text opacity-30">
                   <ShieldCheck className="w-3.5 h-3.5" /> Discount Protocol
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-heritage-bone/30 p-8 rounded-xl border border-heritage-dark/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Type</label>
                    <select
                      name="type"
                      value={formData.discount.type}
                      onChange={handleDiscountChange}
                      className="w-full px-6 py-4 bg-white border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Magitude</label>
                    <input
                      type="number"
                      name="value"
                      value={formData.discount.value}
                      onChange={handleDiscountChange}
                      placeholder="Leave empty for no discount"
                      className="w-full px-6 py-4 bg-white border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Commencement</label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.discount.startDate}
                      onChange={handleDiscountChange}
                      className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Conclusion</label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.discount.endDate}
                      onChange={handleDiscountChange}
                      className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Media */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 label-text opacity-30">
                   <ImageIcon className="w-3.5 h-3.5" /> Heritage Visuals
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Visual Endpoints (Comma Separated)</label>
                  <textarea
                    name="images"
                    value={formData.images}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="https://example.com/art1.jpg, https://example.com/art2.jpg"
                    className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Lead Artisan Attribution</label>
                  <input
                    type="text"
                    name="artisanName"
                    value={formData.artisanName}
                    onChange={handleInputChange}
                    placeholder="e.g. Master Artisan Devi"
                    className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-heritage-dark/5">
                <Link
                  href="/admin/products"
                  className="flex-1 btn-outline py-5 rounded-xl text-center"
                >
                  Cancel Manifest
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] btn-primary py-5 rounded-xl flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {loading ? (
                    <LoadingSpinner className="w-5 h-5 border-white/30 border-t-white" />
                  ) : (
                    <>Establish Artifact <Plus className="w-4 h-4 transition-transform group-hover:scale-110" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
