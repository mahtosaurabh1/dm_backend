const mongoose=require('mongoose');

const shopSchema=new mongoose.Schema({
    shopname:{
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

module.exports=mongoose.model('shops',shopSchema);