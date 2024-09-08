const express = require("express");
const {
  registerControler,
  loginControler,
} = require("../controller/user.contraller");
const {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/product.controller");
const {
  addShop,
  getShop,
  deleteShop,
  updateShop,
} = require("../controller/shop.contraller");
const {
  getproductTransaction,
  deleteproductTransaction,
  updateproductTransaction,
  addproductTransaction,
} = require("../controller/product.transaction.controller");
const { addExpenses, getExpenses, deleteExpenses, updateExpenses } = require("../controller/expenses.controller");
let router = express.Router();

router.post("/register", registerControler);
router.post("/login", loginControler);
router.post("/add-product", addProduct);
router.get("/get-product", getProduct);
router.delete("/delete-product", deleteProduct);
router.patch("/update-product", updateProduct);

router.post("/add-shop", addShop);
router.get("/get-shop", getShop);
router.delete("/delete-shop", deleteShop);
router.patch("/update-shop", updateShop);

router.post("/addProductTransaction", addproductTransaction);
router.get("/getProductTransaction", getproductTransaction);
router.delete("/deleteProductTransaction", deleteproductTransaction);
router.patch("/updateProductTransaction", updateproductTransaction);

router.post("/addexpenses", addExpenses);
router.get("/getexpenses", getExpenses);
router.delete("/deleteexpenses", deleteExpenses);
router.patch("/updateExpanses", updateExpenses);

module.exports = router;
