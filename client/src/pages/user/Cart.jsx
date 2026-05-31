import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Cart = () => {
  const userId   = localStorage.getItem('id')
  const navigate = useNavigate()
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [updating, setUpdating] = useState(null)

  /* ── Fetch cart ── */
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`)
      setItems(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  /* ── Increase quantity ── */
  const handleIncrease = async (cartId) => {
    setUpdating(cartId)
    try {
      const res = await axios.patch(`http://localhost:5000/api/cart/quantity/increase/${cartId}`)
      if (res.data.msg === 'ONLY 5 QUANTITY ALLOWED') {
        alert('Maximum 5 quantity allowed!')
      } else {
        const updatedQty = res.data.data?.quantity
        if (updatedQty !== undefined) {
          setItems(prev => prev.map(item =>
            item._id === cartId ? { ...item, quantity: updatedQty } : item
          ))
        } else {
          await fetchCart()
        }
      }
    } catch (err) { console.error(err) }
    finally { setUpdating(null) }
  }

  /* ── Decrease quantity ── */
  const handleDecrease = async (cartId) => {
    setUpdating(cartId)
    try {
      const res = await axios.patch(`http://localhost:5000/api/cart/quantity/decrease/${cartId}`)
      if (!res.data.msg.includes('not less than 1')) {
        const updatedQty = res.data.data?.quantity
        if (updatedQty !== undefined) {
          setItems(prev => prev.map(item =>
            item._id === cartId ? { ...item, quantity: updatedQty } : item
          ))
        } else {
          await fetchCart()
        }
      }
    } catch (err) { console.error(err) }
    finally { setUpdating(null) }
  }

  /* ── Remove item ── */
  const handleRemove = async (cartId) => {
    setUpdating(cartId)
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartId}`)
      setItems(prev => prev.filter(item => item._id !== cartId))
    } catch (err) { console.error(err) }
    finally { setUpdating(null) }
  }

  /* ── Price: schema me actualPrice hai, price nahi ── */
  const getPrice = (item) => Number(item.productId?.actualPrice || 0)

  const subtotal = items.reduce((sum, item) => sum + getPrice(item) * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 99
  const total    = subtotal + shipping

  /* ── Loading ── */
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
      <p>Loading your cart…</p>
    </div>
  )

  /* ── Empty ── */
  if (items.length === 0) return (
    <div>
      <h1 className="dash-page-title mb-4">My <span>Cart</span></h1>
      <div className="dash-card">
        <div className="cart-empty">
          <span className="cart-empty-icon">🛒</span>
          <div className="cart-empty-title">Your cart is empty</div>
          <p className="cart-empty-desc">Add some awesome electronics to get started!</p>
          <Link to="/products" className="dash-btn-primary">Browse Products</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">My <span>Cart</span></h1>
          <p className="dash-page-subtitle">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <Link to="/products" className="dash-btn-outline">+ Add More</Link>
      </div>

      <div className="row g-4">

        {/* ── Items list ── */}
        <div className="col-lg-8">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">🛒 Cart Items</span>
            </div>
            <div className="dash-card-body">
              {items.map(item => {
                const product    = item.productId || {}
                const price      = getPrice(item)
                const isUpdating = updating === item._id

                return (
                  <div
                    className="cart-item-row"
                    key={item._id}
                    style={{ opacity: isUpdating ? 0.5 : 1, transition: 'opacity 0.2s' }}
                  >
                    {/* Image — schema me images field hai, picture nahi */}
                    <div className="cart-item-img">
                      {product.images ? (
                        <img
                          src={`http://localhost:5000/uploads/${product.images}`}
                          alt={product.name}
                          onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                      ) : (
                        <span style={{ fontSize: '2rem' }}>📦</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="cart-item-info">
                      <div className="cart-item-name">{product.name || 'Unknown Product'}</div>
                      <div className="cart-item-cat">
                        {typeof product.category === 'object'
                          ? product.category?.category
                          : product.category || ''}
                      </div>
                      {price > 0 && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 3 }}>
                          ₹{price.toLocaleString('en-IN')} × {item.quantity}
                        </div>
                      )}
                    </div>

                    {/* Row total */}
                    <div className="cart-item-price">
                      {price > 0
                        ? `₹${(price * item.quantity).toLocaleString('en-IN')}`
                        : '—'}
                    </div>

                    {/* Qty stepper */}
                    <div className="qty-stepper">
                      <button
                        className="qty-btn"
                        onClick={() => handleDecrease(item._id)}
                        disabled={isUpdating || item.quantity <= 1}
                      >−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleIncrease(item._id)}
                        disabled={isUpdating || item.quantity >= 5}
                      >+</button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={isUpdating}
                      title="Remove item"
                      style={{
                        background: 'none', border: 'none',
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        color: 'var(--text-muted)', fontSize: '1.1rem',
                        padding: '4px 6px', borderRadius: 6, transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => { if (!isUpdating) e.currentTarget.style.color = '#dc3545' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                    >✕</button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Summary ── */}
        <div className="col-lg-4">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">💰 Order Summary</span>
            </div>
            <div className="dash-card-body">
              <div className="cart-summary-row">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#28a745' : 'inherit' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Free shipping on orders above ₹5,000
                </p>
              )}
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                className="dash-btn-primary"
                style={{ width: '100%', marginTop: '1.2rem', justifyContent: 'center' }}
                onClick={() => navigate('/user/dashboard/address', { state: { total, items } })}
              >
                Proceed to Checkout →
              </button>

              <Link
                to="/products"
                className="dash-btn-outline"
                style={{ width: '100%', marginTop: '0.6rem', justifyContent: 'center', display: 'flex' }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart