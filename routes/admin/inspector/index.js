const express = require('express');
const router = express.Router();
const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

// Loading the model
const Inspector = require('../../../models/inspector');
const School = require('../../../models/school');

// importing the validation needed too as well
const { inspectorValidation } = require('../../../utils/admin/validation');

router.get('/', async(req, res) => {

    // check to see if the admin is loggedIn
    // the code section will be inserted here
    try{

        const inspector = await Inspector.find({});

        res.status(200).send({
            message: "QUERY_SUCCESS",
            status: true,
            query: inspector
        })
        return;

    }catch(error) {

        res.send(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return; 
    }

});

router.get('/:id', async(req, res) => {

    // check to see if the user is logged in
    // some code will be here

    // check for the id
    try{

        // check to see if it's valid
        if(!objectId.isValid(req.params.id)) {

            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            })
            return;  
        }

        const checkInspectorExist = await Inspector.findById({ _id: req.params.id });

        if(!checkInspectorExist) {

            res.status(400).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the inspector do not exist"
            })
            return;
        } else {

            res.status(200).send({
                message: "QUERY_SUCCESS",
                status: true,
                query: checkInspectorExist
            })
            return;
        }

    }catch(error) {

        res.send(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return;
    }
});

router.post('/', async(req, res) => {

     // checking if the admin is logged in
     // i'll write some code here
     
    // getting all request body
    let { firstName, lastName, email, phone, schools, password, profileImg } = req.body;

    // performing some validation through joi
    const { error } = inspectorValidation(req.body);
    
    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return;
    }

    // transormfing string to lowercase
    let emailTransform = email.toLowerCase();

    try{

        // check to see if the inspector already exist
        let inspectorCheck = await Inspector.findOne({ email: emailTransform });
        
        if(inspectorCheck) {

            res.status(400).json({
                error: "INSPECTOR_EXISTS",
                status: false,
                message: "Oops, Inspector already exist"
            });
            return;
        }
        
        // function that gets all input
        function getSchoolsId(name) {
        
          // getting school id
          try{

            const schoolId =  School.find({ name: name });
            return schoolId;

          }catch(error) {

            res.status(500).json({
                error: "INTERNAL_ERROR",
                status: false,
                message: error
            })
            return;

          }
        
       }

       const schoolId = schools.map(getSchoolsId)
       console.log(schoolId);

        // looping in to the arrays
        // for( var i = 0; i < schools.length; i++ ) {
        //     console.log("It is here");
        // }
        // console.log(req.body);

    }catch(error) {

    }
});

router.put('/:id', async(req, res)=> {

});

router.delete('/:id', async(req, res) => {
    // try to see if the admin is logged in
    // put some code here

    try{

        // check to see if is valid
        if(!objectId.isValid(req.params.id)) {

            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            })
            return;  
        }

        const checkInspector = await Inspector.findById({ _id: req.params.id});
        
        if(!checkInspector) {

            res.status(400).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the inspector do not exist"
            })
            return;
        } else {

            // Make a delete request
            const deleteInpsector = await Inspector.findByIdAndDelete({ _id: req.params.id});

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

    }catch(error) {

        res.send(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        });
        return;

    }
});

module.exports = router;