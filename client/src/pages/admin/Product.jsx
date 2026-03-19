import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Product = () => {

    const [data, setData] = useState([])

    const handlefeatch = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/product')
            setData(res.data.data)
            console.log(res);

        } catch (er) {
            console.log(er);

        }
    }
    useEffect(() => {
        handlefeatch();
    }, [])

     useEffect(() => {
        console.log("Updated Data:", data);
    }, [data]);

     const handleDelete = async(id)=>{
        try{
            const res = await axios.delete(`http://localhost:5000/api/product/${id}`);
            alert(res.data.msg)
            handlefeatch();
        }
        catch{
            alert("Sorry try Again Later")
        }
        
    }
    return (
        <div>
            <div className="card mt-5">
                <div className="card-header">
                    <Link to='/admin/dashboard/addproduct' className="btn btn-primary">Add Product</Link>
                </div>
                <div className="card-body">
                    <table className="table table border">
                        <thead>
                            <tr>
                                <th>S.R</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Stock</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, i) => (
                                <tr key={i + 1}>
                                    <td>{i + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.category?.category}</td>
                                    <td>{item.actualPrice}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.stock}</td>
                                    <td><Link to={`/admin/dashboard/addproduct/${item._id}`}>Edit</Link>
                                    <button className='btn btn-danger ms-2' onClick={()=>{handleDelete(item._id)}}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default Product