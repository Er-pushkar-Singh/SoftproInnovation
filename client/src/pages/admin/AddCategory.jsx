import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const AddCategory = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        category: '',
        picture: '',
        description: ''
    })
    const handleChange = (e) => {
        let t = e.target.type
        if (t == "file") {
            setData(() => ({ ...data, [e.target.name]: e.target.files[0] }))

        }
        else {
            setData(() => ({ ...data, [e.target.name]: e.target.value }))
        }

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/category', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("category added successfully")
            navigate('/admin/dashboard/category')
        }
        catch (er) {
            console.error(er);


        }
    }
    console.log(data);

    return (
        <div>
            <div className="card mt-5">
                <div className="card-body">
                    <form method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
                        <label htmlFor="category">Enter Category</label>
                        <input type="text" name="category" id="category" className='form-control' onChange={handleChange} />
                        <br />
                        <label htmlFor=""></label>
                        <label htmlFor="picture">Choose Category Image</label>
                        <input type="file" name='picture' id='picture' className='form-control' onChange={handleChange} />
                        <br />
                        <label htmlFor="description"> Description</label>
                        <textarea name="description" id="" className='form-control' onChange={handleChange} ></textarea>
                        <br />
                        <input type="submit" value="Add" />
                    </form>
                </div>
            </div>

        </div>
    )
}

export default AddCategory
