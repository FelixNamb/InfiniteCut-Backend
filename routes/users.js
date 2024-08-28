var express = require("express");
var router = express.Router(); // Initialise le routeur Express

require("../models/connection"); // Importe la connexion à la base de données
const User = require("../models/user"); // Modèle de l'utilisateur
const { checkBody } = require("../module/checkBody"); // Fonction de validation des champs requis
const uid2 = require("uid2"); // Génère des tokens uniques
const bcrypt = require("bcrypt"); // Librairie de chiffrement pour les mots de passe

// Route GET pour obtenir tous les utilisateurs
router.get("/", (req, res) => {
  // Recherche tous les utilisateurs dans la base de données
  User.find({})
    .populate("mesRdvs") // Remplit le champ 'mesRdvs' avec les données associées
    .populate("formule") // Remplit le champ 'formule' avec les données associées
    .populate("salonLike") // Remplit le champ 'salonLike' avec les données associées
    .then((data) => {
      // Renvoie les utilisateurs trouvés sous forme de réponse JSON
      res.json({ result: true, users: data });
    });
});

// Route POST pour l'inscription d'un utilisateur
router.post("/signup", (req, res) => {
  // Vérifie si les champs requis sont présents dans la requête
  if (!checkBody(req.body, ["email", "mobile", "motDePasse"])) {
    res.json({ result: false, error: "Champs manquants" }); // Renvoie une erreur si des champs sont manquants
    return;
  }
  // Vérifie si un utilisateur avec le même email existe déjà
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.motDePasse, 10); // Hache le mot de passe de l'utilisateur

      // Crée un nouvel utilisateur avec les données fournies
      const newUser = new User({
        email: req.body.email,
        mobile: req.body.mobile,
        motDePasse: hash, // Stocke le mot de passe haché
        mesRDV: [],
        formule: null,
        moyenPaiement: [],
        salonLike: [],
        token: uid2(32), // Génère un token unique pour l'utilisateur
      });
      // Sauvegarde le nouvel utilisateur dans la base de données
      newUser.save().then((newDoc) => {
        // Renvoie le token de l'utilisateur nouvellement créé
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      res.json({ result: false, error: "Utilisateur déjà existant" }); // Erreur si l'utilisateur existe déjà
    }
  });
});

// Route POST pour la connexion d'un utilisateur
router.post("/signin", (req, res) => {
  // Vérifie si les champs requis sont présents dans la requête
  if (!checkBody(req.body, ["email", "motDePasse"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }
  // Recherche l'utilisateur par email
  User.findOne({ email: req.body.email }).then((data) => {
    // Si l'utilisateur est trouvé et que le mot de passe est correct
    if (data && bcrypt.compareSync(req.body.motDePasse, data.motDePasse)) {
      res.json({ result: true, token: data.token }); // Renvoie le token de l'utilisateur
    } else {
      res.json({
        result: false,
        error: "Utilisateur inconnu ou mot de passe erroné", // Erreur si l'utilisateur n'existe pas ou si le mot de passe est incorrect
      });
    }
  });
});

// Route DELETE pour supprimer un utilisateur
router.delete("/", (req, res) => {
  // Vérifie que le token est présent dans la requête
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }
  // Supprime l'utilisateur en utilisant son token
  User.deleteOne({ token: req.body.token }).then(() => {
    res.json({ result: true }); // Renvoie un succès après suppression
  });
});

// Route PUT pour supprimer un moyen de paiement d'un utilisateur
router.put("/myCard/delete", (req, res) => {
  // Vérifie que les détails de la carte sont présents
  if (!checkBody(req.body, ["numCarte", "dateExpiration", "cvc"])) {
    res.json({ result: false, error: "Aucun moyen de paiement ajouté" });
    return;
  }
  // Recherche l'utilisateur par token
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      // Supprime un moyen de paiement spécifique de l'utilisateur
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
          res.json({ result: true, message: "Carte supprimée" }); // Confirmation de la suppression
      });
    } else {
      res.json({ result: false, error: "La carte n'existe pas" });
    }
  });
});

// Route PUT pour ajouter un moyen de paiement à un utilisateur
router.put("/myCard", (req, res) => {
  // Vérifie que les détails de la carte sont présents
  if (!checkBody(req.body, ["numCarte", "dateExpiration", "cvc"])) {
    res.json({ result: false, error: "Aucun moyen de paiement ajouté" });
    return;
  }
  // Recherche l'utilisateur par token
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      // Ajoute un nouveau moyen de paiement à l'utilisateur
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
        if (data.modifiedCount) res.json({ result: true }); // Confirmation de l'ajout
      });
    } else {
      res.json({ result: false, error: "Carte déjà existante" });
    }
  });
});

// Route PUT pour supprimer une formule d'un utilisateur
router.put("/formule/delete", (req, res) => {
  // Recherche l'utilisateur par token et récupère la formule associée
  User.findOne({ token: req.body.token })
    .populate("formule")
    .then((data) => {
      if (data) {
        // Supprime la formule associée de l'utilisateur
        User.updateOne(
          { token: req.body.token },
          { $set: { formule: null } }
        ).then((change) => {
          if (!change.formule) {
            res.json({ result: true }); // Confirmation de la suppression
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

// Route PUT pour ajouter une formule à un utilisateur
router.put("/formule", (req, res) => {
  // Recherche l'utilisateur par token et récupère la formule associée
  User.findOne({ token: req.body.token })
    .populate("formule")
    .then((data) => {
      if (data) {
        // Ajoute une nouvelle formule à l'utilisateur
        User.updateOne(
          { token: req.body.token },
          { $set: { formule: req.body._ObjectId } }
        ).then(res.json({ result: true })); // Confirmation de l'ajout
      } else {
        res.json({ result: false });
      }
    });
});

// Route PUT pour ajouter un rendez-vous à un utilisateur
router.put("/rdv", (req, res) => {
  // Recherche l'utilisateur par token et récupère les rendez-vous associés
  User.findOne({ token: req.body.token })
    .populate("mesRDV")
    .then((dataFind) => {
      if (dataFind) {
        // Ajoute un rendez-vous à l'utilisateur sans duplication
        User.updateOne(
          { token: req.body.token },
          { $addToSet: { mesRDV: req.body.ObjectId } }
        ).then((dataUpdate) => {
          if (dataUpdate.modifiedCount) {
            res.json({ result: true }); // Confirmation de l'ajout
          } else {
            res.json({
              result: false,
              error: "Vous ne pouvez pas avoir deux fois le même rendez-vous",
            });
          }
        });
      }
    });
});

// Route GET pour obtenir un utilisateur spécifique via son token
router.get("/:token", (req, res) => {
  const { token } = req.params; // Récupère le token des paramètres de requête
  // Recherche l'utilisateur par token et récupère les données associées
  User.findOne({ token })
    .populate("formule")
    .populate("mesRDV")
    .then((data) => {
      if (data) {
        res.json({ result: true, user: data }); // Renvoie l'utilisateur trouvé
      } else {
        res.json({ result: false });
      }
    });
});

module.exports = router; // Exporte le routeur pour utilisation dans l'application principale
