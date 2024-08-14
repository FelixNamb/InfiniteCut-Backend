const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  motDePasse: String,
  mobile: Number,
  mesRDV: [{ type: mongoose.Schema.Types.ObjectId, ref: "rdvs" }],
  formule: { type: mongoose.Schema.Types.ObjectId, ref: "formules" },
  moyenPaiement: [
    {
      numCarte: Number,
      dateExpiration: Number,
      CVC: Number,
    },
  ],
  salonLike: [{ type: mongoose.Schema.Types.ObjectId, ref: "userPro" }],
  token: String,
});

const User = mongoose.model("users", userSchema);
module.exports = User;
