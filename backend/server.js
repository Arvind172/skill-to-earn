const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const Freelancer = require("./models/Freelancer.model");
const Task = require("./models/Task.model");
const Chat = require("./models/Chat.model");

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
    const { name, email, password, college, skills, role,bio } = req.body;

    if (!name || !email || !password || !college || !skills || !role || !bio) {
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
      bio,
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
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
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

app.get("/api/recruiter/tasks", auth, role("recruiter"), async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.id }).populate(
    "applicants",
    "name email"
  );

  res.json(tasks);
});
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.post("/api/chats/start", auth, async (req, res) => {
  const { taskId, freelancerId } = req.body;

  const chat = await Chat.findOne({
    task: taskId,
    recruiter: req.user.id,
    freelancer: freelancerId,
  });

  if (chat) {
    return res.json(chat);
  }

  const newChat = new Chat({
    task: taskId,
    recruiter: req.user.id,
    freelancer: freelancerId,
    messages: [],
  });

  await newChat.save();
  res.json(newChat);
});

app.get("/api/chats/:id", auth, async (req, res) => {
  const chat = await Chat.findById(req.params.id).populate(
    "messages.sender",
    "name"
  );

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

 
  if (
    chat.recruiter.toString() !== req.user.id &&
    chat.freelancer.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(chat);
});

io.on("connection", (socket) => {
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", async ({ chatId, senderId, text }) => {
    const chat = await Chat.findById(chatId);
    if (!chat) return;

    const isParticipant =
      chat.recruiter.toString() === senderId ||
      chat.freelancer.toString() === senderId;

    if (!isParticipant) return;

    chat.messages.push({ sender: senderId, text });
    await chat.save();

    io.to(chatId).emit("newMessage", {
      sender: senderId,
      text,
      createdAt: new Date(),
    });
  });
});
app.get("/api/freelancer/chats", auth, role("freelancer"), async (req, res) => {
  const chats = await Chat.find({
    freelancer: req.user.id,
  })
    .populate("task", "title")
    .populate("recruiter", "name email")
    .sort({ updatedAt: -1 });

  res.json(chats);
});
app.get("/api/recruiter/chats", auth, role("recruiter"), async (req, res) => {
  try {
    const chats = await Chat.find({
      recruiter: req.user.id,
    })
      .populate("task", "title")
      .populate("freelancer", "name email")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
});
app.get(
  "/api/freelancer/applied-tasks",
  auth,
  role("freelancer"),
  async (req, res) => {
    try {
      const tasks = await Task.find({
        applicants: req.user.id,
      }).populate("createdBy", "name email");

      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch applied tasks" });
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
