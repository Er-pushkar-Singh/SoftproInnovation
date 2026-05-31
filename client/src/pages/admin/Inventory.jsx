import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/product')
      setProducts(res.data.data || [])
    } catch (err) {
      console.error('Error fetching inventory products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Local changes handler for input fields
  const handleStockChange = (productId, newStock) => {
    const val = parseInt(newStock)
    if (isNaN(val) || val < 0) return

    setProducts(prev => prev.map(p => {
      if (p._id === productId) {
        return {
          ...p,
          stock: val,
          stockStatus: val > 0 ? 'inStock' : 'outOfStock'
        }
      }
      return p
    }))
  }

  // Quick increment/decrement buttons
  const adjustStock = (productId, amount) => {
    setProducts(prev => prev.map(p => {
      if (p._id === productId) {
        const val = Math.max(0, parseInt(p.stock || 0) + amount)
        return {
          ...p,
          stock: val,
          stockStatus: val > 0 ? 'inStock' : 'outOfStock'
        }
      }
      return p
    }))
  }

  // Save changes on the backend
  const handleSaveStock = async (productId) => {
    const p = products.find(prod => prod._id === productId)
    if (!p) return

    setUpdatingId(productId)
    try {
      const res = await axios.patch(`http://localhost:5000/api/product/${productId}/stock`, {
        stock: p.stock,
        stockStatus: p.stockStatus
      })
      alert(res.data.msg || 'Stock level updated successfully.')
    } catch (err) {
      console.error(err)
      alert('Failed to update stock. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredProducts = products.filter(p =>
    String(p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(p.category?.category || '').toLowerCase().includes(search.toLowerCase()) ||
    String(p.brandName || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <p>Loading inventory database directory…</p>
      </div>
    )
  }

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Inventory <span>Stock</span></h1>
          <p className="dash-page-subtitle">Monitor and update product availability levels instantly</p>
        </div>
        <button className="dash-btn-outline" onClick={fetchProducts}>🔄 Refresh Inventory</button>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: 260, maxWidth: 360, flex: 1 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, category, or brand…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: '2.2rem',
              background: 'var(--dash-input-bg)', border: '1.5px solid var(--dash-input-border)',
              borderRadius: 10, padding: '0.65rem 0.9rem 0.65rem 2.2rem',
              fontSize: '0.88rem', color: 'var(--text-primary)', outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Inventory Stock Card */}
      <div className="dash-card">
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            No products found matching your search.
          </div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Stock Adjustment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, index) => {
                  const isUpdating = updatingId === p._id
                  const inStock = p.stock > 0

                  return (
                    <tr key={p._id} style={{ opacity: isUpdating ? 0.65 : 1, transition: 'opacity 0.2s' }}>
                      <td>{index + 1}</td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Brand: {p.brandName || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {p.category?.category || 'Uncategorized'}
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                        ₹{Number(p.actualPrice).toLocaleString('en-IN')}
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '0.95rem', color: inStock ? 'var(--text-primary)' : '#dc3545' }}>
                        {p.stock} units
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block', fontSize: '0.68rem', fontWeight: 800,
                          padding: '3px 10px', borderRadius: 20, letterSpacing: '.05em',
                          textTransform: 'uppercase',
                          background: inStock ? 'rgba(40,167,69,.12)' : 'rgba(220,53,69,.12)',
                          color: inStock ? '#28a745' : '#dc3545',
                          border: `1px solid ${inStock ? 'rgba(40,167,69,.25)' : 'rgba(220,53,69,.25)'}`
                        }}>
                          {inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => adjustStock(p._id, -1)}
                            style={{
                              width: 28, height: 28, background: 'var(--dash-table-head)',
                              border: '1.5px solid var(--dash-input-border)', borderRadius: 6,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, color: 'var(--text-primary)'
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={p.stock}
                            onChange={e => handleStockChange(p._id, e.target.value)}
                            style={{
                              width: 60, height: 28, background: 'var(--dash-input-bg)',
                              border: '1.5px solid var(--dash-input-border)', borderRadius: 6,
                              textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-primary)',
                              outline: 'none', appearance: 'textfield'
                            }}
                          />
                          <button
                            onClick={() => adjustStock(p._id, 1)}
                            style={{
                              width: 28, height: 28, background: 'var(--dash-table-head)',
                              border: '1.5px solid var(--dash-input-border)', borderRadius: 6,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, color: 'var(--text-primary)'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleSaveStock(p._id)}
                          disabled={isUpdating}
                          className="dash-btn-primary"
                          style={{
                            padding: '0.4rem 0.85rem', fontSize: '0.75rem',
                            borderRadius: 8, cursor: isUpdating ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isUpdating ? 'Saving…' : 'Save Levels'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory