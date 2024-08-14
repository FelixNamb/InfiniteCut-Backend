var express = require("express");
var router = express.Router();

require("../models/connection");
const Rdv = require("../models/rdv");
const { checkBody } = require("../module/checkBody");
const User = require("../models/user");

router.get("/", (req, res) => {
  User.find({}).then((data) => {
    res.json({ result: true, rdvs: data });
  });
});

router.post("/", (req, res) => {
  if (!checkBody(req.body, ["date", "ObjectId", "plageHoraire"])) {
    res.json({ result: false, error: "Veuillez saisir votre retour" });
    return;
  }
  Rdv.findOne({
    date: req.body.date,
    userPro: req.body.ObjectId,
    plageHoraire: req.body.plageHoraire,
  }).then((data) => {
    if (data === null) {
      const newRdv = new Rdv({
        date: req.body.date,
        userPro: req.body.ObjectId,
        plageHoraire: req.body.plageHoraire,
      });
      newRdv.save().then(() => {
        res.json({ result: true });
      });
    } else {
      res.json({ result: false, error: "Retour déjà envoyé." });
    }
  });
});

router.delete("/", (req, res) => {
  console.log(req.body);

  if (!checkBody(req.body, ["date", "ObjectId", "plageHoraire"])) {
    res.json({ result: false, error: "Aucun rendez-vous trouvé" });
    return;
  }

  // Recherche d'abord si l'entrée existe
  Rdv.findOne({
    date: new Date(req.body.date),
    plageHoraire: req.body.plageHoraire,
    userPro: req.body.ObjectId,
  })
    .then((data) => {
      if (data) {
        console.log("Entrée trouvée :", data);
        // Si l'entrée existe, on passe à la suppression
        return Rdv.deleteOne({
          date: req.body.date,
          plageHoraire: req.body.plageHoraire,
          userPro: req.body.ObjectId,
        });
      } else {
        res.json({ error: "Aucun rendez-vous correspondant trouvé à effacer" });
        throw new Error("Entrée non trouvée"); // Arrête le processus si aucune entrée trouvée
      }
    })
    .then((deleteResult) => {
      if (deleteResult && deleteResult.deletedCount > 0) {
        res.json({ message: "Rendez-vous bien effacé" });
      } else {
        res.json({ error: "Aucun rendez-vous trouvé à effacer" });
      }
    })
    .catch((err) => {
      if (err.message !== "Entrée non trouvée") {
        res.json({
          result: false,
          error: "Erreur lors de la suppression",
          details: err,
        });
      }
    });
});

module.exports = router;
