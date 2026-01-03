const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
    applicants: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);