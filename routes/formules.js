var express = require("express");
var router = express.Router();

const User = require("../models/user");
const formules = require("../models/formule");

router.get("/getFormule", (req, res) => {
  // const {email} = req.body
  console.log("hello im called");
  //récupérer la formule d'un utilisateur. 1 chercher utilisateur grâce au token puis find pour renvoyer la formule
  User.findOne({ email: req.body.email }).then((data) => {
    console.log(data);
  });
});

module.exports = router;
