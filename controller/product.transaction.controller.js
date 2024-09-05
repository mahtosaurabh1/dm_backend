const productTransactionSchema = require("../model/produt.transaction.schema");

let addproductTransaction = async (req, res) => {
  try {
    let product = new productTransactionSchema(req.body);
    let result = await product.save();
    result = result.toObject();
    res.send(result);
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};

const updateproductTransaction = async (req, res) => {
  try {
    const productTransactionId = req.body.producttransactionid; // Get the product ID from the request parameters
    const updatedData = req.body; // Get the updated product data from the request body

    // Find the product by ID and update it
    let result = await productTransactionSchema.findByIdAndUpdate(productTransactionId, updatedData, { new: true });

    if (!result) {
      return res.status(404).json({ result: "Product not found" });
    }

    result = result.toObject();
    res.send(result);
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};


let getproductTransaction = async (req, res) => {
  const shopId = req.headers['authorization'];
  const productName = req.query.productname;
  const transactionStatus = req.query.transactionstatus;

  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    let filter = { shopid: shopId };

    // Add product name filter if provided
    if (productName) {
      filter.productname = { $regex: productName, $options: "i" }; // Case-insensitive search
    }

    // Add transaction status filter if provided
    if (transactionStatus) {
      filter.transactionstatus = transactionStatus; // Assuming transactionstatus is stored as a string in the database
    }

    let products = await productTransactionSchema.find(filter);

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



let deleteproductTransaction = async (req, res) => {
  try {
    const result = await productTransactionSchema.deleteOne({ _id: req.query.producttransactionid });
    res.send(result);
  } catch {
    res.status(500).json({ result: "Internal server error" });
  }
};

module.exports = {
  addproductTransaction,
  getproductTransaction,
  deleteproductTransaction,
  updateproductTransaction
};
