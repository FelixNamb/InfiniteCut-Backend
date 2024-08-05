var express = require("express");
var router = express.Router();

require("../models/connection");
const Rdv = require("../models/rdv");
const { checkBody } = require("../module/checkBody");

router.get("/rdvs", (req, res) => {
  User.find({}).then((data) => {
    res.json({ result: true, rdvs: data });
  });
});

router.post("/rdvs", (req, res) => {
  if (!checkBody(req.body, ["date", "ObjectId", "duree", "token"])) {
    res.json({ result: false, error: "Veuillez saisir votre retour" });
    return;
  }
  User.findOne({ token: req.body.token }).then((data) => {
    if (data === null) {
      const newRdv = new Rdv({
        date: req.body.date,
        userPro: ObjectId,
        duree: req.body.duree,
      });
      newRdv.save().then(() => {
        res.json({ result: true });
      });
    } else {
      res.json({ result: false, error: "Retour déjà envoyé." });
    }
  });
});

module.exports = router;
