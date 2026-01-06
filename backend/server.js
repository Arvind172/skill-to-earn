const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const Freelancer = require("./models/Freelancer.model");
const Task = require("./models/Task.model");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function role(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

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

    const token = jwt.sign(
      { id: freelancer._id, role: freelancer.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        id: freelancer._id,
        name: freelancer.name,
        email: freelancer.email,
        role: freelancer.role,
      },
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

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
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

app.post("/api/tasks", auth, role("recruiter"), async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

app.post("/api/tasks/:id/apply", auth, role("freelancer"), async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const alreadyApplied = task.applicants.some(
    (applicantId) => applicantId.toString() === req.user.id
  );

  if (alreadyApplied) {
    return res.status(400).json({ message: "Already applied" });
  }

  task.applicants.push(req.user.id);
  await task.save();

  res.json({ message: "Application successful" });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
