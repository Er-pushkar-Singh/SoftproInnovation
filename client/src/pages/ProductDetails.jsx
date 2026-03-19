import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ProductDetails = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const userId   = localStorage.getItem('id')

  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [cartMsg,   setCartMsg]   = useState('')
  const [adding,    setAdding]    = useState(false)
  const [imgError,  setImgError]  = useState(false)

  /* ── Fetch product ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/details/${id}`)
        setData(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  /* ── Image URL ── */
  const getImage = (img) => {
    if (!img) return null
    if (img.startsWith('http')) return img
    const filename = img.replace(/\\/g, '/').split('/').pop()
    return `http://localhost:5000/api/product/${filename}`
  }

  /* ── Discounted price ── */
  const getDiscounted = () => {
    const price    = Number(data?.actualPrice) || 0
    const discount = Number(data?.discount)    || 0
    return Math.round(price - (price * discount / 100))
  }

  /* ── Add to Cart ── */
  const handleCart = async () => {
    if (!userId) {
      navigate('/login')
      return
    }
    setAdding(true)
    setCartMsg('')
    try {
      const res = await axios.post('http://localhost:5000/api/cart', {
        userId,
        productId: id,
      })
      setCartMsg(res.data.msg || 'Added to cart!')
    } catch (err) {
      setCartMsg('Something went wrong. Try again.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '8rem 0', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <p>Loading product…</p>
      </div>
    </>
  )

  if (!data) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '8rem 0', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>😕</div>
        <p>Product not found.</p>
        <button className="btn-hero-primary" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
          Browse Products
        </button>
      </div>
    </>
  )

  const imgUrl        = getImage(data.images)
  const discounted    = getDiscounted()
  const hasDiscount   = Number(data.discount) > 0
  const savings       = Number(data.actualPrice) - discounted
  const catName       = typeof data.category === 'object' ? data.category?.category : data.category

  return (
    <>
      <Navbar />

      <div style={{ marginTop: 66, padding: '3rem 0 5rem', background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="container">

          {/* Breadcrumb */}
          <div className="si-breadcrumb" style={{ marginBottom: '2rem' }}>
            <a href="/">Home</a><span>›</span>
            <a href="/products">Products</a><span>›</span>
            {catName && <><a href="#" onClick={e => e.preventDefault()}>{catName}</a><span>›</span></>}
            <span style={{ color: 'var(--text-primary)' }}>{data.name}</span>
          </div>

          <div className="row g-5">

            {/* ── LEFT: Image ── */}
            <div className="col-lg-5">
              <div style={{
                background:    'var(--bg-card)',
                border:        '1.5px solid var(--border)',
                borderRadius:  24,
                overflow:      'hidden',
                position:      'sticky',
                top:           90,
              }}>
                {/* Main image */}
                <div style={{
                  height:     380,
                  background: 'var(--section-alt)',
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position:   'relative',
                  overflow:   'hidden',
                }}>
                  {imgUrl && !imgError ? (
                    <img
                      src={imgUrl}
                      alt={data.name}
                      onError={() => setImgError(true)}
                      style={{
                        maxHeight:  340,
                        maxWidth:   '90%',
                        objectFit:  'contain',
                        transition: 'transform 0.4s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ fontSize: '5rem', opacity: 0.3 }}>📦</div>
                  )}

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {data.tag && (
                      <span style={{
                        background: 'var(--accent)', color: '#fff',
                        fontSize: '0.7rem', fontWeight: 700,
                        letterSpacing: '.06em', textTransform: 'uppercase',
                        padding: '4px 12px', borderRadius: 20,
                      }}>{data.tag}</span>
                    )}
                    {hasDiscount && (
                      <span style={{
                        background: '#28a745', color: '#fff',
                        fontSize: '0.7rem', fontWeight: 700,
                        padding: '4px 12px', borderRadius: 20,
                      }}>{data.discount}% OFF</span>
                    )}
                    {data.stockStatus === 'outOfStock' && (
                      <span style={{
                        background: '#dc3545', color: '#fff',
                        fontSize: '0.7rem', fontWeight: 700,
                        padding: '4px 12px', borderRadius: 20,
                      }}>Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Info chips below image */}
                <div style={{
                  display: 'flex', gap: 8, flexWrap: 'wrap',
                  padding: '1rem 1.2rem',
                  borderTop: '1px solid var(--border)',
                }}>
                  {[
                    data.freeDelivery === 'true' && { icon: '🚚', label: 'Free Delivery' },
                    data.isCod        === 'true' && { icon: '💵', label: 'Cash on Delivery' },
                    data.returnPolicy             && { icon: '↩️', label: data.returnPolicy },
                    data.replacementPolicy        && { icon: '🔄', label: data.replacementPolicy },
                  ].filter(Boolean).map((chip, i) => (
                    <span key={i} style={{
                      background:  'var(--accent-soft)',
                      color:       'var(--accent)',
                      border:      '1px solid rgba(224,92,42,.2)',
                      borderRadius: 20,
                      fontSize:    '0.74rem',
                      fontWeight:  600,
                      padding:     '4px 12px',
                      display:     'flex',
                      alignItems:  'center',
                      gap:         4,
                    }}>
                      {chip.icon} {chip.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Details ── */}
            <div className="col-lg-7">

              {/* Category */}
              {catName && (
                <div style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  letterSpacing: '.1em', textTransform: 'uppercase',
                  color: 'var(--accent)', marginBottom: '0.5rem',
                }}>
                  {catName}
                </div>
              )}

              {/* Name */}
              <h1 style={{
                fontFamily:  'var(--font-display)',
                fontSize:    'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight:  700,
                color:       'var(--text-primary)',
                lineHeight:  1.2,
                marginBottom: '0.5rem',
              }}>
                {data.name}
              </h1>

              {/* Brand */}
              {data.brandName && (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                  By <strong style={{ color: 'var(--text-secondary)' }}>{data.brandName}</strong>
                </p>
              )}

              {/* Divider */}
              <div style={{ width: 48, height: 3, background: 'var(--accent)', borderRadius: 2, marginBottom: '1.5rem' }} />

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize:   '2rem',
                  fontWeight: 700,
                  color:      'var(--accent)',
                }}>
                  ₹{discounted.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <>
                    <span style={{
                      fontSize:        '1.1rem',
                      color:           'var(--text-muted)',
                      textDecoration:  'line-through',
                    }}>
                      ₹{Number(data.actualPrice).toLocaleString('en-IN')}
                    </span>
                    <span style={{
                      background: 'rgba(40,167,69,.12)',
                      color:      '#28a745',
                      border:     '1px solid rgba(40,167,69,.25)',
                      borderRadius: 20,
                      fontSize:   '0.8rem',
                      fontWeight: 700,
                      padding:    '3px 12px',
                    }}>
                      You save ₹{savings.toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>

              {/* Stock status */}
              <div style={{ marginBottom: '1.5rem' }}>
                {data.stockStatus === 'inStock' ? (
                  <span style={{ color: '#28a745', fontWeight: 600, fontSize: '0.88rem' }}>
                    ✓ In Stock ({data.stock} units)
                  </span>
                ) : (
                  <span style={{ color: '#dc3545', fontWeight: 600, fontSize: '0.88rem' }}>
                    ✗ Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              {data.description && (
                <div style={{
                  background:   'var(--bg-card)',
                  border:       '1px solid var(--border)',
                  borderRadius: 14,
                  padding:      '1.2rem 1.4rem',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Description
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                    {data.description}
                  </p>
                </div>
              )}

              {/* Attributes */}
              {data.attributes && (
                <div style={{
                  background:   'var(--bg-card)',
                  border:       '1px solid var(--border)',
                  borderRadius: 14,
                  padding:      '1.2rem 1.4rem',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Specifications
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                    {data.attributes}
                  </p>
                </div>
              )}

              {/* Specs grid */}
              {(data.height || data.width) && (
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 12, marginBottom: '1.5rem',
                }}>
                  {[
                    data.height && { label: 'Height', val: data.height },
                    data.width  && { label: 'Width',  val: data.width  },
                  ].filter(Boolean).map((spec, i) => (
                    <div key={i} style={{
                      background:   'var(--bg-card)',
                      border:       '1px solid var(--border)',
                      borderRadius: 12,
                      padding:      '0.9rem 1rem',
                      textAlign:    'center',
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>{spec.label}</div>
                      <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: 4 }}>{spec.val}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Policies */}
              {data.refundPolicy && (
                <div style={{
                  background:   'rgba(224,92,42,.06)',
                  border:       '1px solid rgba(224,92,42,.2)',
                  borderRadius: 12,
                  padding:      '0.9rem 1.1rem',
                  marginBottom: '1.5rem',
                  fontSize:     '0.85rem',
                  color:        'var(--text-secondary)',
                }}>
                  🛡️ <strong>Refund Policy:</strong> {data.refundPolicy}
                </div>
              )}

              {/* Cart message */}
              {cartMsg && (
                <div style={{
                  background:   cartMsg.includes('wrong') ? 'rgba(220,53,69,.1)' : 'rgba(40,167,69,.1)',
                  border:       `1px solid ${cartMsg.includes('wrong') ? 'rgba(220,53,69,.3)' : 'rgba(40,167,69,.3)'}`,
                  borderRadius: 10,
                  padding:      '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize:     '0.88rem',
                  fontWeight:   600,
                  color:        cartMsg.includes('wrong') ? '#dc3545' : '#28a745',
                }}>
                  {cartMsg.includes('wrong') ? '❌' : '✅'} {cartMsg}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={handleCart}
                  disabled={adding || data.stockStatus === 'outOfStock'}
                  style={{
                    flex:          1,
                    minWidth:      160,
                    background:    data.stockStatus === 'outOfStock' ? 'var(--chip-bg)' : 'var(--accent)',
                    color:         data.stockStatus === 'outOfStock' ? 'var(--text-muted)' : '#fff',
                    border:        'none',
                    borderRadius:  12,
                    padding:       '0.9rem 1.5rem',
                    fontSize:      '0.95rem',
                    fontWeight:    700,
                    cursor:        data.stockStatus === 'outOfStock' ? 'not-allowed' : 'pointer',
                    transition:    'all 0.2s',
                    display:       'flex',
                    alignItems:    'center',
                    justifyContent: 'center',
                    gap:           8,
                  }}
                  onMouseEnter={e => { if (data.stockStatus !== 'outOfStock') e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {adding ? '⏳ Adding…' : data.stockStatus === 'outOfStock' ? '🚫 Out of Stock' : '🛒 Add to Cart'}
                </button>

                <button
                  onClick={() => navigate('/user/dashboard/cart')}
                  style={{
                    background:   'transparent',
                    color:        'var(--accent)',
                    border:       '2px solid var(--accent)',
                    borderRadius: 12,
                    padding:      '0.9rem 1.5rem',
                    fontSize:     '0.95rem',
                    fontWeight:   700,
                    cursor:       'pointer',
                    transition:   'all 0.2s',
                    whiteSpace:   'nowrap',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)' }}
                >
                  View Cart →
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ProductDetails