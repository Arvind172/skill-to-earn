const mongoose =require("mongoose");
const FreelancerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: [String], required: true },
    college: { type: String, required: true },
    role: { type: String, required: true,default:"freelancer" },
    bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Freelancer", FreelancerSchema);