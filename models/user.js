const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    prenom: String,
    nom: String,
    email: String,
    adresse: String,
    mobile : Number,
    mesRDV: [{ type: mongoose.Schema.Types.ObjectId, ref: 'rdvs' }],
    formule : { type: mongoose.Schema.Types.ObjectId, ref: 'notes'},
    moyenPaiement: [{
        numCarte: Number,
        dateExpirationMois: Number,
        dateExpirationAnnee: Number,
        CVC: Number,
    }],
    salonLike:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'userPro'},
    ],
});

const User = mongoose.model('users', userSchema);

module.exports = User;