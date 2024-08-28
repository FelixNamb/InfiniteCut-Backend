var express = require("express");
var router = express.Router();

require("../models/connection");
const Rdv = require("../models/rdv");
const { checkBody } = require("../module/checkBody");


//Cette route GET /:idUSerPro permet de récupérer tous les rendez-vous par l'ID du userPro
router.get("/:idUserPro", (req, res) => {
  Rdv.find({ userPro: req.params.idUserPro }) //On recherche tous les rendez-vous qui ont l'ID du userPro demandé
    .populate("userPro")
    .then((data) => {
      if (data.length >= 1) { //On regarde s'il en existe 1 ou plus
        res.json({ result: true, data }); //On renvoit toute la data dans un tableau grâce à la méthode find
      } else {
        res.json({ result: false }); // On ne renvoit qu'un result : false
      }
    });
});

//La route POST / permet de rajouter un rendez-vous dans la base de données
router.post("/", (req, res) => {
  if (!checkBody(req.body, ["date", "ObjectId", "plageHoraire"])) { //On regarde si tous les paramètres sont bien présent
    res.json({ result: false, error: "Veuillez saisir votre retour" });
    return;
  }

  //On regarde si le rendez-vous n'existe pas déjà dans la base de données
  Rdv.findOne({
    date: req.body.date,
    userPro: req.body.ObjectId,
    plageHoraire: req.body.plageHoraire,
  }).then((data) => {
    //Si le rendez-vous n'existe pas
    if (data === null) {
      const newRdv = new Rdv({
        date: req.body.date,
        userPro: req.body.ObjectId,
        plageHoraire: req.body.plageHoraire,
      });
      newRdv.save().then(() => {
        res.json({ result: true, newRdv: newRdv }); //Super, le rendez-vous est enregistré et on renvoie le nouveau rendez-vous
      });
    } else {
      res.json({ result: false, error: "Retour déjà envoyé." }); //Problème, le rendez-vous s'y trouve déjà
    }
  });
});

//Cette route GET /searchid/:id  permet de récupérer un rendez-vous par son ID
router.get("/searchid/:id", (req, res) => {
  Rdv.findOne({ _id: req.params.id })
    .populate("userPro")
    .then((data) => {
      if (data) {
        res.json({ result: true, rdv: data }); //Renvoie le rendez-vous si il est trouvé
      } else {
        res.json({ result: false }); //Ne renvoie rien de plus qu'un false
      }
    });
});

//La route DELETE / permet de supprimer un rendez-vous de la base de données
router.delete("/", (req, res) => {
  console.log(req.body);

  if (!checkBody(req.body, ["date", "ObjectId", "plageHoraire"])) { //On regarde si tous les paramètres sont bien présents
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
        res.json({ message: "Rendez-vous bien effacé" }); //On renvoie un message pour dire que tout a été bien supprimé
      } else {
        res.json({ error: "Aucun rendez-vous trouvé à effacer" }); //On renvoie un message pour dire que rien a été trouvé
      }
    })
    .catch((err) => { //Catch error habituel pour un soucis de sécurité
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
