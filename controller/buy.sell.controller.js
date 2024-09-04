const BuySellSchema = require("../model/buy.sell.schema");

let addBuySellProduct = async (req, res) => {
  try {
    let product = new BuySellSchema(req.body);
    let result = await product.save();
    result = result.toObject();
    res.send(result);
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};

const updateBuySellProduct = async (req, res) => {
  try {
    const bsid = req.body.bsid; // Get the product ID from the request parameters
    const updatedData = req.body; // Get the updated product data from the request body

    // Find the product by ID and update it
    let result = await BuySellSchema.findByIdAndUpdate(bsid, updatedData, { new: true });

    if (!result) {
      return res.status(404).json({ result: "Product not found" });
    }

    result = result.toObject();
    res.send(result);
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};


let getBuySellProduct = async (req, res) => {
  const shopId = req.query.shopid
  try {
    if (!shopId) {
      return res.status(400).json([]);
    }
    let bsData = await BuySellSchema.find({ shopid: shopId });
    if (bsData.length > 0) {
      res.send(bsData);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json([]);
  }
};


let deleteBuySellProduct = async (req, res) => {
  try {
    const result = await BuySellSchema.deleteOne({ _id: req.query.bsid });
    res.send(result);
  } catch {
    res.status(500).json({ result: "Internal server error" });
  }
};

module.exports = {
  addBuySellProduct,
  getBuySellProduct,
  deleteBuySellProduct,
  updateBuySellProduct
};
