const mongoose = require('mongoose');

const formuleSchema = mongoose.Schema({
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
