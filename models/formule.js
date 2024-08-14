const mongoose = require('mongoose');

const formuleSchema = mongoose.Schema({
  nom: String,
  prix: String,
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

module.exports = Formule;