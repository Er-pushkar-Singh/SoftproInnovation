import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import axios from 'axios'


const Adminlogin = () => {
    const navigate = useNavigate();
    const [data,setData] = useState({
        email:"",
        password:""
    })
    const handleChange = (e)=>{
        setData(()=>({...data,[e.target.name]:e.target.value}));
    }
    const handlSubmit = async (e)=>{
        e.preventDefault();
        console.log(data);
        
        const res = await axios.post("http://localhost:5000/api/admin/login",data)
        if(res.data.msg=="Login Successfully"){
            localStorage.setItem("id",res.data.id)
            localStorage.setItem("token",res.data.token)
            navigate('/admin/dashboard')
        }
        else{
            alert(res.data.msg);
        }
    }
    return (
        <>
            <div className="row">
                <div className="col-sm-8 mx-auto bg-primary m-5 boder">
                    <div className="row ">
                        <div className="col-sm-6 "></div>
                        <div className="col-sm-6 p-0">
                           
                            <div className="card" >
                                <div className="card-body">
                                     <h1>Admin login</h1>
                                    <form method='post' onSubmit={handlSubmit}>
                                        <label htmlFor=""> email</label>
                                        <br />
                                        <input type="email" id='email' name="email" placeholder='Enter email id' onChange={handleChange} />
                                        <br />
                                        <label htmlFor=""> Password</label>
                                        <br />
                                        <input type="password" id='password' name='password' placeholder='Enter password' onChange={handleChange} />
                                        <br />
                                        <input type="submit" value='login' />
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Adminlogin