const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const findedUser = await User.findOne({ email });
  if (findedUser) {
    return res.status(400).json({ msg: "User already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ msg: err });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User does not exist" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
   
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {httpOnly:true, maxAge: 1000 * 60 * 60 * 24});
    res.status(200).json({user,accessToken});
  } else {
    return res.status(400).json({ msg: "Password is incorrect" });
  }
};

module.exports = {
    register,
    login
}