const mongoose = require('mongoose')

const rdvSchema = mongoose.Schema({
  date: Date,
  userPro: { type: mongoose.Schema.Types.ObjectiId, ref: "userPro" },
  durée: String,
});

const Rdv = mongoose.model("rdvs", rdvSchema);

module.exports = Rdv;
