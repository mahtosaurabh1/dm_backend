const mongoose=require('mongoose');

const BuySellSchema=new mongoose.Schema({
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
    productid:{
        type:String,
        required:true
    },
    shopid:{
        type:String,
        required:true
    },
    transactionstatus:{
        type:Boolean,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('buySellProducts',BuySellSchema);