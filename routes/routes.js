
const express=require('express');
const { registerControler, loginControler } = require('../controller/user.contraller');
const { addProduct, getProduct, deleteProduct, updateProduct } = require('../controller/product.controller');
const { addShop, getShop, deleteShop, updateShop } = require('../controller/shop.contraller');
let router=express.Router();

router.post('/register',registerControler);
router.post('/login',loginControler);
router.post('/add-product',addProduct);
router.get('/get-product',getProduct);
router.delete('/delete-product',deleteProduct);
router.patch('/update-product',updateProduct);


router.post('/add-shop',addShop);
router.get('/get-shop',getShop);
router.delete('/delete-shop',deleteShop);
router.patch('/update-shop',updateShop);

module.exports=router
