require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

mongoose.set("strictQuery", false);
mongoose.connect(url);

//SAVING TO DB
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
