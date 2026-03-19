import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const stars = (n) => '★'.repeat(Math.floor(n)) + '☆'.repeat(5 - Math.ceil(n))

const Products = () => {
  const navigate = useNavigate()

  const [products,     setProducts]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [query,        setQuery]        = useState('')
  const [sortBy,       setSortBy]       = useState('default')
  const [cats,         setCats]         = useState(['All'])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/product/')
        const data = res.data.data || []
        setProducts(data)
        const uniqueCats = ['All', ...new Set(data.map(p => p.category?.category || p.category).filter(Boolean))]
        setCats(uniqueCats)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const observerRef = useRef(null)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [products, activeFilter, query])

  let filtered = products.filter(p => {
    const catName    = p.category?.category || p.category || ''
    const matchCat   = activeFilter === 'All' || catName === activeFilter
    const matchQuery = p.name?.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  })

  if (sortBy === 'price-asc')  filtered = [...filtered].sort((a, b) => Number(a.actualPrice) - Number(b.actualPrice))
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => Number(b.actualPrice) - Number(a.actualPrice))

  const getDiscounted = (p) => {
    const price    = Number(p.actualPrice) || 0
    const discount = Number(p.discount)    || 0
    return Math.round(price - (price * discount / 100))
  }

  const getImage = (p) => {
    if (!p.images) return null
    if (p.images.startsWith('http')) return p.images
    const filename = p.images.replace(/\\/g, '/').split('/').pop()
    return `http://localhost:5000/api/product/${filename}`
  }

  return (
    <>
      <Navbar />
      <div className="products-page">
        <div className="products-hero">
          <div className="container">
            <div className="si-breadcrumb">
              <a href="/">Home</a><span>›</span>Products
            </div>
            <h1 className="section-title">All <em>Products</em></h1>
            <div className="section-divider" />
            <p className="section-desc">Browse {products.length} electronics components, boards, and accessories.</p>
          </div>
        </div>

        <section className="si-section">
          <div className="container">

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div className="search-bar-wrap">
                <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search products…" value={query} onChange={e => setQuery(e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sort:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: 'pointer', outline: 'none',
                }}>
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="filter-bar mb-4">
              {cats.map(cat => (
                <button key={cat} className={`filter-btn${activeFilter === cat ? ' active' : ''}`}
                  onClick={() => setActiveFilter(cat)}>{cat}</button>
              ))}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
                <p>Loading products…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ color: 'var(--text-muted)' }}>No products match your search.</p>
              </div>
            ) : (
              <div className="row g-3 g-md-4">
                {filtered.map((p, i) => {
                  const discountedPrice = getDiscounted(p)
                  const imgUrl          = getImage(p)
                  const hasDiscount     = Number(p.discount) > 0
                  const catName         = p.category?.category || p.category || ''
                  return (
                    <div className={`col-12 col-sm-6 col-lg-3 fade-up delay-${(i % 4) + 1}`} key={p._id}>
                      <div className="prod-card h-100">
                        <div className="prod-img-wrap">
                          {imgUrl ? (
                            <img src={imgUrl} alt={p.name} className="prod-img-inner"
                              onError={e => { e.currentTarget.style.display = 'none' }} />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>📦</div>
                          )}
                          {p.tag && <span className="prod-badge">{p.tag}</span>}
                          {hasDiscount && <span className="prod-badge" style={{ top: 'auto', bottom: 10, background: '#28a745' }}>{p.discount}% OFF</span>}
                          <div className="prod-actions">
                            <button className="btn-prod-action" onClick={() => navigate(`/product/${p._id}`)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              Quick View
                            </button>
                          </div>
                        </div>
                        <div className="prod-body">
                          <div className="prod-cat">{catName}</div>
                          <div className="prod-name">{p.name}</div>
                          {p.brandName && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 4 }}>{p.brandName}</div>}
                          <div className="prod-footer">
                            <div>
                              <span className="prod-price">₹{discountedPrice.toLocaleString('en-IN')}</span>
                              {hasDiscount && <span className="prod-old">₹{Number(p.actualPrice).toLocaleString('en-IN')}</span>}
                            </div>
                            <button className="btn-add-cart" onClick={() => navigate(`/product/${p._id}`)}>View</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Products