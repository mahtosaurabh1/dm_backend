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
  const shopId = req.headers["authorization"];
  const expensesname = req.query.expensesname;
  const startdate = req.query.startDate;
  const enddate = req.query.endDate;
  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    let filter = { shopid: shopId };

    if (expensesname) {
      filter.expensesname = { $regex: expensesname, $options: "i" }; // Case-insensitive search
    }
    if (startdate && enddate) {
      filter.createdAt = {
        $gte: new Date(startdate), // greater than or equal to startdate
        $lte: new Date(enddate), // less than or equal to enddate
      };
    }

    let expenses = await Expenses.find(filter);

    if (expenses.length > 0) {
      res.send(expenses);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getTotalExpenses = async (req, res) => {
  const shopId = req.headers["authorization"];
  const startdate = req.query.startDate;
  const enddate = req.query.endDate;

  try {
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    let expenses = await Expenses.aggregate([
      {
        $match: {
          shopid: shopId, // Filter by shopid
          ...(startdate && enddate && {
            createdAt: {
              $gte: new Date(startdate),
              $lte: new Date(enddate)
            }
          })
        },
      },
      {
        $group: {
          _id: null, // No need to group by any field
          totalExpenses: { $sum: "$expensesprice" }, // Sum the expensesprice field
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the output
          totalExpenses: 1, // Include totalExpenses in the output
        },
      },
    ]);

    const totalExpenses = expenses.length > 0 ? expenses[0].totalExpenses : 0;

    return res.json({ totalExpenses });
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
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
  getTotalExpenses,
};
