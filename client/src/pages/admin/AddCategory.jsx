import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const AddCategory = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    category: '',
    picture: null,
    description: ''
  })

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      const fetchCategory = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/category')
          const found = res.data.data?.find(c => c._id === id)
          if (found) {
            setData({
              category: found.category || '',
              picture: null, // Keep null unless new file uploaded
              description: found.description || ''
            })
          }
        } catch (err) {
          console.error('Error fetching category details:', err)
        }
      }
      fetchCategory()
    }
  }, [id])

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setData(prev => ({ ...prev, [e.target.name]: e.target.files[0] }))
    } else {
      setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Build FormData to send as multipart/form-data
    const formData = new FormData()
    formData.append('category', data.category)
    formData.append('description', data.description)
    if (data.picture) {
      formData.append('picture', data.picture)
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/category/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Category updated successfully')
      } else {
        await axios.post('http://localhost:5000/api/category', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Category added successfully')
      }
      navigate('/admin/dashboard/category')
    } catch (err) {
      console.error(err)
      alert(isEdit ? 'Failed to update category.' : 'Failed to create category.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="dash-breadcrumb">
        <span onClick={() => navigate('/admin/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</span>
        <span className="dash-breadcrumb-sep">/</span>
        <span onClick={() => navigate('/admin/dashboard/category')} style={{ cursor: 'pointer' }}>Categories</span>
        <span className="dash-breadcrumb-sep">/</span>
        <span style={{ color: 'var(--text-primary)' }}>{isEdit ? 'Edit Category' : 'Add Category'}</span>
      </div>

      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">{isEdit ? 'Edit' : 'Add'} <span>Category</span></h1>
          <p className="dash-page-subtitle">{isEdit ? 'Modify existing' : 'Create new'} component category filters</p>
        </div>
      </div>

      <div className="dash-card" style={{ maxWidth: 640 }}>
        <div className="dash-card-header">
          <h2 className="dash-card-title">{isEdit ? 'Edit Details' : 'Category Details'}</h2>
        </div>
        <div className="dash-card-body">
          <form onSubmit={handleSubmit}>
            <div className="dash-field">
              <label htmlFor="category">Category Title</label>
              <input
                id="category"
                type="text"
                name="category"
                value={data.category}
                onChange={handleChange}
                placeholder="e.g. Microcontrollers"
                required
              />
            </div>

            <div className="dash-field">
              <label htmlFor="picture">Category Image File {isEdit && <span style={{ color: 'var(--text-muted)' }}>(Optional - leave blank to keep old)</span>}</label>
              <input
                id="picture"
                type="file"
                name="picture"
                onChange={handleChange}
                style={{ paddingTop: '0.55rem' }}
                required={!isEdit}
              />
            </div>

            <div className="dash-field">
              <label htmlFor="description">Category Description</label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleChange}
                placeholder="e.g. Raspberry Pi, Arduino UNO boards and standard computing accessories..."
                rows="4"
                style={{
                  width: '100%', background: 'var(--dash-input-bg)',
                  border: '1.5px solid var(--dash-input-border)', borderRadius: 10,
                  padding: '0.72rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)',
                  outline: 'none', resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.8rem' }}>
              <button type="submit" className="dash-btn-primary" disabled={loading}>
                {loading ? 'Processing…' : (isEdit ? 'Update Category' : 'Create Category')}
              </button>
              <button
                type="button"
                className="dash-btn-outline"
                onClick={() => navigate('/admin/dashboard/category')}
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

export default AddCategory
