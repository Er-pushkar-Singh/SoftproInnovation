import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Address = () => {
  const userId = localStorage.getItem('id')
  const navigate = useNavigate()
  const location = useLocation()

  const orderTotal = location.state?.total || 0
  const cartItems = location.state?.items || []

  const [addresses, setAddresses] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('')   // 'cod' | 'online'


  const emptyForm = { houseNo: '', pincode: '', city: '', state: '' }
  const [form, setForm] = useState(emptyForm)

  // load razorpay
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };
  /* ── Fetch addresses ── */
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/address/${userId}`)
      const data = res.data.data || []
      setAddresses(data)
      if (data.length > 0) setSelected(data[0]._id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAddresses() }, [])

  /* ── Add new address ── */
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.houseNo || !form.pincode || !form.city || !form.state) {
      setAlert({ type: 'error', msg: 'Please fill all required fields.' })
      return
    }
    setSaving(true)
    setAlert(null)
    try {
      await axios.post('http://localhost:5000/api/address', {
        userId,
        houseNo: form.houseNo,
        pincode: form.pincode,
        city: form.city,
        state: form.state,
      })
      setAlert({ type: 'success', msg: 'Address added successfully!' })
      setForm(emptyForm)
      setShowForm(false)
      await fetchAddresses()
    } catch (err) {
      setAlert({ type: 'error', msg: 'Failed to add address. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  /* ── Delete address ── */
  const handleDelete = async (addrId) => {
    setDeleting(addrId)
    try {
      await axios.delete(`http://localhost:5000/api/address/${addrId}`)
      const updated = addresses.filter(a => a._id !== addrId)
      setAddresses(updated)
      if (selected === addrId) setSelected(updated[0]?._id || null)
    } catch (err) { console.error(err) }
    finally { setDeleting(null) }
  }

  const handleFormChange = (e) => {
    setAlert(null)
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // handle payement 
  const handlePaymentSelect = (method) => {
    setPaymentMethod(method)
  }
  const handleRazorpayPayment = async () => {

    try {

      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Razorpay SDK failed");
        return;
      }

      const orderResponse =
        await axios.post(
          "http://localhost:5000/api/payment/create-order",
          {
            userId
          }
        );

      const order = orderResponse.data.order;

      const options = {

        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        order_id: order.id,

        name: "ElectroMart",

        description: "Order Payment",

        handler: async function (response) {

          const verify =
            await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                ...response,
                userId,
                addressId: selected,
                amount: order.amount
              }
            );
          console.log(verify);

          if (verify.data.success) {

            setAlert({
              type: "success",
              msg: verify.data.msg
            });

            navigate("/user/dashboard/orders");
          }
        },

        theme: {
          color: "#3399cc"
        }
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.log(error);

      alert("Payment Failed");
    }
  };

  /* ── Place order ── */
  const [placing, setPlacing] = useState(false)



  const handlePlaceOrder = async () => {

    if (!selected) {
      setAlert({
        type: "error",
        msg: "Please select address"
      });
      return;
    }

    if (!paymentMethod) {
      setAlert({
        type: "error",
        msg: "Please select payment method"
      });
      return;
    }

    if (paymentMethod === "online") {
      return handleRazorpayPayment();
    }

    setPlacing(true);
    setAlert(null);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/order/order/cart",
        {
          userId,
          paymentMethod,
          transactionId: null,
          addressId: selected
        }
      );

      if (res.data.msg === "Order placed successfully") {
        alert("Order placed successfully");
        navigate("/user/dashboard");
      } else {
        setAlert({
          type: "error",
          msg: res.data.msg
        });
      }

    } catch (error) {

      console.log(error);

      setAlert({
        type: "error",
        msg: "Something went wrong"
      });

    } finally {

      setPlacing(false);

    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
      <p>Loading addresses…</p>
    </div>
  )

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Delivery <span>Address</span></h1>
          <p className="dash-page-subtitle">Select address and payment method to continue</p>
        </div>
        <button className="dash-btn-outline" onClick={() => navigate('/user/dashboard/cart')}>
          ← Back to Cart
        </button>
      </div>

      {alert && (
        <div className={`dash-alert ${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
        </div>
      )}

      <div className="row g-4">

        {/* ── Left ── */}
        <div className="col-lg-7">

          {/* Empty state */}
          {addresses.length === 0 && !showForm && (
            <div className="dash-card mb-3">
              <div className="cart-empty" style={{ padding: '3rem 1rem' }}>
                <span className="cart-empty-icon">📍</span>
                <div className="cart-empty-title">No saved addresses</div>
                <p className="cart-empty-desc">Add a delivery address to continue.</p>
                <button className="dash-btn-primary" onClick={() => setShowForm(true)}>+ Add Address</button>
              </div>
            </div>
          )}

          {/* Address cards */}
          {addresses.length > 0 && (
            <div className="dash-card mb-3">
              <div className="dash-card-header">
                <span className="dash-card-title">📍 Saved Addresses</span>
                <button
                  className="dash-btn-outline"
                  style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
                  onClick={() => { setShowForm(s => !s); setAlert(null) }}
                >
                  {showForm ? '✕ Cancel' : '+ Add New'}
                </button>
              </div>
              <div className="dash-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {addresses.map(addr => {
                  const isSelected = selected === addr._id
                  const isDel = deleting === addr._id
                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelected(addr._id)}
                      style={{
                        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--dash-card-border)'}`,
                        borderRadius: 12, padding: '1rem 1.1rem', cursor: 'pointer',
                        background: isSelected ? 'var(--accent-soft)' : 'var(--dash-input-bg)',
                        transition: 'border-color 0.2s, background 0.2s',
                        opacity: isDel ? 0.5 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--dash-input-border)'}`,
                          background: isSelected ? 'var(--accent)' : 'transparent',
                          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '.08em', background: 'var(--dash-table-head)',
                          color: 'var(--text-muted)', borderRadius: 20, padding: '2px 10px',
                        }}>Home</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 2 }}>
                        {addr.houseNo}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {addr.city}, {addr.state} — {addr.pincode}
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <button
                          className="dash-btn-danger"
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
                          disabled={isDel}
                          onClick={e => { e.stopPropagation(); handleDelete(addr._id) }}
                        >
                          {isDel ? 'Removing…' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Add address form */}
          {showForm && (
            <div className="dash-card mb-3">
              <div className="dash-card-header">
                <span className="dash-card-title">➕ Add New Address</span>
              </div>
              <div className="dash-card-body">
                <form onSubmit={handleSave} noValidate>
                  <div className="dash-field">
                    <label>House No / Street Address *</label>
                    <input name="houseNo" value={form.houseNo} onChange={handleFormChange} placeholder="e.g. 12B, Sector 5, MG Road" required />
                  </div>
                  <div className="dash-field-row">
                    <div className="dash-field">
                      <label>City *</label>
                      <input name="city" value={form.city} onChange={handleFormChange} placeholder="Lucknow" required />
                    </div>
                    <div className="dash-field">
                      <label>State *</label>
                      <input name="state" value={form.state} onChange={handleFormChange} placeholder="Uttar Pradesh" required />
                    </div>
                  </div>
                  <div className="dash-field">
                    <label>Pincode *</label>
                    <input name="pincode" value={form.pincode} onChange={handleFormChange} placeholder="226010" required />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button type="submit" className="dash-btn-primary" disabled={saving}>
                      {saving ? 'Saving…' : '💾 Save Address'}
                    </button>
                    <button type="button" className="dash-btn-outline"
                      onClick={() => { setShowForm(false); setForm(emptyForm); setAlert(null) }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ════ PAYMENT METHOD — address save hone ke baad dikhega ════ */}
          {selected && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">💳 Choose Payment Method</span>
              </div>
              <div className="dash-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Cash on Delivery — backend value: 'cod' */}
                <div
                  onClick={() => handlePaymentSelect('cod')}
                  style={{
                    border: `2px solid ${paymentMethod === 'cod' ? 'var(--accent)' : 'var(--dash-card-border)'}`,
                    borderRadius: 12, padding: '1rem 1.2rem', cursor: 'pointer',
                    background: paymentMethod === 'cod' ? 'var(--accent-soft)' : 'var(--dash-input-bg)',
                    transition: 'border-color 0.2s, background 0.2s',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${paymentMethod === 'cod' ? 'var(--accent)' : 'var(--dash-input-border)'}`,
                    background: paymentMethod === 'cod' ? 'var(--accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {paymentMethod === 'cod' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      💵 Cash on Delivery
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Pay when your order arrives at your door
                    </div>
                  </div>
                </div>

                {/* Online Payment — backend value: 'online' */}
                <div
                  onClick={() => handlePaymentSelect('online')}
                  style={{
                    border: `2px solid ${paymentMethod === 'online' ? 'var(--accent)' : 'var(--dash-card-border)'}`,
                    borderRadius: 12, padding: '1rem 1.2rem', cursor: 'pointer',
                    background: paymentMethod === 'online' ? 'var(--accent-soft)' : 'var(--dash-input-bg)',
                    transition: 'border-color 0.2s, background 0.2s',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${paymentMethod === 'online' ? 'var(--accent)' : 'var(--dash-input-border)'}`,
                    background: paymentMethod === 'online' ? 'var(--accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {paymentMethod === 'online' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      📱 Online Payment
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Pay via Razorpay secure checkout
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* ── Right: order summary ── */}
        <div className="col-lg-5">
          <div className="dash-card" style={{ position: 'sticky', top: '80px' }}>
            <div className="dash-card-header">
              <span className="dash-card-title">🧾 Order Summary</span>
            </div>
            <div className="dash-card-body">

              {cartItems.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  {cartItems.map(item => {
                    const product = item.productId || {}
                    const price = Number(product.actualPrice || 0)
                    return (
                      <div key={item._id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.5rem 0', borderBottom: '1px solid var(--dash-table-border)', fontSize: '0.85rem',
                      }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {product.name || 'Product'} × {item.quantity}
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          ₹{(price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {orderTotal > 0 && (
                <div className="cart-summary-row total">
                  <span>Total Payable</span>
                  <span>₹{orderTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Delivering to preview */}
              {selected && (() => {
                const addr = addresses.find(a => a._id === selected)
                return addr ? (
                  <div style={{
                    marginTop: '1rem', background: 'var(--dash-input-bg)',
                    border: '1.5px solid var(--accent)', borderRadius: 10, padding: '0.9rem 1rem',
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--accent)', marginBottom: 5 }}>
                      📍 Delivering to
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{addr.houseNo}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {addr.city}, {addr.state} — {addr.pincode}
                    </div>
                  </div>
                ) : null
              })()}

              {/* Payment method preview */}
              {paymentMethod && (
                <div style={{
                  marginTop: '0.75rem', background: 'var(--dash-input-bg)',
                  border: '1.5px solid var(--dash-card-border)', borderRadius: 10, padding: '0.75rem 1rem',
                  fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>{paymentMethod === 'cod' ? '💵' : '📱'}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
              )}

              <button
                className="dash-btn-primary"
                style={{
                  width: '100%', marginTop: '1.2rem', justifyContent: 'center',
                  opacity: (selected && paymentMethod) ? 1 : 0.5,
                  cursor: (selected && paymentMethod) ? 'pointer' : 'not-allowed',
                }}
                disabled={!selected || !paymentMethod || placing}
                onClick={handlePlaceOrder}
              >
                {placing ? 'Placing Order…' : 'Place Order →'}
              </button>

              {(!selected || !paymentMethod) && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                  {!selected ? 'Please select a delivery address' : 'Please select a payment method'}
                </p>
              )}

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Address