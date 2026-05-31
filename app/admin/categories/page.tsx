'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Trash2, Edit2, Save, X, 
  Image as ImageIcon, GripVertical, AlertCircle, 
  CheckCircle2, Loader2, Search
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
}

export default function CategoryManagementPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      setError('Failed to fetch heritage archives');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-slug generation if name is changing and slug wasn't manually edited
      if (name === 'name' && (!editingId || prev.slug === '')) {
        newData.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return newData;
    });
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image: '', order: 0 });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      order: category.order,
    });
    setEditingId(category._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const key = localStorage.getItem('adminKey');
      if (!key) {
        router.push('/admin/dashboard');
        return;
      }

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Operation failed');
        return;
      }

      setSuccess(editingId ? 'Archived update successful' : 'New lineage established');
      fetchCategories();
      resetForm();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Connection disrupted during archival');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you certain this category should be expunged from the records?')) return;

    setActionLoading(true);
    setError('');

    try {
      const key = localStorage.getItem('adminKey');
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Expulsion failed');
        return;
      }

      setSuccess('Lineage expunged successfully');
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Connection disrupted');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* Header */}
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-16 mb-12">
        <div className="container-sanctuary">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6">
               <Link href="/admin/dashboard" className="flex items-center gap-2 label-text text-primary hover:opacity-70 transition-opacity">
                  <ArrowLeft className="w-3 h-3" /> Dashboard
               </Link>
               <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
                 Category <br /><span className="italic font-normal text-primary">Archives.</span>
               </h1>
            </div>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="btn-primary py-4 px-8 rounded-xl flex items-center gap-3 group"
              >
                Establish New Lineage <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        <div className="max-w-6xl mx-auto">
          {/* Notifications */}
          {error && (
            <div className="mb-8 bg-heritage-red/5 border border-heritage-red/10 text-heritage-red px-6 py-4 rounded-xl flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest animate-fade-in">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-8 bg-primary/5 border border-primary/10 text-primary px-6 py-4 rounded-xl flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Section */}
            {showForm && (
              <div className="lg:col-span-12 mb-12 animate-fade-up">
                <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 overflow-hidden">
                  <div className="bg-heritage-dark px-8 py-4 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <span className="label-text text-primary">{editingId ? 'Lineage Editor' : 'Lineage Genesis'}</span>
                      <p className="body-text text-white/50 text-[10px] italic">Defining a new category of heritage artifacts.</p>
                    </div>
                    <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Category Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                          placeholder="e.g. Puri Crafts"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Archive identifier (Slug)</label>
                        <input
                          type="text"
                          name="slug"
                          required
                          value={formData.slug}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium font-mono"
                          placeholder="puri-crafts"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Priority Order</label>
                        <input
                          type="number"
                          name="order"
                          value={formData.order}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Narrative Description</label>
                        <textarea
                          name="description"
                          rows={2}
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium leading-relaxed"
                          placeholder="Briefly describe the significance of this collection..."
                        />
                      </div>
                      <div className="md:col-span-1 space-y-2">
                        <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">Visual Endpoint (URL)</label>
                        <input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-heritage-dark/5">
                      <button 
                        type="button" 
                        onClick={resetForm}
                        className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40 hover:text-heritage-dark transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={actionLoading}
                        className="btn-primary py-4 px-12 rounded-xl flex items-center gap-3 disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? 'Seal Archive' : 'Establish Lineage')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* List Section */}
            <div className="lg:col-span-12">
              <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 overflow-hidden">
                <div className="bg-heritage-bone/50 px-8 py-5 border-b border-heritage-dark/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">
                  <div className="flex gap-16">
                    <span className="w-12">Order</span>
                    <span className="w-64">Category Information</span>
                  </div>
                  <span>Actions</span>
                </div>

                {loading ? (
                  <div className="py-20 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                     <Search className="w-10 h-10 text-heritage-dark/10 mx-auto" />
                     <p className="body-text text-sm">No lineages recorded in the sanctuary.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-heritage-dark/5">
                    {categories.map((cat) => (
                      <div key={cat._id} className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-secondary/20 transition-colors group">
                        <div className="flex items-center gap-10">
                          <div className="w-12 h-12 rounded-lg bg-heritage-bone border border-heritage-dark/5 flex items-center justify-center font-serif italic text-primary font-bold">
                            {cat.order}
                          </div>
                          <div className="flex items-center gap-6">
                            {cat.image ? (
                              <img src={cat.image} className="w-16 h-16 rounded-xl object-cover border border-heritage-dark/5 shadow-sm" alt={cat.name} />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-heritage-bone flex items-center justify-center text-heritage-dark/10 border border-dashed border-heritage-dark/10">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                            <div className="space-y-1">
                              <h3 className="font-bold text-heritage-dark group-hover:text-primary transition-colors">{cat.name}</h3>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-heritage-dark/40 bg-heritage-bone px-2 py-0.5 rounded uppercase">{cat.slug}</span>
                                {cat.description && (
                                  <span className="text-[10px] text-heritage-dark/30 italic truncate max-w-[200px]">{cat.description}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <button 
                            onClick={() => handleEdit(cat)}
                            className="p-3 rounded-lg hover:bg-white hover:shadow-md border border-transparent hover:border-heritage-dark/5 text-heritage-dark/40 hover:text-primary transition-all"
                            title="Edit Archive"
                           >
                             <Edit2 className="w-4 h-4" />
                           </button>
                           <button 
                            onClick={() => handleDelete(cat._id)}
                            className="p-3 rounded-lg hover:bg-white hover:shadow-md border border-transparent hover:border-heritage-red/20 text-heritage-dark/40 hover:text-heritage-red transition-all"
                            title="Expunge Lineage"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
