const mongoose=require('mongoose');

let userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('users',userSchema);