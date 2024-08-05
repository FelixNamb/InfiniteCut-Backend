const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
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
    token: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;