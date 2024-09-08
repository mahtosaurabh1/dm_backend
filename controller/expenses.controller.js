const Expenses = require("../model/expenses.schema");

let addExpenses = async (req, res) => {
  try {
    let expenses = new Expenses(req.body);
    let result = await expenses.save();
    result = result.toObject();
    res.send(result);
  } catch (error) {
    res.status(500).json({ result: "Internal server error" });
  }
};

const updateExpenses = async (req, res) => {
  try {
    const expensesid = req.body.expensesid; // Get the product ID from the request parameters
    const updatedData = req.body; // Get the updated product data from the request body

    // Find the product by ID and update it
    let result = await Expenses.findByIdAndUpdate(expensesid, updatedData, {
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

let getExpenses = async (req, res) => {
  const shopId = req.headers['authorization'];
  const expensesname = req.query.expensesname;
  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    let filter = { shopid: shopId };

    if (expensesname) {
      filter.expensesname = { $regex: expensesname, $options: "i" }; // Case-insensitive search
    }
    let expenses = await Expenses.find(filter);

    if (expenses.length > 0) {
      res.send(expenses);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};


let deleteExpenses = async (req, res) => {
  try {
    const result = await Expenses.deleteOne({ _id: req.query.expensesid });
    res.send(result);
  } catch {
    res.status(500).json({ result: "Internal server error" });
  }
};

module.exports = {
  addExpenses,
  getExpenses,
  deleteExpenses,
  updateExpenses,
};
