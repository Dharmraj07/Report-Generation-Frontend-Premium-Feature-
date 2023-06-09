const Razorpay = require("razorpay");
const authenticateUser = require("../middlewares/authenticateUser");
const User = require("../models/users");
require("dotenv").config();

const instance = new Razorpay({
  key_id: process.env.raz_keyid,
  key_secret: process.env.raz_secret,
});

async function createPayment(req, res) {
  const { amount } = req.body;

  const userId = req.user.id;

  try {
    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    });

    const user = await User.findByPk(userId);

    user.isPremium = true;
    await user.save();

    res.status(201).json({
      success: true,
      order,
      amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Payment failed",
    });
  }
}

module.exports = createPayment;
