const formuleSchema = mongoose.Schema({
  _id: ObjectId,
  nom: String,
  prix: Number,
  details: {
    passageMax: Number,
    engagement: String,
    shampooing: Boolean,
    coupe: Boolean,
    coiffage: Boolean,
    massage: Boolean,
    barbe: Boolean,
    soinVisage: Boolean,
    epilation: Boolean,
  },
});

const Formule = mongoose.model("formules", formuleSchema);
