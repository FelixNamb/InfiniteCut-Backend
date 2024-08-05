module.exports = router;
var express = require("express");
var router = express.Router();
require("../models/connection");
const Note = require("../models/note");
const User = require("../models/user");
const { checkBody } = require("../module/checkBody");

router.get("/notes", (req, res) => {
  User.find({}).then((data) => {
    res.json({ result: true, users: data });
  });
});

router.post("/", (req, res) => {
  const { etoiles, commentaire, token, _ObjectId } = req.body;
  if (!checkBody(req.body, ["etoiles", "commentaire", "token", "_ObjectId"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({token}).then(data => {
    if(data){
        Note.findOne({commentaire, etoiles, _ObjectId, user: data._ObjectId})
        .then(result => {
            if(!result){
                const newNote = new Note({
                    etoiles,
                    commentaire,
                    userPro: _ObjectId,
                    user: data._ObjectId,
                });
                newNote.save().then(res.json({result: true}));
            }
        })
    } else {
        res.json({result: false, error: "Mauvais"});
    };
  });
});

module.exports = router;
