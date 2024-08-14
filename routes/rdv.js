var express = require("express");
var router = express.Router();

require("../models/connection");
const Rdv = require("../models/rdv");
const { checkBody } = require("../module/checkBody");
const User = require("../models/user");

router.get("/rdvs", (req, res) => {
  User.find({}).then((data) => {
    res.json({ result: true, rdvs: data });
  });
});

router.post("/rdvs", (req, res) => {
  User.findOne({ token: req.body.token })
    .then((data) => {
      if (data === null) {
        User.findOne({ email: req.body.token })
          .then((userPro) => {
            if (userPro === null) {
              res.json({ result: false, error: "Compte pro inconnu" });
            } else {
              console.log(userPro);
              // const newRdv = new Rdv({
              //   date: req.body.date,
              //   userPro: ObjectId,
              //   plageHoraire: req.body.plageHoraire,
              // });
              // newRdv
              //   .save()
              //   .then(() => {
              //     res.json({ result: true });
              //   })
              // .catch((err) => {
              //   res.json({
              //     result: false,
              //     error: "Le rendez-vous n'a pas pu être enregistré",
              //     details: err,
              //   });
              // });
            }
          })
          .catch((err) => {
            res.json({
              result: false,
              error: "Compte pro inconnu.",
              details: err,
            });
          });
      } else {
        res.json({ result: false, error: "Retour déjà envoyé." });
      }
    })
    .catch((err) => {
      res.json({ result: false, error: "Utilisateur inconnu", details: err });
    });
});

router.put("/rdvs", (req, res) => {
  Rdv.updateOne({ _id: req.body.id }, { $set: { date: req.body.date } }).then(
    (data) => {
      if (data) {
        Rdv.findOne({ _id: req.body.id }).then(res.json({ result: true }));
      } else {
        res.json({
          result: false,
          error: "Aucune modification effectuée",
        });
      }
    }
  );
});

module.exports = router;
