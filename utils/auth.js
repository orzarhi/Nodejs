const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.hashPassword = async (value) => {
  const salt = await bcrypt.genSalt();
  value = await bcrypt.hash(value, salt);

  return value;
};

exports.login = async (idTeuda, password) => {
  try {
    const user = await User.findOne({ idTeuda });
    if (user) {
      isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return false;

      return user;
    }
    return false;
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};
