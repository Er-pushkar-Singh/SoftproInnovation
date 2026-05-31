import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const AddProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryList, setCategoryList] = useState([])

  const [data, setData] = useState({
    name: "",
    category: "",
    description: "",
    brandName: "",
    actualPrice: "",
    discount: "",
    picture: null,
    tag: "",
    stock: "",
    attributes: "",
    height: "",
    width: "",
    stockStatus: "",
    refundPolicy: "No",
    replacementPolicy: "No",
    freeDelivery: "No",
    returnPolicy: "No",
    isCod: "No"
  })

  useEffect(() => {
    const init = async () => {
      await fetchCategories()
      if (id) {
        setIsEdit(true)
        await fetchProductDetails()
      }
    }
    init()
  }, [id])

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category")
      setCategoryList(res.data.data || [])
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/product/details/${id}`)
      const p = res.data.data
      if (p) {
        setData({
          name: p.name || "",
          category: p.category || "",
          description: p.description || "",
          brandName: p.brandName || "",
          actualPrice: p.actualPrice || "",
          discount: p.discount || "",
          picture: null, // Keep null unless new file uploaded
          tag: p.tag || "",
          stock: p.stock || "",
          attributes: p.attributes || "",
          height: p.height || "",
          width: p.width || "",
          stockStatus: p.stockStatus || "",
          refundPolicy: p.refundPolicy || "No",
          replacementPolicy: p.replacementPolicy || "No",
          freeDelivery: p.freeDelivery || "No",
          returnPolicy: p.returnPolicy || "No",
          isCod: p.isCod || "No"
        })
      }
    } catch (err) {
      console.error("Error fetching product details:", err)
    }
  }

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setData(prev => ({ ...prev, [e.target.name]: e.target.files[0] }))
    } else {
      setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Build FormData object to send multipart/form-data
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'picture') {
        if (data.picture instanceof File) {
          formData.append('picture', data.picture)
        }
      } else {
        formData.append(key, data[key])
      }
    })

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/product/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        alert("Product updated successfully")
      } else {
        await axios.post("http://localhost:5000/api/product", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        alert("Product added successfully")
      }
      navigate("/admin/dashboard/product")
    } catch (err) {
      console.error(err)
      alert(isEdit ? "Failed to update product." : "Failed to add product.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="dash-breadcrumb">
        <span onClick={() => navigate('/admin/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</span>
        <span className="dash-breadcrumb-sep">/</span>
        <span onClick={() => navigate('/admin/dashboard/product')} style={{ cursor: 'pointer' }}>Products</span>
        <span className="dash-breadcrumb-sep">/</span>
        <span style={{ color: 'var(--text-primary)' }}>{isEdit ? 'Edit Product' : 'Add Product'}</span>
      </div>

      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">{isEdit ? 'Edit' : 'Add'} <span>Product</span></h1>
          <p className="dash-page-subtitle">{isEdit ? 'Modify details of' : 'Publish a new'} hardware product item</p>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header">
          <h2 className="dash-card-title">{isEdit ? 'Edit Product Form' : 'New Product Details'}</h2>
        </div>
        <div className="dash-card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            
            {/* Grid Row 1 */}
            <div className="dash-field-row">
              <div className="dash-field">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="e.g. Raspberry Pi 5 - 8GB RAM"
                  required
                />
              </div>
              <div className="dash-field">
                <label htmlFor="brandName">Brand Name</label>
                <input
                  id="brandName"
                  type="text"
                  name="brandName"
                  value={data.brandName}
                  onChange={handleChange}
                  placeholder="e.g. Raspberry Pi Foundation"
                  required
                />
              </div>
            </div>

            {/* Grid Row 2 */}
            <div className="dash-field-row">
              <div className="dash-field">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categoryList.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dash-field">
                <label htmlFor="tag">Product Tag</label>
                <input
                  id="tag"
                  type="text"
                  name="tag"
                  value={data.tag}
                  onChange={handleChange}
                  placeholder="e.g. newArrival, featured, popular"
                />
              </div>
            </div>

            {/* Grid Row 3 */}
            <div className="dash-field-row">
              <div className="dash-field">
                <label htmlFor="actualPrice">Price (₹ INR)</label>
                <input
                  id="actualPrice"
                  type="number"
                  name="actualPrice"
                  value={data.actualPrice}
                  onChange={handleChange}
                  placeholder="e.g. 7500"
                  required
                />
              </div>
              <div className="dash-field">
                <label htmlFor="discount">Discount Percent (%)</label>
                <input
                  id="discount"
                  type="number"
                  name="discount"
                  value={data.discount}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            {/* Grid Row 4 */}
            <div className="dash-field-row">
              <div className="dash-field">
                <label htmlFor="stock">Total Quantity In Stock</label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={data.stock}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                  required
                />
              </div>
              <div className="dash-field">
                <label htmlFor="stockStatus">Availability Status</label>
                <select
                  id="stockStatus"
                  name="stockStatus"
                  value={data.stockStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out Of Stock</option>
                </select>
              </div>
            </div>

            {/* Grid Row 5 */}
            <div className="dash-field-row">
              <div className="dash-field">
                <label htmlFor="height">Height Dimension</label>
                <input
                  id="height"
                  type="text"
                  name="height"
                  value={data.height}
                  onChange={handleChange}
                  placeholder="e.g. 85mm"
                />
              </div>
              <div className="dash-field">
                <label htmlFor="width">Width Dimension</label>
                <input
                  id="width"
                  type="text"
                  name="width"
                  value={data.width}
                  onChange={handleChange}
                  placeholder="e.g. 56mm"
                />
              </div>
            </div>

            {/* Fields Row */}
            <div className="dash-field">
              <label htmlFor="description">Product Description</label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleChange}
                placeholder="Write detailed product features, specifications, chipsets, or pin configurations here..."
                rows="5"
                style={{
                  width: '100%', background: 'var(--dash-input-bg)',
                  border: '1.5px solid var(--dash-input-border)', borderRadius: 10,
                  padding: '0.72rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)',
                  outline: 'none', resize: 'vertical'
                }}
                required
              />
            </div>

            <div className="dash-field">
              <label htmlFor="attributes">Technical Attributes</label>
              <input
                id="attributes"
                type="text"
                name="attributes"
                value={data.attributes}
                onChange={handleChange}
                placeholder="e.g. 8GB LPDDR4, PCIe 2.0, Quad-core Cortex-A76"
              />
            </div>

            <div className="dash-field">
              <label htmlFor="picture">Product Image File {isEdit && <span style={{ color: 'var(--text-muted)' }}>(Optional - leave blank to keep old)</span>}</label>
              <input
                id="picture"
                type="file"
                name="picture"
                onChange={handleChange}
                style={{ paddingTop: '0.55rem' }}
                required={!isEdit}
              />
            </div>

            {/* Policy Radios */}
            <div className="row g-3 mt-2" style={{ borderTop: '1px solid var(--dash-card-border)', paddingTop: '1.5rem' }}>
              <div className="col-sm-6 col-md-4">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Refund Policy</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="refundPolicy" value="Yes" checked={data.refundPolicy === 'Yes'} onChange={handleChange} /> Yes
                  </label>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="refundPolicy" value="No" checked={data.refundPolicy === 'No'} onChange={handleChange} /> No
                  </label>
                </div>
              </div>

              <div className="col-sm-6 col-md-4">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Replacement Policy</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="replacementPolicy" value="Yes" checked={data.replacementPolicy === 'Yes'} onChange={handleChange} /> Yes
                  </label>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="replacementPolicy" value="No" checked={data.replacementPolicy === 'No'} onChange={handleChange} /> No
                  </label>
                </div>
              </div>

              <div className="col-sm-6 col-md-4">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Free Delivery</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="freeDelivery" value="Yes" checked={data.freeDelivery === 'Yes'} onChange={handleChange} /> Yes
                  </label>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="freeDelivery" value="No" checked={data.freeDelivery === 'No'} onChange={handleChange} /> No
                  </label>
                </div>
              </div>

              <div className="col-sm-6 col-md-4 mt-3">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Return Policy</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="returnPolicy" value="Yes" checked={data.returnPolicy === 'Yes'} onChange={handleChange} /> Yes
                  </label>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="returnPolicy" value="No" checked={data.returnPolicy === 'No'} onChange={handleChange} /> No
                  </label>
                </div>
              </div>

              <div className="col-sm-6 col-md-4 mt-3">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cash On Delivery (COD)</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="isCod" value="Yes" checked={data.isCod === 'Yes'} onChange={handleChange} /> Yes
                  </label>
                  <label style={{ cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input type="radio" name="isCod" value="No" checked={data.isCod === 'No'} onChange={handleChange} /> No
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem' }}>
              <button type="submit" className="dash-btn-primary" disabled={loading}>
                {loading ? 'Processing…' : (isEdit ? 'Update Product' : 'Create Product')}
              </button>
              <button
                type="button"
                className="dash-btn-outline"
                onClick={() => navigate('/admin/dashboard/product')}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct