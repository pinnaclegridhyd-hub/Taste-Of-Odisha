'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Info,
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getDisplayImageUrl } from '@/lib/image-url';

interface Banner {
  _id: string;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export default function AdminBannersPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: '',
    linkUrl: '',
    title: '',
    subtitle: '',
    ctaText: '',
    displayOrder: '0',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const getAdminKey = () => localStorage.getItem('adminKey') || '';

  const fetchBanners = async () => {
    try {
      const key = getAdminKey();
      if (!key) {
        router.push('/admin/dashboard');
        return;
      }
      const res = await fetch('/api/admin/banners', {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/dashboard');
          return;
        }
        throw new Error('Failed to fetch banners');
      }
      const data = await res.json();
      setBanners(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminKey()}`,
        },
        body: JSON.stringify({
          ...formData,
          displayOrder: Number(formData.displayOrder || 0),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create banner');
      }
      setFormData({
        imageUrl: '',
        linkUrl: '',
        title: '',
        subtitle: '',
        ctaText: '',
        displayOrder: '0',
        isActive: true,
        startDate: '',
        endDate: '',
      });
      setShowCreateForm(false);
      await fetchBanners();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminKey()}`,
        },
        body: JSON.stringify({
          id: banner._id,
          isActive: !banner.isActive,
        }),
      });
      if (!res.ok) throw new Error('Failed to toggle status');
      await fetchBanners();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAdminKey()}` },
      });
      if (!res.ok) throw new Error('Failed to delete banner');
      await fetchBanners();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMoveOrder = async (bannerId: string, direction: 'up' | 'down') => {
    const sorted = [...banners].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex(b => b._id === bannerId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const reorder = sorted.map((b, i) => {
      if (i === idx) return { id: b._id, displayOrder: swapIdx };
      if (i === swapIdx) return { id: b._id, displayOrder: idx };
      return { id: b._id, displayOrder: i };
    });

    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminKey()}`,
        },
        body: JSON.stringify({ reorder }),
      });
      if (!res.ok) throw new Error('Failed to reorder');
      await fetchBanners();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEditing = (banner: Banner) => {
    setEditingId(banner._id);
    setEditData({
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      ctaText: banner.ctaText || '',
      displayOrder: String(banner.displayOrder),
      isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
    });
  };

  const handleUpdate = async () => {
    if (!editingId || !editData) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminKey()}`,
        },
        body: JSON.stringify({
          id: editingId,
          ...editData,
          displayOrder: Number(editData.displayOrder || 0),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update banner');
      }
      setEditingId(null);
      setEditData(null);
      await fetchBanners();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <span className="label-text opacity-40">Loading Banners</span>
        </div>
      </main>
    );
  }

  const inputCls =
    'w-full px-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium';

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* Header */}
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-16 mb-12">
        <div className="container-sanctuary">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 label-text text-primary hover:opacity-70 transition-opacity"
              >
                <ArrowLeft className="w-3 h-3" /> Dashboard
              </Link>
              <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
                Banner <br />
                <span className="italic font-normal text-primary">Slider.</span>
              </h1>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-primary flex items-center gap-3"
            >
              {showCreateForm ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add Banner
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        {error && (
          <div className="bg-heritage-red/5 border border-heritage-red/10 text-heritage-red px-6 py-4 rounded-xl mb-8 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <AlertCircle className="w-4 h-4" /> {error}
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Recommendation Note */}
        <div className="bg-primary/5 border border-primary/10 text-primary px-6 py-4 rounded-xl mb-8 flex items-start gap-4 text-[11px] font-semibold">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="mb-1 font-bold uppercase tracking-widest text-[10px]">Banner Image Guidelines</p>
            <p className="font-normal text-heritage-dark/70">
              Recommended size: <strong>1920x600px (landscape)</strong>. Avoid portrait or square images — they will be cropped. Use high-quality
              JPG or WebP images. Paste the full image URL path (same format as product images).
            </p>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 overflow-hidden mb-12 animate-fade-in">
            <div className="bg-heritage-dark px-8 py-5 border-b border-white/5">
              <span className="label-text text-primary">New Banner</span>
              <p className="body-text text-white/50 text-xs mt-1 italic">
                Add a new promotional banner to the homepage carousel.
              </p>
            </div>

            <form onSubmit={handleCreate} className="p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/path/to/banner-image.jpg or https://..."
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    Link URL (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="/products or /products?category=sweets"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    Title / Alt Text (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Summer Sale Banner"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    Subtitle / Description (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Explore traditional snacks and premium pickle varieties"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    CTA Button Text (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Shop Now"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-heritage-dark/10 checked:bg-primary transition-all cursor-pointer"
                    />
                    <span className="text-sm font-bold text-heritage-dark/60 group-hover:text-primary transition-colors">
                      Active on Homepage
                    </span>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    Start Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    End Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                    Preview
                  </span>
                  <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-heritage-bone border border-heritage-dark/5">
                    <Image
                      src={getDisplayImageUrl(formData.imageUrl)}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-6 pt-4 border-t border-heritage-dark/5">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 btn-outline py-4 rounded-xl text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] btn-primary py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {saving ? (
                    <LoadingSpinner className="w-5 h-5 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Create Banner
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banners List */}
        {banners.length === 0 ? (
          <div className="text-center py-24 space-y-6">
            <div className="w-20 h-20 bg-heritage-bone rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="w-10 h-10 text-heritage-dark/20" />
            </div>
            <h3 className="text-xl font-serif font-bold text-heritage-dark italic">No Banners Yet</h3>
            <p className="body-text text-sm max-w-md mx-auto">
              Add your first promotional banner to create a stunning homepage carousel for your customers.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Your First Banner
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="label-text opacity-40">
                {banners.length} Banner{banners.length !== 1 ? 's' : ''} — {banners.filter(b => b.isActive).length} Active
              </span>
            </div>

            {banners
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((banner, idx) => (
                <div
                  key={banner._id}
                  className={`bg-white rounded-xl border overflow-hidden transition-all shadow-sm ${
                    banner.isActive
                      ? 'border-heritage-dark/5 hover:shadow-md'
                      : 'border-heritage-dark/5 opacity-60'
                  }`}
                >
                  {editingId === banner._id ? (
                    /* Edit Mode */
                    <div className="p-8 space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="label-text text-primary">Editing Banner</span>
                        <button
                          onClick={() => { setEditingId(null); setEditData(null); }}
                          className="text-heritage-dark/40 hover:text-heritage-red transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={editData.imageUrl}
                            onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                            Link URL
                          </label>
                          <input
                            type="text"
                            value={editData.linkUrl}
                            onChange={(e) => setEditData({ ...editData, linkUrl: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                            Title / Alt Text
                          </label>
                          <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                            Subtitle / Description
                          </label>
                          <input
                            type="text"
                            value={editData.subtitle}
                            onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={editData.ctaText}
                            onChange={(e) => setEditData({ ...editData, ctaText: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={editData.displayOrder}
                            onChange={(e) => setEditData({ ...editData, displayOrder: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                            Start Date
                          </label>
                          <input
                            type="datetime-local"
                            value={editData.startDate}
                            onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest ml-1">
                            End Date
                          </label>
                          <input
                            type="datetime-local"
                            value={editData.endDate}
                            onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Edit Preview */}
                      {editData.imageUrl && (
                        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-heritage-bone border border-heritage-dark/5">
                          <Image
                            src={getDisplayImageUrl(editData.imageUrl)}
                            alt="Banner Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex gap-4 pt-4 border-t border-heritage-dark/5">
                        <button
                          onClick={() => { setEditingId(null); setEditData(null); }}
                          className="flex-1 btn-outline py-3 rounded-xl text-center text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdate}
                          disabled={saving}
                          className="flex-[2] btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                        >
                          {saving ? (
                            <LoadingSpinner className="w-4 h-4 border-white/30 border-t-white" />
                          ) : (
                            <>
                              <Save className="w-4 h-4" /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {/* Image Thumbnail */}
                      <div className="lg:col-span-4 relative aspect-[21/9] lg:aspect-auto bg-heritage-bone overflow-hidden">
                        <Image
                          src={getDisplayImageUrl(banner.imageUrl)}
                          alt={banner.title || 'Banner'}
                          fill
                          className="object-cover"
                        />
                        {!banner.isActive && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="px-4 py-2 bg-heritage-dark/80 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">
                              Inactive
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1 min-w-0">
                              <h3 className="text-lg font-serif font-bold text-heritage-dark italic truncate">
                                {banner.title || 'Untitled Banner'}
                              </h3>
                              {banner.subtitle && (
                                <p className="text-xs text-heritage-dark/60 font-sans line-clamp-1">
                                  {banner.subtitle}
                                </p>
                              )}
                              {banner.ctaText && (
                                <p className="text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest">
                                  CTA: {banner.ctaText}
                                </p>
                              )}
                              {banner.linkUrl && (
                                <p className="text-[11px] font-medium text-primary flex items-center gap-1.5 truncate">
                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  {banner.linkUrl}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border flex-shrink-0 ${
                                banner.isActive
                                  ? 'bg-green-50 text-green-700 border-green-100'
                                  : 'bg-heritage-dark/5 text-heritage-dark/40 border-heritage-dark/10'
                              }`}
                            >
                              {banner.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-heritage-dark/40 uppercase tracking-widest">
                            <span>Order: #{banner.displayOrder}</span>
                            <span>Added: {new Date(banner.createdAt).toLocaleDateString()}</span>
                            {banner.startDate && (
                              <span>From: {new Date(banner.startDate).toLocaleDateString()}</span>
                            )}
                            {banner.endDate && (
                              <span>Until: {new Date(banner.endDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-heritage-dark/5">
                          <button
                            onClick={() => startEditing(banner)}
                            className="px-4 py-2 bg-heritage-bone text-heritage-dark rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(banner)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                              banner.isActive
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {banner.isActive ? (
                              <>
                                <EyeOff className="w-3 h-3" /> Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" /> Activate
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleMoveOrder(banner._id, 'up')}
                            disabled={idx === 0}
                            className="px-3 py-2 bg-heritage-bone text-heritage-dark rounded-lg hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(banner._id, 'down')}
                            disabled={idx === banners.length - 1}
                            className="px-3 py-2 bg-heritage-bone text-heritage-dark rounded-lg hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="ml-auto px-4 py-2 bg-heritage-red/5 text-heritage-red rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-heritage-red/10 transition-all flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
