var express = require("express");
var router = express.Router();

const Formule = require("../models/formule");

//La route GET /:nom permet de récupérer une formule par son nom et de la redonner
router.get("/:nom", (req, res) => {
  Formule.findOne({ nom: req.params.nom }).then((data) => {
    if (data) {
      res.json({ result: true, formule: data });//Si on a bien trouvé une formule de ce nom dans la base de données
    } else {
      res.json({ result: false, error: "Pas de formules trouvées" }); //Si aucune formules dans la base de données ne possède ce nom
    }
  });
});

module.exports = router;
