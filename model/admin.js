const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    Role:{ type: String, default: null },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
});

module.exports = mongoose.model("quizappadmin", adminSchema);