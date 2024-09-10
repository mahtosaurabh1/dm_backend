const productTransactionSchema = require("../model/produt.transaction.schema");

let addproductTransaction = async (req, res) => {
  const { productprice, weight } = req.body;
  let updatedData = {
    ...req.body,
    transactionprice: productprice * weight,
  };
  try {
    let product = new productTransactionSchema(updatedData);
    let result = await product.save();
    result = result.toObject();
    res.send(result);
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};

const updateproductTransaction = async (req, res) => {
  const { productprice, weight } = req.body;
  let updatedData = {
    ...req.body,
    transactionprice: productprice * weight,
  };
  try {
    const productTransactionId = req.body.producttransactionid; // Get the product ID from the request parameters

    // Find the product by ID and update it
    let result = await productTransactionSchema.findByIdAndUpdate(
      productTransactionId,
      updatedData,
      { new: true }
    );

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
  const shopId = req.headers["authorization"];
  const productName = req.query.productname;
  const transactionStatus = req.query.transactionstatus;
  const deal = req.query.deal;

  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }
    let filter = { shopid: shopId };
    if (productName) {
      filter.productname = { $regex: productName, $options: "i" }; // Case-insensitive search
    }
    if (transactionStatus) {
      filter.transactionstatus = transactionStatus; 
    }
    if (deal === "deal") {      
      let products = await productTransactionSchema.aggregate([
        {
          $match:{
            shopid: { $in: [`${shopId}`] }, 
            transactionstatus:parseInt(transactionStatus)
          }
        },
         {
          $group: {
             _id: "$productid",    
            totalWeight: { $sum: "$weight" },
            totalprice:{$sum:"$transactionprice"},
            transactionstatus: { $first: "$transactionstatus" },
            productname:{$first:"$productname"},
            productid:{$first:"$productid"}
          }}
      ]);

      return res.send(products.length > 0 ? products : []);
    } else {
      // Handle the regular product fetch logic
      let products = await productTransactionSchema.find(filter);
      return res.send(products.length > 0 ? products : []);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

let getTotalBuySellPrice = async (req, res) => {
  const shopId = req.headers["authorization"];

  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    let totalPrice = await productTransactionSchema.aggregate([
      {
        $match: {
          shopid: shopId // Filter by shopid
        }
      },
      {
        $group: {
          _id: null, // No grouping by a specific field
          totalBuy: {
            $sum: {
              $cond: [{ $eq: ["$transactionstatus", 0] }, "$transactionprice", 0]
            }
          },
          totalSell: {
            $sum: {
              $cond: [{ $eq: ["$transactionstatus", 1] }, "$transactionprice", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          totalBuy: 1,
          totalSell: 1
        }
      }
    ]);

    

    const totalBuySell = totalPrice.length > 0 ? totalPrice[0] : 0;

    return res.json( totalBuySell );
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

let deleteproductTransaction = async (req, res) => {
  try {
    const result = await productTransactionSchema.deleteOne({
      _id: req.query.producttransactionid,
    });
    res.send(result);
  } catch {
    res.status(500).json({ result: "Internal server error" });
  }
};

module.exports = {
  addproductTransaction,
  getproductTransaction,
  deleteproductTransaction,
  updateproductTransaction,
  getTotalBuySellPrice
};
