module.exports = router;
var express = require("express");
var router = express.Router();
require("../models/connection");
const Note = require("../models/note");
const User = require("../models/user");
const { checkBody } = require("../module/checkBody");

//La route GET /notes permet de récupérer toutes les notes de la base de données
router.get("/notes", (req, res) => {
  User.find({}).then((data) => {
    res.json({ result: true, users: data });
  });
});

//La route POST / permet de rajouter une note à la base de données
router.post("/", (req, res) => {
  const { etoiles, commentaire, token, _ObjectId } = req.body;
  if (!checkBody(req.body, ["etoiles", "commentaire", "token", "_ObjectId"])) { //On regarde si les paramètres sont tous là
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({token}).then(data => { //Tout d'abord on regarde dans la collection users si on trouve bien un user
    if(data){ //Si on en trouve bien un
        Note.findOne({commentaire, etoiles, _ObjectId, user: data._ObjectId})
        .then(result => {
            if(!result){
                const newNote = new Note({
                    etoiles,
                    commentaire,
                    userPro: _ObjectId,
                    user: data._ObjectId,
                });
                newNote.save().then(res.json({result: true})); //LA note a été rajouté
            }
        })
    } else {
        res.json({result: false, error: "Mauvais"}); //La note n'a pas été rajouté dans la base de donnée
    };
  });
});

module.exports = router;
