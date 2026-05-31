import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CategoryDetails = () => {
  const { id }     = useParams()   // URL se category _id
  const navigate   = useNavigate()

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Category info fetch karo
        const catRes = await axios.get(`http://localhost:5000/api/category`)
        const allCats = catRes.data.data || []
        const cat = allCats.find(c => c._id === id)
        setCategory(cat || null)

        // 2. Sare active products fetch karo aur category se filter karo
        const prodRes = await axios.get(`http://localhost:5000/api/product/`)
        const allProds = prodRes.data.data || []
        const filtered = allProds.filter(p => {
          const catId = typeof p.category === 'object' ? p.category?._id : p.category
          return catId === id
        })
        setProducts(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const getDiscounted = (p) => {
    const price    = Number(p.actualPrice) || 0
    const discount = Number(p.discount)    || 0
    return Math.round(price - (price * discount / 100))
  }

  const getImage = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    const filename = img.replace(/\\/g, '/').split('/').pop()
    return `http://localhost:5000/api/product/${filename}`
  }

  const getCatImage = (pic) => {
    if (!pic) return null
    if (pic.startsWith('http')) return pic
    const filename = pic.replace(/\\/g, '/').split('/').pop()
    return `http://localhost:5000/api/category/${filename}`
  }

  return (
    <>
      <Navbar />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
          <p>Loading…</p>
        </div>
      ) : (
        <div className="products-page">

          {/* ── Category Hero ── */}
          <div className="products-hero" style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}>
            <div className="container">
              <div className="si-breadcrumb">
                <a href="/">Home</a><span>›</span>
                <a href="/products">Products</a><span>›</span>
                {category?.category || 'Category'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                {category?.picture && (
                  <img
                    src={getCatImage(category.picture)}
                    alt={category.category}
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 16, border: '3px solid var(--accent)' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                )}
                <div>
                  <h1 className="section-title" style={{ marginBottom: 4 }}>
                    {category?.category || 'Category'} <em>Products</em>
                  </h1>
                  {category?.description && (
                    <p className="section-desc" style={{ marginBottom: 0 }}>{category.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Products Grid ── */}
          <section className="si-section">
            <div className="container">

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>

              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                  <p style={{ color: 'var(--text-muted)' }}>No products in this category yet.</p>
                  <button className="btn-hero-primary" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
                    Browse All Products
                  </button>
                </div>
              ) : (
                <div className="row g-3 g-md-4">
                  {products.map((p, i) => {
                    const discountedPrice = getDiscounted(p)
                    const imgUrl          = getImage(p.images)
                    const hasDiscount     = Number(p.discount) > 0

                    return (
                      <div className="col-12 col-sm-6 col-lg-3" key={p._id}>
                        <div className="prod-card h-100">
                          <div className="prod-img-wrap">
                            {imgUrl ? (
                              <img src={imgUrl} alt={p.name} className="prod-img-inner"
                                onError={e => { e.currentTarget.style.display = 'none' }} />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>📦</div>
                            )}
                            {p.tag && <span className="prod-badge">{p.tag}</span>}
                            {hasDiscount && (
                              <span className="prod-badge" style={{ top: 'auto', bottom: 10, background: '#28a745' }}>
                                {p.discount}% OFF
                              </span>
                            )}
                            <div className="prod-actions">
                              <button className="btn-prod-action" onClick={() => navigate(`/product/${p._id}`)}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Quick View
                              </button>
                            </div>
                          </div>

                          <div className="prod-body">
                            <div className="prod-name">{p.name}</div>
                            {p.brandName && (
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 4 }}>{p.brandName}</div>
                            )}
                            <div className="prod-footer">
                              <div>
                                <span className="prod-price">₹{discountedPrice.toLocaleString('en-IN')}</span>
                                {hasDiscount && (
                                  <span className="prod-old">₹{Number(p.actualPrice).toLocaleString('en-IN')}</span>
                                )}
                              </div>
                              <button className="btn-add-cart" onClick={() => navigate(`/product/${p._id}`)}>
                                View
                              </button>
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
      )}

      <Footer />
    </>
  )
}

export default CategoryDetails