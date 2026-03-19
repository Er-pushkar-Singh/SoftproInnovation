const bcrypt = require('bcrypt');
const Admin = require('../models/Admin')
const adminSeed = async ()=>{
   const res = await Admin.create({
        name:"Piyush Pal",
        email:"admin@gmail.com",
        password: bcrypt.hash("admin1234")
    })
    console.log(res);
    
}
adminSeed();