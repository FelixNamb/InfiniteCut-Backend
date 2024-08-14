var express = require("express");
var router = express.Router();

require("../models/connection");
const Rdv = require("../models/rdv");
const User= require("../models/user")
const { checkBody } = require("../module/checkBody");

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
  Rdv.findOne({date: req.body.date, userPro: req.body.ObjectId, plageHoraire : req.body.plageHoraire})
  .then((data) => {
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

// router.put("/", (req, res) => {
//   Rdv.updateOne({ _id: req.body.id }, { $set: { date: req.body.date } }).then(
//     (data) => {
//       if (data) {
//         Rdv.findOne({ _id: req.body.id }).then(res.json({ result: true }));
//       } else {
//         res.json({
//           result: false,
//           error: "Aucune modification effectuée",
//         });
//       }
//     }
//   );
// });

module.exports = router;
