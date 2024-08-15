var express = require("express");
var router = express.Router();

require("../models/connection");
const Rdv = require("../models/rdv");
const { checkBody } = require("../module/checkBody");
const User = require("../models/user");
const UserPro = require("../models/userPro");

router.get("/getrdv/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .populate("mesRDV")
    .populate("formule")
    .then((data) => {
      res.json({ result: true, rdvs: data });
    });
});

router.get("/:token", (req, res) => {
  console.log("req.params", req.params);
  UserPro.findOne({ _id: req.params.userProId }).then((data) =>
    console.log("userPro infos", data)
  );

  Rdv.find({}).then((data) => {
    res.json({ result: true, rdvs: data });
  });
});

router.get("/:idUserPro", (req, res) => {
  Rdv.find({ userPro: req.params.idUserPro })
    .populate("userPro")
    .then((data) => {
      if (data.length >= 1) {
        res.json({ result: true, data });
      } else {
        res.json({ result: false });
      }
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
        res.json({ result: true, newRdv: newRdv });
      });
    } else {
      res.json({ result: false, error: "Retour déjà envoyé." });
    }
  });
});

router.get("/searchid/:id", (req, res) => {
  Rdv.findOne({ _id: req.params.id })
    .populate("userPro")
    .then((data) => {
      if (data) {
        res.json({ result: true, rdv: data });
      } else {
        res.json({ result: false });
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
  Rdv.deleteOne({
    date: new Date(req.body.date),
    plageHoraire: req.body.plageHoraire,
    userPro: req.body.ObjectId,
  })
    .then((data) => {
      console.log(data);
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
