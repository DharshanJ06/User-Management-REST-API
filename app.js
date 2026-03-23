const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
app.use(express.json());

// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/userdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


// GET user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: "Invalid ID" });
  }
});


// POST create user
app.post("/users", async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      age,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User created",
      user
    });

  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});


// PUT update user
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);

  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});


// DELETE user
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted",
      deletedUser
    });

  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));




























