const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const Task = require("./models/Task.model");

const bcrypt = require("bcryptjs");
const Freelancer = require("./models/Freelancer.model");

app.post("/api/freelancers/signup", async (req, res) => {
  try {
    const { name, email, password, college, skills, role } = req.body;

    if (!name || !email || !password || !college || !skills || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!["freelancer", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await Freelancer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const freelancer = new Freelancer({
      name,
      email,
      password: hashedPassword,
      college,
      skills,
      role,
    });

    await freelancer.save();

    res.status(201).json({
      id: freelancer._id,
      name: freelancer.name,
      email: freelancer.email,
      role: freelancer.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/api/freelancers/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Freelancer.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    id: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
  });
});

app.get("/api/freelancers", async (req, res) => {
  const freelancers = await Freelancer.find();
  res.json(freelancers);
});

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
