
const express=require('express');
const { registerControler, loginControler } = require('../controller/user.contraller');
const { addProduct, getProduct, deleteProduct, updateProduct } = require('../controller/product.controller');
let router=express.Router();

router.post('/register',registerControler);
router.post('/login',loginControler);
router.post('/add-product',addProduct);
router.get('/get-product',getProduct);
router.delete('/delete-product',deleteProduct);
router.patch('/update-product',updateProduct)

module.exports=router
