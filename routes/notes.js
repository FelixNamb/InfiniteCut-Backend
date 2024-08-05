var express = require("express");
var router = express.Router();
require("../models/connection");
const note = require("../models/note");
const { checkBody } = require("../module/checkBody");

router.get("/notes", (req, res) => {
  User.find({}).then((data) => {
    res.json({ result: true, users: data });
  });
});
