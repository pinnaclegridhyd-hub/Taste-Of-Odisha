'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Ticket,
  Percent,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Pencil,
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '', // will convert to number e.g. 20 -> 0.20
    expiresAt: '',
    isActive: true,
  });

  const getAdminKey = () => localStorage.getItem('adminKey') || '';

  const fetchCoupons = async () => {
    try {
      const key = getAdminKey();
      if (!key) {
        router.push('/admin/dashboard');
        return;
      }
      const res = await fetch('/api/admin/coupons', {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/dashboard');
          return;
        }
        throw new Error('Failed to fetch coupons');
      }
      const data = await res.json();
      setCoupons(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.code.trim()) {
      setError('Coupon code is required');
      return;
    }

    const pct = parseFloat(formData.discountPercentage);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      setError('Discount percentage must be a number between 1 and 100');
      return;
    }

    setSaving(true);
    try {
      const discountPercentage = pct / 100; // Convert 20% to 0.2
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminKey()}`,
        },
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          discountPercentage,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create coupon');
      }

      setSuccess(`Coupon ${data.data.code} created successfully!`);
      setFormData({
        code: '',
        discountPercentage: '',
        expiresAt: '',
        isActive: true,
      });
      setShowCreateForm(false);
      await fetchCoupons();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    setError('');
    setSuccess('');

    if (!formData.code.trim()) {
      setError('Coupon code is required');
      return;
    }

    const pct = parseFloat(formData.discountPercentage);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      setError('Discount percentage must be a number between 1 and 100');
      return;
    }

    setSaving(true);
    try {
      const discountPercentage = pct / 100;
      const res = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminKey()}`,
        },
        body: JSON.stringify({
          id: editingCoupon._id,
          code: formData.code.trim().toUpperCase(),
          discountPercentage,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update coupon');
      }

      setSuccess(`Coupon ${data.data.code} updated successfully!`);
      setFormData({
        code: '',
        discountPercentage: '',
        expiresAt: '',
        isActive: true,
      });
      setEditingCoupon(null);
      await fetchCoupons();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAdminKey()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete coupon');
      setSuccess(`Coupon ${code} deleted successfully.`);
      await fetchCoupons();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowCreateForm(false);
    setFormData({
      code: coupon.code,
      discountPercentage: (coupon.discountPercentage * 100).toFixed(0),
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      isActive: coupon.isActive,
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center pt-20">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* Header section */}
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-16 mb-12">
        <div className="container-sanctuary">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-6">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
                Coupon <br />
                <span className="italic font-normal text-primary">Manager.</span>
              </h1>
            </div>
            <button
              onClick={() => {
                if (editingCoupon) {
                  setEditingCoupon(null);
                  setFormData({ code: '', discountPercentage: '', expiresAt: '', isActive: true });
                } else {
                  setShowCreateForm(!showCreateForm);
                }
              }}
              className="btn-primary py-3.5 px-6 flex items-center gap-2"
            >
              {editingCoupon ? 'Cancel Edit' : showCreateForm ? 'View Coupons' : 'Create New Coupon'}
              {!showCreateForm && !editingCoupon && <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        {/* Success/Error Alerts */}
        {error && (
          <div className="bg-heritage-red/5 border border-heritage-red/10 text-heritage-red px-6 py-4 rounded-xl mb-8 flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl mb-8 flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Edit / Creation Form */}
        {showCreateForm || editingCoupon ? (
          <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 p-8 max-w-2xl mx-auto mb-12 animate-fade-up">
            <h2 className="text-xl font-serif font-bold text-heritage-dark italic mb-6">
              {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Coupon'}
            </h2>
            <form onSubmit={editingCoupon ? handleUpdate : handleCreate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-heritage-dark/60 mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 bg-heritage-bone/30 border border-heritage-dark/10 rounded-xl focus:outline-none focus:border-primary transition-all text-sm uppercase font-bold tracking-wider"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-heritage-dark/60 mb-2">
                  Discount Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    min="1"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-heritage-bone/30 border border-heritage-dark/10 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold"
                    required
                  />
                  <Percent className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-heritage-dark/40" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-heritage-dark/60 mb-2">
                  Expiry Date (Optional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-heritage-bone/30 border border-heritage-dark/10 rounded-xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                  <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-heritage-dark/40" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-heritage-dark/60"
                >
                  {formData.isActive ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-heritage-dark/20" />
                  )}
                  <span>Status: {formData.isActive ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-3 px-8 flex-1"
                >
                  {saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCoupon(null);
                    setShowCreateForm(false);
                    setFormData({ code: '', discountPercentage: '', expiresAt: '', isActive: true });
                  }}
                  className="px-6 py-3 border border-heritage-dark/10 rounded-xl hover:bg-heritage-bone/20 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Coupons List */
          <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 overflow-hidden">
            {coupons.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className="w-16 h-16 bg-heritage-bone rounded-full flex items-center justify-center mx-auto text-heritage-dark/30">
                  <Ticket className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif italic text-heritage-dark font-bold">No coupons found</h3>
                <p className="body-text text-sm opacity-60 max-w-sm mx-auto">
                  Create a new promotional coupon to offer discounts to customers at checkout.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-heritage-dark/5 bg-heritage-bone/20">
                      <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">Code</th>
                      <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">Discount</th>
                      <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">Status</th>
                      <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">Expiry</th>
                      <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">Created At</th>
                      <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => {
                      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                      return (
                        <tr key={coupon._id} className="border-b border-heritage-dark/5 hover:bg-heritage-bone/10 transition-colors">
                          <td className="p-6">
                            <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1.5 rounded-lg font-bold tracking-wider text-xs uppercase inline-flex items-center gap-1.5">
                              <Ticket className="w-3.5 h-3.5" />
                              {coupon.code}
                            </span>
                          </td>
                          <td className="p-6 font-serif italic text-heritage-dark font-bold text-lg">
                            {(coupon.discountPercentage * 100).toFixed(0)}% OFF
                          </td>
                          <td className="p-6">
                            {coupon.isActive && !isExpired ? (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                Active
                              </span>
                            ) : isExpired ? (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                Expired
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-heritage-red bg-heritage-red/5 px-2.5 py-1 rounded-full">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="p-6 text-sm text-heritage-dark/60">
                            {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }) : (
                              <span className="text-heritage-dark/30 italic">No expiry</span>
                            )}
                          </td>
                          <td className="p-6 text-sm text-heritage-dark/60">
                            {new Date(coupon.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => startEdit(coupon)}
                                className="text-heritage-dark/60 hover:text-primary hover:bg-heritage-bone/40 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                                title="Edit Coupon"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(coupon._id, coupon.code)}
                                className="text-heritage-red hover:bg-heritage-red/5 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                                title="Delete Coupon"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
