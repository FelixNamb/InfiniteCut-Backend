var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/user");
const { checkBody } = require("../module/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  User.find({})
    .populate("mesRdvs")
    .populate("formule")
    .populate("salonLike")
    .then((data) => {
      res.json({ result: true, users: data });
    });
});

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "mobile", "motDePasse"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.motDePasse, 10);

      const newUser = new User({
        email: req.body.email,
        mobile: req.body.mobile,
        motDePasse: hash,
        mesRDV: [],
        formule: null,
        moyenPaiement: [],
        salonLike: [],
        token: uid2(32),
      });
      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      res.json({ result: false, error: "Utilisateur déjà existant" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "motDePasse"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.motDePasse, data.motDePasse)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({
        result: false,
        error: "Utilisateur inconnu ou mot de passe érroné",
      });
    }
  });
});

router.delete("/", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }
  User.deleteOne({ token: req.body.token }).then(() => {
    res.json({ result: true });
  });
});

router.put("/myCard/delete", (req, res) => {
  if (!checkBody(req.body, ["numCarte", "dateExpiration", "cvc"])) {
    res.json({ result: false, error: "Aucun moyen de paiement ajouté" });
    return;
  }
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      User.updateOne(
        { token: req.body.token },
        {
          $pull: {
            moyenPaiement: {
              numCarte: req.body.numCarte,
              dateExpiration: req.body.dateExpiration,
              cvc: req.body.cvc,
            },
          },
        }
      ).then((data) => {
        if (data.modifiedCount)
          res.json({ result: true, message: "Carte supprimée" });
      });
    } else {
      res.json({ result: false, error: "La carte n'existe pas" });
    }
  });
});

router.put("/myCard", (req, res) => {
  if (!checkBody(req.body, ["numCarte", "dateExpiration", "cvc"])) {
    res.json({ result: false, error: "Aucun moyen de paiement ajouté" });
    return;
  }
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      User.updateOne(
        { token: req.body.token },
        {
          $push: {
            moyenPaiement: {
              numCarte: req.body.numCarte,
              dateExpiration: req.body.dateExpiration,
              cvc: req.body.cvc,
            },
          },
        }
      ).then((data) => {
        if (data.modifiedCount) res.json({ result: true });
      });
    } else {
      res.json({ result: false, error: "Carte déjà existante" });
    }
  });
});

// router.put("/", (req, res) => {
//   User.updateOne(
//     { token: req.body.token },
//     { $set: { formules: req.body._id } }
//   ).then((data) => {
//     if (data) {
//       User.findOne({ token: req.body.token })
//         .populate("formule")
//         .then(res.json({ result: true }));
//     } else {
//       res.json({
//         result: false,
//         error: "Aucune modification effectuée",
//       });
//     }
//   });
// });

router.put("/formule/delete", (req, res) => {
  User.findOne({ token: req.body.token })
    .populate("formule")
    .then((data) => {
      if (data) {
        User.updateOne(
          { token: req.body.token },
          { $set: { formule: null } }
        ).then((change) => {
          if (!change.formule) {
            res.json({ result: true });
          }
        });
      } else {
        res.json({
          result: false,
          error: "Aucun compte trouvé",
        });
      }
    });
});

router.put("/formule", (req, res) => {
  User.findOne({ token: req.body.token })
    .populate("formule")
    .then((data) => {
      if (data) {
        User.updateOne(
          { token: req.body.token },
          { $set: { formule: req.body._ObjectId } }
        ).then(res.json({ result: true }));
      } else {
        res.json({ result: false });
      }
    });
});


router.put("/rdv", (req, res) => {
  User.findOne({token: req.body.token})
  .populate("mesRDV")
  .then(dataFind => {
    if(dataFind){
      User.updateOne(
        { token: req.body.token },
        { $addToSet: { mesRDV: req.body.ObjectId }
      })
      .then(dataUpdate => {
        console.log(dataUpdate);
        if(dataUpdate.modifiedCount){
          res.json({result: true});
        } else {
          res.json({result:false, error: "Vous ne pouvez pas avoir deux fois le même rendez-vous"});
        }
      });
    };
  });
});

router.get("/:token", (req, res) => {
  const { token } = req.params;
  User.findOne({ token })
    .populate("formule")
    .populate("mesRDV")
    .then((data) => {
      if (data) {
        res.json({ result: true, user: data });
      } else {
        res.json({ result: false });
      }
    });
});

module.exports = router;
