var express = require("express");
var router = express.Router();

const Formule = require("../models/formule");

router.get("/", (req, res) => {
  const { email } = req.body;

  Formule.find({}).then((data) => {
    //objet vide pour prendre tous les documents à l'interieur
    if (data) {
      res.json({ result: true, formule: data });
    } else {
      res.json({ result: false, error: "Pas de formules trouvées" });
    }
    res.json({ result: true, formule: data.formule });
  });
});

module.exports = router;
