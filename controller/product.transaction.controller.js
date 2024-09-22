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
  const startdate = req.query.startDate;
  const enddate = req.query.endDate;

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
      filter.transactionstatus = transactionStatus;
    }

    // Add date range filter if both startdate and enddate are provided
    if (startdate && enddate) {
      filter.createdAt = {
        $gte: new Date(startdate),  // greater than or equal to startdate
        $lte: new Date(enddate),    // less than or equal to enddate
      };
    }

    if (deal === "deal") {
      // Aggregate only if deal is set to "deal"
      let products = await productTransactionSchema.aggregate([
        {
          $match: {
            shopid: shopId,
            transactionstatus: parseInt(transactionStatus),
            ...(startdate && enddate && {
              createdAt: {
                $gte: new Date(startdate),
                $lte: new Date(enddate)
              }
            })
          }
        },
        {
          $group: {
            _id: "$productid",
            totalWeight: { $sum: "$weight" },
            totalprice: { $sum: "$transactionprice" },
            transactionstatus: { $first: "$transactionstatus" },
            productname: { $first: "$productname" },
            productid: { $first: "$productid" }
          }
        }
      ]);

      return res.send(products.length > 0 ? products : []);
    } else {
      // Find documents without aggregation if deal is not "deal"
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
  const startdate = req.query.startDate;
  const enddate = req.query.endDate;

  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    let totalPrice = await productTransactionSchema.aggregate([
      {
        $match: {
          shopid: shopId, // Filter by shopid
          ...(startdate && enddate && {
            createdAt: {
              $gte: new Date(startdate),
              $lte: new Date(enddate)
            }
          })
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

    

    const totalBuySell = totalPrice.length > 0 ? totalPrice[0] : {totalBuy:0,totalSell:0};

    return res.json( totalBuySell );
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
let getStockLeft = async (req, res) => {
  const shopId = req.headers["authorization"];

  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    let totalStock = await productTransactionSchema.aggregate([
      {
        $match: {
          shopid: shopId // filter by shop ID, modify as needed
        }
      },
      {
        $group: {
          _id: "$productid",
          productname: { $first: "$productname" }, // get product name
          totalBuyWeight: {
            $sum: {
              $cond: [{ $eq: ["$transactionstatus", 0] }, "$weight", 0]
            }
          },
          totalSellWeight: {
            $sum: {
              $cond: [{ $eq: ["$transactionstatus", 1] }, "$weight", 0]
            }
          },
          totalBuyTransactionPrice: {
            $sum: {
              $cond: [{ $eq: ["$transactionstatus", 0] }, "$transactionprice", 0]
            }
          },
          totalSellTransactionPrice: {
            $sum: {
              $cond: [{ $eq: ["$transactionstatus", 1] }, "$transactionprice", 0]
            }
          },
          productid: { $first: "$productid" } // capture product ID
        }
      },
      {
        $project: {
          _id: 0,
          productname: 1,
          productid: 1, // include product ID in the output
          weightLeftInStock: {
            $subtract: ["$totalBuyWeight", "$totalSellWeight"]
          },
          avgTransactionPriceForStock: {
            $subtract: ["$totalBuyTransactionPrice", "$totalSellTransactionPrice"]
          }
        }
      }
    ]);

    

    const totalStockLeft = totalStock.length > 0 ? totalStock : [];

    return res.json( totalStockLeft );
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
  getTotalBuySellPrice,
  getStockLeft
};
