var express = require("express");
var router = express.Router();

const UserPro = require("../models/userPro");
const { checkBody } = require("../module/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

//Route POST /signup qui permet de créer un compte userPro
router.post("/signup", (req, res) => {
  const { prenom, nom, mobile, email, adresse, nomEnseigne } = req.body; //clean code pour avoir des variables égales au req.body

  //Utilisation du module checkBody pour confirmer la présence de tous paramètres nécessaire au bon déroulement de la route
  if (
    !checkBody(req.body, ["prenom", "nom", "adresse", "mobile", "email", "nomEnseigne"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" }); //Si il manque des champs
    return;
  }

  //Ici on regarde si le userPro n'existe pas déjà
  UserPro.findOne({ nomEnseigne, mobile, email }).then((data) => {
    //Si il n'est pas présent dans la base de données
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
          res.json({ result: true, token: data.token }); //Fin de la route si tout se passe bien
        })
        .catch((error) => {
          // Gestion des erreurs
          console.error("Erreur lors de la création de l'utilisateur:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error" });
        });
    } else {
      res.json({result: false, error: "L'utilisateur existe déjà"})
      return;
    }
  });
});


//La route POST /signin permet au userPro de se connecter à l'application
router.post("/signin", (req, res) => {
  const { email, motDePasse } = req.body; //clean code
  if (!checkBody(req.body, ["email", "motDePasse"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  UserPro.findOne({ email }).then((data) => {
    console.log(data, email);
    if (data) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "Email ou mot de passe incorrect." }); //Si l'utilisateur n'est pas trouvé dans la base de donnée
    }
  });
});

//Cette route GET / permet de récupérer l'entiereté des userPros pour les afficher dans ChooseBarberScreen.js
router.get("/", (req, res) => {
  UserPro.find({})
    .populate("notes")
    .populate("rdvs")
    .populate("formules")
    .then((data) => {
      res.json({ result: true, users: data });
    });
});


//La route PUT / permet de rajouter les formules que le userPro peut mettre en avant dans son salon
router.put("/", (req, res) => {
  UserPro.findOne({token: req.body.token})
  .populate("formules")
  .then(dataFind => {
    if(dataFind){
      UserPro.updateOne(
        { token: req.body.token },
        { $addToSet: { formules: req.body._ObjectId } //addToSet permet de ne pas dupliquer les formules rajouter
      })
      .then(dataUpdate => {
        if(dataUpdate.modifiedCount){ //data.modifiedCount est soit à 0 ou 1 : 1 il a changé quelque chose, donc il est vrai
          res.json({result: true});
        } else {
          res.json({result:false, error: "Vous possédez déjà cette formule"}); //Si rien a été modifié
        }
      });
    };
  });
});


//Cette route PUT /rdv permet de rajouter des rendez-vous pour notre userPro si un utilisateur prend un rendez-vous chez lui
router.put("/rdv", (req, res) => {
  console.log(req.body);
  UserPro.findOne({token: req.body.token}) //On recherche notre professionnel
  .populate("rdvs") 
  .then(dataFind => {
    if(dataFind){
      UserPro.updateOne(
        { token: req.body.token },
        { $addToSet: { rdvs: req.body.ObjectId } //addToSet permet de ne pas dupliquer les formules rajouter
      })
      .then(dataUpdate => {
        console.log(dataUpdate);
        if(dataUpdate.modifiedCount){
          res.json({result: true}); //Si c'est bien modifié
        } else {
          res.json({result:false, error: "Vous ne pouvez pas avoir deux fois le même rendez-vous"}); //Si rien a été modifié
        }
      });
    };
  });
});


// Cette route aurait permis le fait de changer de photos pour le profil pro avec Cloudinary

// router.put("/image", (req, res) => {
//   if (!checkBody(req.body, ["token", "image"])) {
//     res.json({ result: false, error: "Missing or empty fields" });
//     return;
//   }
//   UserPro.updateOne(
//     { token: req.body.token },
//     { $set: { image: req.body.image } }
//   ).then((data) => {
//     if (data) {
//       UserPro.findOne({ token: req.body.token }).then(
//         res.json({ result: true, image: req.body.image })
//       );
//     } else {
//       res.json({ result: false, error: "Erreur sur l'image" });
//     }
//   });
// });


//Cette route Get /:token permet de récupérer notre userPro avec son token pour afficher tout ce qu'il contient
router.get("/:token", (req,res) => {
  const {token} = req.params;
  UserPro.findOne({token})
  .populate("formules")
  .populate("notes")
  .populate("rdvs")
  .then(data => {
    if(data){
      res.json({result:true, user: data}); //Si tout se passe bien, alors on récupère notre userPro
    } else {
      res.json({result: false}); // Sinon on a just un data.result = false
    }
  })
});

//Cette route permet de récupéré un pro par son nom d'enseigne
router.get("/userpro/:nomEnseigne", (req, res) => {
  const nomEnseigne = req.params.nomEnseigne;
  UserPro.findOne({ nomEnseigne: new RegExp(`^${nomEnseigne}$`, "i") }) //On permet aux utilisateurs de mal tapé le userPro
    .then((data) => {
      if (data) {
        console.log("Je passe ici")
        res.json({ result: true, user: data }); //Si tout se passe bien, on récupère notre userPro
      } else {
        console.log("Je passe là")
        res.json({ result: false, error: "Nom d'enseigne non valide" }); //Si il n'est pas dans la base de donnée
      }
    })
    .catch((error) => {
      res.json({ result: false, error: "Erreur lors de la recherche" }); //Si il y a une erreur quelconque en plus
    });
});

module.exports = router;
