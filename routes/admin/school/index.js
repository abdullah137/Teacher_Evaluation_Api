const express = require('express');
const router = express.Router();
const objectId = require('mongoose').Types.ObjectId;

// Loading the model
const School = require('../../../models/school');
const Lgea = require('../../../models/lgea');

// importing the validation needed
const { schoolValidation } = require('../../../utils/admin/validation')

router.get('/', async(req, res) => {
   
    // check to see it the admin is loggedIn
    // the code section will be inserted here
    try {
        
        const school = await School.find({});

        res.status(200).send({
            message: "QUERY_SUCCESS",
            status: true,
            query: school
        })
        return;

    } catch (error) {
        
        res.send(500).json({
            error: "INTERNAL_ERROR",
            status: true,
            message: error
        })
        return; 

    }
});

router.get('/:id', async(req, res) => {
   
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
        
        const checkSchoolExist = await School.findById({ _id: req.params.id});

        if(!checkSchoolExist) {

            res.status(400).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the local government do not exist"
            })
            return;
        } else {

            res.status(200).send({
                message: "QUERY_SUCCESS",
                status: true,
                query: checkSchoolExist
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

});

router.post('/', async(req, res) => {
    
    // check to see if the admin is logged in
    // some code will be here

    // get all the request Body
    let { name, lgea } = req.body;

    // using joi to check
    const { error } = schoolValidation(req.body)

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message,
        })
        return;
    }

    // check to see if the name already exist
    let schoolName = name.toLowerCase();
    let lgeaName = lgea.toLowerCase();

    try{

        // check to see if the localgovernment already exist
        let lgeaExist = await Lgea.findOne({ name: lgeaName });
        
            // check to see if the local government exist
            if(!lgeaExist) {

                res.status(400).json({
                    error: "NONE_EXISTENCE",
                    status: false,
                    message: "Oops, the local goverment does not exist"
                });
                return;
            }

        // lgea id
        const lgeaId = lgeaExist._id;

        // check to see if the school exist
        const schoolExist =  await School.findOne({name: schoolName, lgea: lgeaName});
    
        if(schoolExist) {
            res.status(400).json({
                error: "SCHOOL_EXISTS",
                status: false,
                message: "Oops, School already exist"
            });
            return;
        }    
    
        // then insert the school
        const saveSchool = await School.create({ name: schoolName, lgea: lgeaName, lgeaId: lgeaId });
        
        // push object
        var schools =  saveSchool._id ;

        // insert onto the lgea
        const updateLgea = await Lgea.findByIdAndUpdate({ _id: lgeaId },
              {
               $push: {
                   "otherInfo.0.schools": schools
               } 
        });

            res.status(201).send({
                message: "CREATED_SUCCESSFULLY",
                status: true,
                query: saveSchool
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


});

router.put('/:id', async(req, res) => {

    // get the selected Body

    let { name, lgea } = req.body;

    // using joi to check for errors
    const { error } = schoolValidation(req.body);

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return;
    }

    // still performing some checking
    if(!name || !lgea ) {
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
            message: "Sorry, you entered an invalid paramater"
        })
        return;  
    }

    // checking the school if exist
    const checkSchoolExist = await School.findById({ _id: req.params.id});
    
    if(!checkSchoolExist) {

        res.status(400).json({
            error: "NONE_EXISTENCE",
            status: false,
            message: "Sorry, the Shcool do not exist"
        })
        return;
    }

    // check if the admin is logged in
    // there will be some code here

     try {

        const updateSchool = await School.updateOne({ _id: req.params.id }, {
            $set: req.body
        }, {new: true});

        res.status(200).send({
            message: "UPDATED_SUCCESSFULLY",
            status: true,
            query: updateSchool
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

});

router.delete('/:id', async(req, res) => {

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

        const checkSchool = await School.findById({ _id: req.params.id});
        
        if(!checkSchool) {

            res.status(400).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the school do not exist"
            })
            return;
        } else {

            // Make a delete request
            const deleteSchool = await School.findByIdAndDelete({ _id: req.params.id});

            const lgeaId = checkSchool.lgeaId;

             // push object
             var schools =  deleteSchool._id ;

        // insert onto the lgea
        const updateLgea = await Lgea.findByIdAndUpdate({ _id: lgeaId },
              {
               $pull: {
                   "otherInfo.0.schools": schools
               } 
        });

            if(deleteSchool && updateLgea) {

                res.status(200).send({
                    message: "DELETE_SUCCESS",
                    status: true,
                    query: deleteSchool
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

});

module.exports = router;