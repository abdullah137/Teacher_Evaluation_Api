const express = require('express');
const router = express.Router();
const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Loading the model
const Inspector = require('../../../models/inspector');
const School = require('../../../models/school');
const Lgea = require('../../../models/lgea');

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

            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the inspector do not exist"
            })
            return;
        } else {

            res.status(200).json({
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
    let { firstName, lastName, email, phone, lgeaId, schools, profileImg } = req.body;

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
    let inspectorEmail = email.toLowerCase();

    try{

        // check to see if the inspector already exist
        let inspectorCheck = await Inspector.findOne({ email: inspectorEmail });
        
        if(inspectorCheck) {

            res.status(400).json({
                error: "INSPECTOR_EXISTS",
                status: false,
                message: "Oops, Inspector already exist"
            });
            return;
        }

        // check if the lgea id is valid
        if(!objectId.isValid(lgeaId)) {

            res.status(400).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, LGEA ID does not exist"
            })
            return;  
        }

        // check if the lgea id exist
        const lgeaExist = await Lgea.findById({ _id: lgeaId });
        if(!lgeaExist) { 
        
            res.status(404).json({
                error: "NOT_FOUND",
                status: false,
                message: "Sorry, LGEA ID was not found"
            })
            return;

        }
        
       // Initialing the array 
       const failure = [];
       const success = [];
        
       // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(email, salt);

        //   then inserting the body
       const inspector = Inspector({
           firstName: firstName,
           lastName: lastName,
           email: inspectorEmail,
           phone: phone,
           lgeaId: new mongoose.Types.ObjectId(lgeaId),
           password: hashPassword
       });

       const data = await inspector.save();

       // insert inspector into lgea model
       const lgea = await Lgea.findByIdAndUpdate({ _id: lgeaId }, {
            $push: {
                "otherInfo.0.inspectors": data.id
            }
       });

        // checking if the schools exist
        for(i = 0; i < schools.length; i++) {
          
           // check if the id  is valid
            if(objectId.isValid(schools[i])) {

                const schoolCheck = await School.findById({ _id: schools[i] });

            if(schoolCheck) {

                // check if the school is in lgea
                const school = await School.findOne( { $and: [ { _id : schools[i] }, { lgeaId : lgeaId } ] });

                if(school) {

                    // then push to the array
                    const push = await Inspector.findByIdAndUpdate({ _id: data._id }, {

                        $push: {
                            "schools.0.id": schools[i],
                            "schools.0.name": school.name
                        }
            
                        });
                        
                        // this just basically push the array
                        success.push({
                            status: true,
                            message: "INSERTED SUCCESSFULLY",
                            schoolId: schools[i]
                        });
                
                }else {

                    // failure push
                    failure.push({
                        error: "Sorry, School Does Not Belong to the Local Govenment Entered",
                        schoolId: schools[i]
                    });

                }

            }else {

                failure.push({
                    error: "Sorry, School Not Found",
                    schoolId: schools[i]
                });
            }

        }else {
            failure.push({
                error: "Oops, It's not valid ",
                schoolId: schools[i]
            });
        }
    }
    
    res.status(201).json({
        message: "QUERY_SUCCESS",
        status: true,
        query: data,
        failure: failure,
        success: success
    })
    return;
    
    }catch(error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return;

    }
});

