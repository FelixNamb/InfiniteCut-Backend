var express = require("express");
var router = express.Router();

const UserPro = require("../models/userPro");
const { checkBody } = require("../module/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  console.log(req.body);
  const { prenom, nom, codePostal, mobile, email } = req.body;
  if (
    !checkBody(req.body, ["prenom", "nom", "codePostal", "mobile", "email"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  UserPro.findOne({ codePostal, mobile, email }).then((data) => {
    if (!data) {
      const newUserPro = new UserPro({
        prenom,
        nom,
        codePostal,
        mobile,
        email,
        adresse: "",
        token: uid2(32),
        motDePasse: "",
        mesRdv: [],
        mesNotes: [],
        noteGlobale: 0,
        formules: [],
        vente: false,
        image: null,
      });

      newUserPro.save().then((data) => {
        res.json({ result: true, token: data.token });
      });
    } else {
      res.json({
        result: false,
        message: "Ce compte existe déjà. Voulez vous vous connecter ?",
      });
    }
  });
});

router.post("/signin", (req, res) => {
  const { email, motDePasse } = req.body;
  if (!checkBody(req.body, ["email", "motDePasse"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  UserPro.findOne({ email }).then((data) => {
    if (data && bcrypt.compareSync(motDePasse, data.motDePasse)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "Email ou mot de passe incorrect." });
    }
  });
});

router.get("/", (req, res) => {
  UserPro.find({})
    .populate("notes")
    .populate("rdv")
    .populate("formules")
    .then((data) => {
      res.json({ result: true, users: data });
    });
});

router.put("/", (req, res) => {
  UserPro.updateOne(
    { token: req.body.token },
    { $addToSet: { formules: req.body._ObjectId } }
  ).then(() => {
    UserPro.findOne({ token: req.body.token })
      .populate("formules")
      .then((data) => {
        if (data.formules.some((elt) => elt._ObjectId === req.body._ObjectId)) {
          res.json({ result: true });
        } else {
          res.json({
            result: false,
            error: "Vous proposez déjà la formule sélectionnée",
          });
        }
      });
  });
});

router.put("/image", (req, res) => {
  if (!checkBody(req.body, ["token", "image"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  UserPro.updateOne(
    { token: req.body.token },
    { $set: { image: req.body.image } }
  ).then((data) => {
    if (data) {
      UserPro.findOne({ token: req.body.token }).then(
        res.json({ result: true, image: req.body.image })
      );
    } else {
      res.json({ result: false, error: "Erreur sur l'image" });
    }
  });
});

module.exports = router;
