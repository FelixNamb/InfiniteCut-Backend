var express = require('express');
var router = express.Router();

const Note = require('../models/note');
const { checkBody } = require('../module/checkBody');







router.post('/', (req,res) => {
    const {etoiles, commentaire, token, _ObjectId} = req.body;
    if (!checkBody(req.body, ['etoiles', 'commentaire', 'token', '_ObjectId'])){
            res.json({ result: false, error: 'Missing or empty fields' });
            return;
    };

    Note.findOne({token, commentaire, _ObjectId})
    .then(data =>{
        if(!data){
            const newNote = new Note({
                etoiles,
                commentaire,

            })
        }
    })
})
module.exports = router;