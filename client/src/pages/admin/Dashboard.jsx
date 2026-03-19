import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Dashboard = () => {
    return (
        <>

            <div className="container-fluid">
                {/* .......................top bar start................. */}
                <div className="row">
                    <div className="col-sm-2  bg-warning h-100 vh-100">
                        <li>Dashboard</li>
                        <ul>
                            <li className='py-2'>
                                <Link to='category'><i className="bi bi-tags"></i> Category Management</Link>
                            </li>
                            <li className='py-2'>
                                <Link to='orders'><i className="bi bi-cart"></i> Order Management</Link>
                            </li>
                            <li className='py-2'>
                                <Link to='product'><i className="bi bi-box"></i> Product Management</Link>
                            </li>
                            <li className='py-2'>
                                <Link to='users '><i className="bi bi-people"></i> Users Management</Link>
                            </li>
                            <li className='py-2'>
                                <Link to='complaint '><i className="bi bi-chat-dots"></i> Complaint Management</Link>
                            </li>
                            <li className='py-2'>
                                <Link to='inventory '><i className="bi bi-archive"></i> Inventory Management</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-sm-10 vh-100">
                         <div className=" topbar ">

                                    <div className="dropdown profile-dropdown">
                                    
                                        <Link to='#' className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
                                            data-bs-toggle="dropdown">
                                            <i className="bi bi-person-circle fs-4 me-2"></i>
                                            Admin
                                        </Link>
                                        <ul className="dropdown-menu dropdown-menu-end shadow">
                                            <li><Link to='#' className="dropdown-item">Change Password</Link></li>
                                            <li><Link to='#' className="dropdown-item text-danger">Logout</Link></li>
                                        </ul>
                                    </div>

                                </div>
                                  {/* main contant start */}
                            <div className="row">
                                <div className="col-sm-12 w-100 vh-100">
                                    <Outlet />
                                </div>
                            </div>
                            {/* main contant end */}
                        
                    </div>
                </div>
                {/* .......................top bar end................... */}
            </div>
        </>
    )
}

export default Dashboard