const mongoose=require('mongoose');

const productTransactionSchema=new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    productprice:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    productid:{
        type:String,
        required:true
    },
    shopid:{
        type:String,
        required:true
    },
    transactionstatus:{
        type:Number,
        required:true
    },
    transactionprice:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('producttransaction',productTransactionSchema);