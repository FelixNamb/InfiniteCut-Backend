require("dotenv").config(); // Charge les variables d'environnement à partir d'un fichier .env
require("./models/connection"); // Établit la connexion à la base de données

var express = require("express"); // Importe le framework Express
var path = require("path"); // Importe le module 'path' pour travailler avec les chemins de fichiers
var cookieParser = require("cookie-parser"); // Importe le middleware pour analyser les cookies
var logger = require("morgan"); // Importe Morgan pour le logging des requêtes HTTP

// Importation des routeurs pour différentes parties de l'application
var indexRouter = require("./routes/index"); // Routeur pour la route principale
var usersRouter = require("./routes/users"); // Routeur pour les utilisateurs
var userProRouter = require("./routes/userPro"); // Routeur pour les utilisateurs professionnels
var notesRouter = require("./routes/notes"); // Routeur pour les notes
var formulesRouter = require("./routes/formules"); // Routeur pour les formules
var rdvRouter = require("./routes/rdv"); // Routeur pour les rendez-vous

var app = express(); // Crée une instance de l'application Express
const cors = require("cors"); // Importe le middleware CORS pour gérer les requêtes entre origines
app.use(cors()); // Active CORS pour toutes les routes

// Configuration des middlewares
app.use(logger("dev")); // Utilise Morgan pour enregistrer les requêtes HTTP en mode développement
app.use(express.json()); // Middleware pour analyser les requêtes JSON
app.use(express.urlencoded({ extended: false })); // Middleware pour analyser les données des formulaires URL-encoded
app.use(cookieParser()); // Middleware pour analyser les cookies
app.use(express.static(path.join(__dirname, "public"))); // Définit le dossier 'public' comme dossier statique pour servir les fichiers statiques

// Configuration des routeurs
app.use("/", indexRouter); // Utilise le routeur 'indexRouter' pour la route racine
app.use("/users", usersRouter); // Utilise le routeur 'usersRouter' pour la route '/users'
app.use("/userpros", userProRouter); // Utilise le routeur 'userProRouter' pour la route '/userpros'
app.use("/notes", notesRouter); // Utilise le routeur 'notesRouter' pour la route '/notes'
app.use("/formules", formulesRouter); // Utilise le routeur 'formulesRouter' pour la route '/formules'
app.use("/rdv", rdvRouter); // Utilise le routeur 'rdvRouter' pour la route '/rdv'

// Exporte l'application Express pour l'utiliser dans d'autres fichiers, comme 'bin/www'
module.exports = app;
