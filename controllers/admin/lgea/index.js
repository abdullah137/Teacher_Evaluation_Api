const objectId = require('mongoose').Types.ObjectId;

// Loading the model
const Lgea = require('../../../models/lgea');

// importing the validation needed
const { lgeaValidation } = require('../../../utils/admin/validation');

const _getAll = async(req, res) => {
    
    // check to see if the admin is loggedIn
    // the code section will be inserted here
    try {
        
        const lgea = await Lgea.find({});

        res.status(200).send({
            message: "QUERY_SUCCESS",
            status: true,
            query: lgea
        })
        return;

    } catch (error) {

        res.send(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return; 
    }

}

const _getSpecific = async(req, res) => {

    // check to see if the user is logged in

    // check for the id
    try {

        // check to see if is valid
        if(!objectId.isValid(req.params.id)) {

            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            })
            return;  
        }
        
        const checkLgeaExist = await Lgea.findById({ _id: req.params.id});

        if(!checkLgeaExist) {

            res.status(400).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the local government do not exist"
            })
            return;
        } else {

            res.status(200).json({
                message: "QUERY_SUCCESS",
                status: true,
                query: checkLgeaExist
            })
            return;

        }

    } catch (error) {

        res.send(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return;
    }
}

const _insert = async(req, res) => {

    // get all the request body

    let { name, color, image } = req.body;
    
    // use joi to check
    const { error } = lgeaValidation(req.body)

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message,
        })
        return;
    }

    // check if the name alredy exist
    let lgeaName = name.toLowerCase();

    
    const lgeaExist =  await Lgea.findOne({name: lgeaName});


    if(lgeaExist) {
        res.status(400).json({
            error: "LGEA_EXISTS",
            status: false,
            message: "Oops, local governemnt already exist"
        })
        return;
    }
    // then insert the body
    const lgea = Lgea({
        name: lgeaName,
        color: color,
        image: req.file.path
    });

    try {
        const insertLgea = await lgea.save();
        res.status(201).json({
            message: "CREATED_SUCCESSFULLY",
            status: true,
            query: insertLgea
        })
        return;
    }catch(error) {
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return;
    }
}

const _update = async(req, res) => {

    // get the selected Body

    let { name, color, lgeaImage } = req.body;

    // using joi to check for errors
    const { error } = lgeaValidation(req.body);

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return;
    }

    // still performing some checking
    if(!name || !color ) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: "Please ensure you fill all fields"
        });
        return;
    }

     // check to see if is valid
     if(!objectId.isValid(req.params.id)) {

        res.status(400).json({
            error: "INVALID_PARAMETERS",
            status: false,
            message: "sorry, you entered an invalid paramater"
        })
        return;  
    }

    // checking the lgea if exist
    const checkLgeaExist = await Lgea.findById({ _id: req.params.id});
    
    if(!checkLgeaExist) {

        res.status(400).json({
            error: "NONE_EXISTENCE",
            status: false,
            message: "Sorry, the local government do not exist"
        })
        return;
    }

    // check if the admin is logged in
    // there will be some code here

     try {

        const updateLgea = await Lgea.updateOne({ _id: req.params.id }, {
            $set: req.body
        }, {new: true});

        res.status(200).send({
            message: "UPDATED_SUCCESSFULLY",
            status: true,
            query: updateLgea
        })
        return;

     }catch(error) {

        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return;

     }
}

const _delete = async(req, res) => {
    
    // check to see if the admin is authticated

    try {
        
        // check to see if is valid
        if(!objectId.isValid(req.params.id)) {

            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            })
            return;  
        }

        const checkLgeaExist = await Lgea.findById({ _id: req.params.id});

        if(!checkLgeaExist) {

            res.status(400).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the local government do not exist"
            })
            return;
        } else {

            // Make a delete request

            const deleteLgea = await Lgea.findByIdAndDelete({ _id: req.params.id});

            if(deleteLgea) {

                res.status(200).send({
                    message: "DELETE_SUCCESS",
                    status: true,
                    query: deleteLgea
                })
                return;

            }

        }

    } catch (error) {

          res.send(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return;
    }
}

module.exports = { _getAll, _getSpecific, _insert, _update, _delete }