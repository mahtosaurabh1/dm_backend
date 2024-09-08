const Shop = require("../model/shop.schema");

let addShop = async (req, res) => {
  const { shopname } = req.body;
  try {
    const existingShop = await Shop.findOne({ shopname });
    if (existingShop) {
      return res.status(409).json({ result: "Product already existed" });
    }else{
      let shop = new Shop(req.body);
      let result = await shop.save();
      result = result.toObject();
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};

const updateShop = async (req, res) => {
  try {
    const shopid = req.body.shopid; // Get the product ID from the request parameters
    const updatedData = req.body; // Get the updated product data from the request body
    let result = await Shop.findByIdAndUpdate(shopid, updatedData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ result: "Shop not found" });
    }

    result = result.toObject();
    res.send(result);
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};

let getShop = async (req, res) => {
  const userId = req.query.userid;
  try {
    if (!userId) {
      return res.status(400).json([]);
    }
    let products = await Shop.find({ userid: userId });

    if (products.length > 0) {
      res.send(products);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).json([]);
  }
};

let deleteShop = async (req, res) => {
  try {
    const result = await Shop.deleteOne({ _id: req.query.shopid });
    res.send(result);
  } catch {
    res.status(500).json({ result: "Internal server error" });
  }
};

module.exports = {
  addShop,
  getShop,
  deleteShop,
  updateShop,
};
