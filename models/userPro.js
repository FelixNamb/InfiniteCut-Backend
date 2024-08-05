const userProSchema = mongoose.Schema({
  _id: ObjectiId,
  prenom: String,
  nom: String,
  codePostal: Number,
  mobile: Number,
  email: String,
  mesRdv: { type: mongoose.Schema.Types.ObjectiId, ref: "rdv" },
  mesNotes: { type: mongoose.Schema.Types.ObjectiId, ref: "notes" },
  noteGlobale: Number,
  formules: { type: mongoose.Schema.Types.ObjectiId, ref: "formules" },
  vente: Boolean,
  image: String,
});

const userPro = mongoose.model("userPro", userProSchema);
module.exports = userPro;
