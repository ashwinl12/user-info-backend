const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    dob: String,
    email: String,
    mobile: String
});

const userModel = mongoose.model("post", userSchema);
module.exports = userModel;