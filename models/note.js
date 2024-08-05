const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  etoiles: Number,
  commentaire: String,
  userPro: { type: mongoose.Schema.Types.ObjectId, ref: "userPro" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Note = mongoose.model("notes", noteSchema);


module.exports = Note;