const rdvSchema = mongoose.Schema({
  _id: ObjectifId,
  date: Date,
  userPro: { type: mongoose.Schema.Types.ObjectiId, ref: "userPro" },
  durée: String,
});

const Rdv = mongoose.model("rdvs", rdvSchema);
