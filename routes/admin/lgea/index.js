const express = require('express');
const router = express.Router();
const multer = require('multer');

// Importing the controllers
const { _getAll, _getSpecific, _insert, _delete, _update }  = require('../../../controllers/admin/lgea/index');

// Token Verfication
const { auth } = require('../../../middleware/jwtAuth');

// multer filter
const fileFilter = (req, res, cb) => {

    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === "image/png" || file.mimetype === "image/jpg") { 
         cb(null, true);
    }else {
        cb(null, false);
    }

}

// setting up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/lgea')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+file.originalname);
    }
})

const upload = multer({ 
    storage: storage }, { fileFilter: fileFilter })

router.get('/', _getAll);

router.get('/:id', auth, _getSpecific);

router.post('/', auth, upload.single('lgeaImage'), _insert);

router.put('/:id', auth, upload.single('lgeaImage'), _update);

router.delete('/:id', auth, _delete);

module.exports = router;