const mongoose = require('mongoose')

const userProSchema = mongoose.Schema({
  prenom: String,
  nom: String,
  codePostal: Number,
  mobile: Number,
  email: String,
  token: String,
  adresse: String,
  motDePasse: String,
  rdvs: [{ type: mongoose.Schema.Types.ObjectId, ref: "rdvs" }],
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "notes" }],
  noteGlobale: Number,
  formules: [{ type: mongoose.Schema.Types.ObjectId, ref: "formules" }],
  vente: Boolean,
  image: String,
});

const UserPro = mongoose.model("userpros", userProSchema);

module.exports = UserPro;
