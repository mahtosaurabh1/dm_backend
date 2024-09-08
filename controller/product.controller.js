const Product = require("../model/product.schema");

let addProduct = async (req, res) => {
  const {productname}=req.body;
  try {
    const existingProduct = await Product.findOne({ productname });
    if (existingProduct) {
      return res.status(409).json({ result: "Product already existed" });
    }else{
      let product = new Product(req.body);
      let result = await product.save();
      result = result.toObject();
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.body.productid; // Get the product ID from the request parameters
    const updatedData = req.body; // Get the updated product data from the request body

    // Find the product by ID and update it
    let result = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ result: "Product not found" });
    }

    result = result.toObject();
    res.send(result);
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};

let getProduct = async (req, res) => {
  const shopId = req.headers['authorization'];
  const productName = req.query.productname;
  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    let filter = { shopid: shopId };

    if (productName) {
      filter.productname = { $regex: productName, $options: "i" }; // Case-insensitive search
    }
    let products = await Product.find(filter);

    if (products.length > 0) {
      res.send(products);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};


let deleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.query.productid });
    res.send(result);
  } catch {
    res.status(500).json({ result: "Internal server error" });
  }
};

module.exports = {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
};