router.put('/:id', async(req, res)=> {

    // checking if the admin is logged in
    // as usual the code will be here
     
    // getting all request body
    let { firstName, lastName, email, phone, lgeaId, schools, password, profileImg } = req.body;
    
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
    let inspectorEmail = email.toLowerCase();

    try{

        // check to see if the inspector already exist
        let inspectorCheck = await Inspector.findOne({ email: inspectorEmail }).count();
        
        if(inspectorCheck > 2) {

            res.status(400).json({
                error: "INSPECTOR_EXISTS",
                status: false,
                message: "Oops, Inspector already exist"
            });
            return;
        }

        // check if the lgea id is valid
        if(!objectId.isValid(lgeaId)) {

            res.status(400).json({
                error: "INVALID_ID",
                status: false,
                message: "Sorry, LGEA ID is not valid"
            })
            return;  
        }

        // check if the lgea id exist
        const lgeaExist = await Lgea.findById({ _id: lgeaId });
        if(!lgeaExist) { 
        
            res.status(404).json({
                error: "NOT_FOUND",
                status: false,
                message: "Sorry, LGEA ID was not found"
            })
            return;

        }
        
       // get exist inspector information
       let inspectorInfo = await Inspector.findOne({ email: inspectorEmail }); 

       // get local goverment id
       const id = inspectorInfo.lgeaId;
       
       // find again by id
       // request for help on this
       const lgea_id = await Lgea.find({"_id":id});
       
       // Initialing the array 
       const failure = [];
       const success = [];
        
       // hash password

       const data = await Inspector.findByIdAndUpdate({ 
           _id: req.params.id
        }, {
            $set: {

                firstName: firstName,
                lastName: lastName,
                email: inspectorEmail,
                phone: phone,
                lgeaId: new mongoose.Types.ObjectId(lgeaId),
                // pulling all school's id and name out
                "schools.0.id": [],
                "schools.0.name": []
            }
        });
        
        if(lgeaId != lgea_id[0].id){
            // updating the lgea model
            const lgea = await Lgea.findByIdAndUpdate({ _id: lgeaId }, {
                    $push: {
                        "otherInfo.0.inspectors": lgeaId
                    }, 
                    $pull: {
                        "otherInfo.0.inspectors":  req.params.id
                    }
            });
        }

        // checking if the schools exist
        for(i = 0; i < schools.length; i++) {
          
           // check if the id  is valid
            if(objectId.isValid(schools[i])) {

                const schoolCheck = await School.findById({ _id: schools[i] });

            if(schoolCheck) {

                // check if the school is in lgea
                const school = await School.findOne( { $and: [ { _id : schools[i] }, { lgeaId : lgeaId } ] });

                if(school) {

                    // then push to the array
                    const push = await Inspector.findByIdAndUpdate({ _id: data._id }, {

                        $push: {
                            "schools.0.id": schools[i],
                            "schools.0.name": school.name
                        }
            
                        });
                        
                        // this just basically push the array
                        success.push({
                            status: true,
                            message: "UPDATED_SUCCESSFULLY",
                            schoolId: schools[i]
                        });
                
                }else {

                    // failure push
                    failure.push({
                        error: "Sorry, School Does Not Belong to the Local Govenment Entered",
                        schoolId: schools[i]
                    });

                }

            }else {

                failure.push({
                    error: "Sorry, School Not Found",
                    schoolId: schools[i]
                });
            }

        }else {
            failure.push({
                error: "Oops, It's not valid ",
                schoolId: schools[i]
            });
        }
    }
    
    res.status(200).json({

        message: "UPDATED_SUCCESSFULLY",
        status: true,
        query: data,
        failure: failure,
        success: success
    })
    return;
    
    }catch(error) {

        console.log(error);

        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        })
        return;

    }

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

            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the inspector do not exist"
            })
            return;
        } else {

            // Make a delete request
            const deleteInspector = await Inspector.findByIdAndDelete({ _id: req.params.id});

            const lgeaId = checkInspector.lgeaId;

             // pull lgea
             var inspector =  deleteInspector.id ;

        // remove onto the lgea
        const lgeaInspector = await Lgea.findByIdAndUpdate({ _id: lgeaId },
              {
               $pull: {
                   "otherInfo.0.inspectors": inspector
               } 
        });

            if(deleteInspector && lgeaInspector) {

                res.status(200).send({
                    message: "DELETE_SUCCESS",
                    status: true,
                    query: deleteInspector
                })
                return;

            }

        }

    }catch(error) {
        console.error(error)
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        });
        return;

    }
});

module.exports = router;