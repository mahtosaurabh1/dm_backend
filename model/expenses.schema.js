const mongoose=require('mongoose');

const expensesSchema=new mongoose.Schema({
    expensesname:{
        type:String,
        required:true
    },
    expensesprice:{
        type:Number,
        required:true
    },
    shopid:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('expenses',expensesSchema);