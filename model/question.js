const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  Question: { type: String },
  option1: { type: String },
  option2: { type: String },
  option3: { type: String },
  Answer:{ type: String },
});

module.exports = mongoose.model("quizAppquestion", questionSchema);