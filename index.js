const express=require('express');
const app=express();
const router = require('./routes/routes');
let cors=require('cors')

require('./config/db');
app.use(express.json())
app.use(cors());
app.use('/',router);


const PORT=process.env.PORT || 5000 ;
app.listen(PORT,()=>{
    console.log(`app listining on ${PORT}`);
})
