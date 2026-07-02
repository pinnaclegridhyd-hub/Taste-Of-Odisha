'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { SearchX, SlidersHorizontal, ChevronRight, Package, LayoutGrid } from 'lucide-react';
import SkeletonLoader from '@/components/SkeletonLoader';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
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
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = category ? `/api/products?category=${category}` : '/api/products';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchProducts();
  }, [category]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery) ||
        p.category?.toLowerCase().includes(searchQuery)
      );
    }

    if (priceRange !== 'all') {
      result = result.filter(p => {
        const price = p.price;
        switch (priceRange) {
          case '0-100': return price <= 100;
          case '100-200': return price > 100 && price <= 200;
          case '200-500': return price > 200 && price <= 500;
          case '500+': return price > 500;
          default: return true;
        }
      });
    }

    const sorted = [...result];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [products, searchQuery, sortBy, priceRange]);

  const activeCategoryName = category
    ? categories.find(c => c.slug === category)?.name || category
    : null;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF7F2', paddingBottom: '40px', paddingTop: '100px' }}>

      {/* ====== BREADCRUMBS ====== */}
      <div className="container-sanctuary">
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(45,27,27,0.5)', fontWeight: 500, padding: '8px 0', flexWrap: 'wrap' }}>
          <Link href="/" style={{ transition: 'color 0.2s' }} className="hover:text-primary">Home</Link>
          <ChevronRight style={{ width: '12px', height: '12px', color: 'rgba(45,27,27,0.2)' }} />
          <Link href="/products" style={{ transition: 'color 0.2s' }} className="hover:text-primary">Categories</Link>
          {activeCategoryName && (
            <>
              <ChevronRight style={{ width: '12px', height: '12px', color: 'rgba(45,27,27,0.2)' }} />
              <span style={{ color: 'rgba(45,27,27,0.8)', fontWeight: 600, textTransform: 'capitalize' }}>{activeCategoryName}</span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight style={{ width: '12px', height: '12px', color: 'rgba(45,27,27,0.2)' }} />
              <span style={{ color: 'rgba(45,27,27,0.8)', fontWeight: 600 }}>Search: &quot;{searchParams.get('search')}&quot;</span>
            </>
          )}
        </nav>
      </div>

      {/* ====== MAIN LAYOUT: SIDEBAR + GRID ====== */}
      <div style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '0' }}>

        {/* ===== LEFT SIDEBAR (Always visible — narrow on mobile, wide on desktop) ===== */}
        <aside
          className="no-scrollbar"
          style={{
            flexShrink: 0,
            position: 'sticky',
            top: '80px',
            alignSelf: 'flex-start',
            backgroundColor: '#fff',
            borderRight: '1px solid rgba(45,27,27,0.08)',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 80px)',
          }}
        >
          {/* All Categories — top item */}
          <Link
            href="/products"
            className="sidebar-cat-link"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '12px 8px',
              textDecoration: 'none',
              transition: 'all 0.15s',
              borderLeft: !category ? '3px solid #8B1D1D' : '3px solid transparent',
              backgroundColor: !category ? 'rgba(139,29,29,0.05)' : 'transparent',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: !category ? 'rgba(139,29,29,0.1)' : '#F5F0E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <LayoutGrid style={{ width: '16px', height: '16px', color: '#8B1D1D' }} />
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: !category ? 700 : 500,
              color: !category ? '#8B1D1D' : 'rgba(45,27,27,0.6)',
              textAlign: 'center',
              lineHeight: '1.2',
              maxWidth: '60px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>All</span>
          </Link>

          {/* Category Items */}
          {categories.map(cat => {
            const isActive = category === cat.slug;
            return (
              <Link
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                className="sidebar-cat-link"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '12px 8px',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '3px solid #8B1D1D' : '3px solid transparent',
                  backgroundColor: isActive ? 'rgba(139,29,29,0.05)' : 'transparent',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#F5F0E8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: isActive ? '2px solid #8B1D1D' : '2px solid transparent',
                  }}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={36}
                      height={36}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Package style={{ width: '16px', height: '16px', color: 'rgba(45,27,27,0.35)' }} />
                  )}
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#8B1D1D' : 'rgba(45,27,27,0.6)',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  maxWidth: '60px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  textTransform: 'capitalize',
                }}>{cat.name}</span>
              </Link>
            );
          })}
        </aside>

        {/* ===== MAIN CONTENT AREA ===== */}
        <div style={{ flex: 1, minWidth: 0, padding: '0 12px' }}>

          {/* Page Title + Product Count */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
            <h1 className="products-page-title" style={{ fontSize: '22px', fontWeight: 700, color: '#2D1B1B', textTransform: 'capitalize', fontFamily: '"Playfair Display", serif', margin: 0 }}>
              {searchQuery
                ? `Results for "${searchParams.get('search')}"`
                : activeCategoryName || 'All Products'}
            </h1>
            {!loading && (
              <span style={{ fontSize: '12px', color: 'rgba(45,27,27,0.4)', fontWeight: 500 }}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* ====== FILTER BAR ====== */}
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0',
              borderBottom: '1px solid rgba(45,27,27,0.06)',
              marginBottom: '16px',
              overflowX: 'auto',
            }}
          >
            <SlidersHorizontal style={{ width: '16px', height: '16px', color: 'rgba(45,27,27,0.3)', flexShrink: 0 }} />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="products-filter-select"
            >
              <option value="newest">Sort By ▾</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="name">Alphabetical</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="products-filter-select"
            >
              <option value="all">Price ▾</option>
              <option value="0-100">Under ₹100</option>
              <option value="100-200">₹100 - ₹200</option>
              <option value="200-500">₹200 - ₹500</option>
              <option value="500+">Above ₹500</option>
            </select>

            <select className="products-filter-select">
              <option value="all">Size ▾</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* ====== PRODUCT GRID ====== */}
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
              <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SearchX style={{ width: '28px', height: '28px', color: 'rgba(45,27,27,0.2)' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2D1B1B', margin: 0 }}>No products found</h3>
                <p style={{ fontSize: '14px', color: 'rgba(45,27,27,0.5)', margin: 0 }}>
                  We couldn&apos;t find any products matching your selection. Try adjusting filters or browse all categories.
                </p>
                <Link
                  href="/products"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    border: '1px solid rgba(139,29,29,0.2)',
                    color: '#8B1D1D',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  className="hover:bg-primary/5"
                >
                  View All Products
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-sanctuary" style={{ padding: '120px 0', display: 'flex', justifyContent: 'center', color: '#8B1D1D' }}>Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
