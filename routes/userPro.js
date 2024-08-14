var express = require("express");
var router = express.Router();

const UserPro = require("../models/userPro");
const { checkBody } = require("../module/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  const { prenom, nom, mobile, email, adresse, nomEnseigne } = req.body; //clean code pour avoir des variables égales au req.body
  if (
    !checkBody(req.body, ["prenom", "nom", "adresse", "mobile", "email", "nomEnseigne"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  UserPro.findOne({ nomEnseigne, mobile, email }).then((data) => {
    if (!data) {
      const newUserPro = new UserPro({
        prenom,
        nom,
        mobile,
        email,
        adresse,
        token: uid2(32),
        motDePasse: "",
        mesRdv: [],
        mesNotes: [],
        noteGlobale: 0,
        formules: [],
        nomEnseigne,
      });
      newUserPro
        .save()
        .then((data) => {
          res.json({ result: true, token: data.token });
        })
        .catch((error) => {
          // Gestion des erreurs
          console.error("Erreur lors de la création de l'utilisateur:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error" });
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
    .populate("rdvs")
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

router.get("/:token", (req,res) => {
  const {token} = req.params;
  UserPro.findOne({token})
  .populate("formules")
  .populate("notes")
  .populate("rdvs")
  .then(data => {
    if(data){
      res.json({result:true, user: data});
    } else {
      res.json({result: false});
    }
  })
});

router.get("/userpro/:nomEnseigne", (req, res) => {
  const nomEnseigne = req.params.nomEnseigne;
  UserPro.findOne({ nomEnseigne: new RegExp(`^${nomEnseigne}$`, "i") })
    .then((data) => {
      if (data) {
        console.log("Je passe ici")
        res.json({ result: true, user: data });
      } else {
        console.log("Je passe là")
        res.json({ result: false, error: "Nom d'enseigne non valide" });
      }
    })
    .catch((error) => {
      res.json({ result: false, error: "Erreur lors de la recherche" });
    });
});

module.exports = router;
