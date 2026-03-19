const User = require("./src/models/User")
const bcrypt = require("bcryptjs")


const adminseeder = async()=>{
    const doesAdminexist = await User.findOne({useremail:"admin123@gmail.com"})
    if(!doesAdminexist){
     await User.create({
        useremail:"admin123@gmail.com",
        userpassword:bcrypt.hashSync("admin",10),
        userphonenumber:"9804652376",
        username:"admin",
        role:"admin"
     })
     console.log("admin seeded successfully")
    }else{
        console.log("admin already seeded")
    }
}
module.exports = adminseeder