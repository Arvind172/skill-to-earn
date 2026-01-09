const mongoose =require("mongoose");
const FreelancerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: [String] },
    college: { type: String },
    role: { type: String, required: true,default:"freelancer" },
    company: { type: String },
    bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Freelancer", FreelancerSchema);