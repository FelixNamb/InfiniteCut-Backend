module.exports = router;
var express = require("express");
var router = express.Router();
require("../models/connection");
const Note = require("../models/note");
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

  Note.findOne({ token, commentaire, _ObjectId }).then((data) => {
    if (!data) {
      const newNote = new Note({
        etoiles,
        commentaire,
      });
    }
  });
});
