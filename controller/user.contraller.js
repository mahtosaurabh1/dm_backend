const User = require("../model/users.schema");

const registerControler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ result: "Email is required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ result: "User already registered" });
    }
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    const { password, ...userWithoutPassword } = result;
    res.status(200).json(userWithoutPassword); 
  } catch (error) {
    res.send(500).json({ result: "Internal server error" });
  }
};

const loginControler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ result: "Email and password are required" });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ result: "User not found" });
    }
    const data={
      createdAt:user?.createdAt,
      email:user?.email,
      fullname:user?.fullname,
      _id:user?._id,
    }
    return res.status(200).json( data );
  } catch (error) {
    return res.status(500).json({ result: "Internal server error" });
  }
};

module.exports = {
  registerControler,
  loginControler,
};
