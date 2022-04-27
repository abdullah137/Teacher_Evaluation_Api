const objectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');

// Loading the model
const School = require('../../../models/school');
const Lgea = require('../../../models/lgea');

// importing the validation needed
const { schoolValidation } = require('../../../utils/admin/validation')

const _getAll = async(req, res) => {
   
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

}

const _insert = async(req, res) => {
    
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

         // check to see if is valid
    if(!objectId.isValid(lgea)) {

            res.status(400).json({
                error: "INVALID_ID",
                status: false,
                message: "Sorry, you entered an invalid id for local government"
            })
            return;  
        }

    try{

        // check to see if the localgovernment already exist
        const _l = await Lgea.findOne({ _id: lgea });

        // check to see if the local government exist
            if(!_l) {

                res.status(400).json({
                    error: "NONE_EXISTENCE",
                    status: false,
                    message: "Oops, the local goverment does not exist"
                });
                return;
            }

         // get lgeaName
         const lgeaName = _l.name;    

        // check to see if the school exist
        const schoolExist =  await School.findOne({name: schoolName, lgea: lgea});
    
        if(schoolExist) {
            res.status(400).json({
                error: "SCHOOL_EXISTS",
                status: false,
                message: "Oops, School already exist"
            });
            return;
        }    
    
        // then insert the school
        const saveSchool = await School.create({ name: schoolName, lgea: lgeaName, lgeaId: lgea });
        
        // school Id
        var schools =  saveSchool._id ;

        // insert onto the lgea
        const updateLgea = await Lgea.findByIdAndUpdate({ _id: lgea },
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
        console.log(error)
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error.message
        })
        return;

    }

}

const _update = async(req, res) => {

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

    // check to see if is valid
    if(!objectId.isValid(lgea)) {

        res.status(400).json({
            error: "INVALID_ID",
            status: false,
            message: "Sorry, you entered an invalid id for local government"
        })
        return;  
    }

    // checking the school if exist
    const _e = await School.findById({ _id: req.params.id});
    const _lgeaId = _e.lgeaId;
    
    // getting previous details from school
    const _getLgeaInfo = await Lgea.findById(_lgeaId);
    console.log(_getLgeaInfo.id)
    if(!_e) {

        res.status(400).json({
            error: "NONE_EXISTENCE",
            status: false,
            message: "Sorry, the School does not exist"
        })
        return;
    }

    // check if the admin is logged in
    // there will be some code here

     try {

        // check to see if the localgovernment already exist
        const _l = await Lgea.findOne({ _id: lgea });
        
         // check to see if the local government exist
        if(!_l) {

            res.status(400).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Oops, the local goverment does not exist"
            });
            return;
        }

        const updateSchool = await School.updateOne({ _id: req.params.id }, {
            $set: req.body
        }, {new: true});



    if(_lgeaId.toString() != new mongoose.Types.ObjectId(lgea).toString()) {
        console.log("it is here")
        // pull it aout and push it to the onew one
        const getcheck = await Lgea.findById({ _id: _getLgeaInfo.id });
    
        const _q = await Lgea.findByIdAndUpdate({ _id: _getLgeaInfo.id  }, {
            $pull: {
                 "otherInfo": { $elemMatch: { "schools": "6268b83c5dff42b0f83f2f90" } }
            }
        });

       
    }

        res.status(200).send({
            message: "UPDATED_SUCCESSFULLY",
            status: true,
            query: updateSchool
        })
        return;

     }catch(error) {
        console.log(error)
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error.message
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
        });
        return;
    }

}

module.exports = { _getAll, _getSpecific, _insert, _update, _delete }