const mongoose = require("mongoose");

// require("dotenv").config();

const connection = mongoose.connect("mongodb+srv://raghuvanshi:raghuvanshi@cluster0.pd5wkd1.mongodb.net/chat-application");

module.exports = { connection };