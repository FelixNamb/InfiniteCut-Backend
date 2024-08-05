const noteSchema = mongoose.Schema({
  _id: ObjectifId,
  etoiles: Number,
  commentaire: String,
  userPro: { type: mongoose.Schema.Types.ObjectiId, ref: "userPro" },
  user: { type: mongoose.Schema.Types.ObjectiId, ref: "user" },
});

const Note = mongoose.model("notes", noteSchema);
