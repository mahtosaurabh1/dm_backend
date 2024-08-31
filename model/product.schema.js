const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    productprice:{
        type:String,
        required:true
    },
    weight:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('products',productSchema);