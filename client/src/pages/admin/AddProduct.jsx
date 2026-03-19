import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

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
    refundPolicy: "",
    replacementPolicy: "",
    freeDelivery: "",
    returnPolicy: "",
    isCod: ""
  });


  useEffect(() => {

    if (id) setIsEdit(true)
    fetchData();
    handleCategory();
  }, [])




  const fetchData = async () => {
    if (id) {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/${id}`);
        setData(res.data.data);
      } catch (err) {
        console.log(err);
      }

      console.log("hello" + id);
    }

  }

  const [category, setCategory] = useState([]);

  const handleChange = (e) => {
    console.log(isEdit);

    if (!isEdit) {
      if (e.target.type === "file") {
        setData({ ...data, [e.target.name]: e.target.files[0] });
      } else {
        setData({ ...data, [e.target.name]: e.target.value });

      }
    } else {

      setData({ ...data, [e.target.name]: e.target.value });
      console.log(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isEdit) {
        const res = await axios.post("http://localhost:5000/api/product", data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
         console.log(res.data);
      } else {
        const res = await axios.put(`http://localhost:5000/api/product/${id}`, data);
        console.log(res.data);

      }
      navigate("/admin/dashboard/product");

    } catch (err) {
      console.log(err);
    }
  };

  const handleCategory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category");
      setCategory(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-11 mx-auto">
          <div className="card mt-5">
            <div className="card-body">

              <h3 className="text-center mb-4">{isEdit ? "Update" : "Add"} Product</h3>

              <form onSubmit={handleSubmit} encType="multipart/form-data">


                <div className="row">
                  <div className="col-md-6">
                    <label>Product Name</label>
                    <input type="text" name="name" value={data.name} onChange={handleChange} className="form-control" />
                  </div>

                  <div className="col-md-6">
                    <label>Brand Name</label>
                    <input type="text" name="brandName" value={data.brandName} onChange={handleChange} className="form-control" />
                  </div>
                </div><br />


                <div className="row">
                  <div className="col-md-6">
                    <label>Category</label>
                    <select name="category" value={data.category} onChange={handleChange} className="form-select">
                      <option value="">Select Category</option>
                      {category.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Tag</label>
                    <input type="text" value={data.tag} name="tag" onChange={handleChange} className="form-control" />
                  </div>
                </div><br />


                <div className="row">
                  <div className="col-md-6">
                    <label>Actual Price</label>
                    <input type="number" value={data.actualPrice} name="actualPrice" onChange={handleChange} className="form-control" />
                  </div>

                  <div className="col-md-6">
                    <label>Discount</label>
                    <input type="number" value={data.discount} name="discount" onChange={handleChange} className="form-control" />
                  </div>
                </div><br />


                <div className="row">
                  <div className="col-md-6">
                    <label>Stock</label>
                    <input type="number" value={data.stock} name="stock" onChange={handleChange} className="form-control" />
                  </div>

                  <div className="col-md-6">
                    <label>Stock Status</label>
                    <select
                      name="stockStatus"
                      onChange={handleChange}
                      className="form-select"
                      value={data.stockStatus}
                    >
                      <option value="">Select Status</option>
                      <option value="inStock">In Stock</option>
                      <option value="outOfStock">Out Of Stock</option>
                    </select>
                  </div>
                </div><br />


                <div className="row">
                  <div className="col-md-6">
                    <label>Height</label>
                    <input type="text" value={data.height} name="height" onChange={handleChange} className="form-control" />
                  </div>

                  <div className="col-md-6">
                    <label>Width</label>
                    <input type="text" name="width" value={data.width} onChange={handleChange} className="form-control" />
                  </div>
                </div><br />


                <label>Description</label>
                <textarea name="description" value={data.description} onChange={handleChange} className="form-control" />
                <br />

                <label>Attributes</label>
                <input type="text" value={data.attributes} name="attributes" onChange={handleChange} className="form-control" />
                <br />

                <label>Product Image</label>
                <input type="file" name="picture" onChange={handleChange} className="form-control" />
                <hr />


                <div className="row">
                  <div className="col-md-6">
                    <label>Refund Policy</label><br />
                    <input type="radio" name="refundPolicy" value={data.refundPolicy} onChange={handleChange} /> Yes
                    <input type="radio" name="refundPolicy" value={data.refundPolicy} onChange={handleChange} className="ms-3" /> No
                  </div>

                  <div className="col-md-6">
                    <label>Replacement Policy</label><br />
                    <input type="radio" name="replacementPolicy" value={data.replacementPolicy} onChange={handleChange} /> Yes
                    <input type="radio" name="replacementPolicy" value={data.replacementPolicy} onChange={handleChange} className="ms-3" /> No
                  </div>
                </div><br />

                <div className="row">
                  <div className="col-md-6">
                    <label>Free Delivery</label><br />
                    <input type="radio" name="freeDelivery" value={data.freeDelivery} onChange={handleChange} /> Yes
                    <input type="radio" name="freeDelivery" value={data.freeDelivery} onChange={handleChange} className="ms-3" /> No
                  </div>

                  <div className="col-md-6">
                    <label>Return Policy</label><br />
                    <input type="radio" name="returnPolicy" value={data.returnPolicy} onChange={handleChange} /> Yes
                    <input type="radio" name="returnPolicy" value={data.returnPolicy} onChange={handleChange} className="ms-3" /> No
                  </div>
                </div><br />

                <label>Cash On Delivery</label><br />
                <input type="radio" name="isCod" value={data.isCod} onChange={handleChange} /> Yes
                <input type="radio" name="isCod" value={data.isCod} onChange={handleChange} className="ms-3" /> No

                <br /><br />

                <button className="btn btn-primary w-25 d-block mx-auto">
                  {isEdit ? "Update" : "Add"}  Product
                </button>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;