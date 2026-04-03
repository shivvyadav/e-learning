// const User = require("../../../models/User")
const User = require("../../../models/User")
const bcrypt = require("bcryptjs")


exports.getmyprofile = async(req,res)=>{
    const userId = req.user.id 
    const myprofile = await User.findById(userId)
    res.status(200).json({
        data:myprofile,
        message:"profile fetched successfully"
    })
}

exports.updatemyprofile = async(req,res)=>{
    const {username,useremail,userphonenumber}= req.body 
    const userId = req.user.id 
    const updatedata = await User.findByIdAndUpdate(userId,{username,useremail,userphonenumber},{
        runValidators:true,
        new:true
    })
    res.status(200).json({
        message:"profile  updated successfully",
        data:updatedata
    })
}

exports.deletemyprofile = async(req,res)=>{
    const userId = req.user.id 
    await User.findByIdAndDelete(userId)
    res.status(200).json({
       message:"profile deleted successfully",
       data:null
    })
}

exports.updatemypass=async(req,res)=>{
    const userId =req.user.id
    const{oldpassword,newpassword,confirmpassword} =req.body 
    if(!oldpassword || !newpassword ||!confirmpassword){
        return res.status(400).json({
            message:"please provide oldpassword,newpassword,confirmpassword"
        })
    }
    if(newpassword !==confirmpassword){
        return res.staust(400).json({
            message:"newpassword and confirmpassowrd didnot matched"
        })
    }
    //taking out the hash of the old password 
    const userdata=await User.findById(userId)
    const hasholdpassword=userdata.userpassword

    //check if oldpassword is correct ot not
    const isoldpasswordcorrect=await bcrypt.compareSync(oldpassword,hasholdpassword)
    if(!isoldpasswordcorrect){
        return res.status(400).json({
            message:"oldpassword didnot matched"
        })
    }

    //matched vayo vane
    userdata.userpassword=bcrypt.hashSync(newpassword,12)
    await userdata.save()
    res.status(200).json({
        message:"password changed successfully"
    })
}



