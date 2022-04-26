const express = require('express');
const router = express.Router();
const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Loading the models
const Staff = require('../../../models/staff');
const Teacher = require('../../../models/teacher');
const Inspector = require('../../../models/inspector');
const School = require('../../../models/school');
const Lgea = require('../../../models/lgea');

// importing validation for staff
const { staffValidaion } = require('../../../utils/admin/validation')

// importing jwt authentication
// some code will be placed here

router.get('/', async( req, res) => {

    // validate to ensure admin is logged inspector
    
    try {

        const staff = await Staff.find({});

        res.status(200).json({
            message: "QUERY_SUCCESS",
            status: true,
            query: staff
        })
        return;
    } catch (error) {
        
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        });
        return;
    }
});

router.get('/:id', async(req, res) => {

    // checking if the admin is logged in
    // some code will be inserted here

    // check for valid id
    try{

        if(!objectId.isValid(req.params.id)) {

            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "Opps, You entered an invalid parameters"
            });
            return;
        }


        // check if the staff exist
     const staff = await Staff.findById({ _id: req.params.id });
     if(!staff) {

        res.status(404).json({
            error: "NONE_EXISTENCE",
            status: false,
            message: "Sorry, the user does not exist"
        });
        return;

     }else {

        res.status(200).json({
            message: "QUERY_SUCCESS",
            status: true,
            query: staff
        });
        return;
     }

    }catch(error) {

        console.log(error);
        res.status(500).json({
            error: "INERNAL_ERROR",
            status: false,
            message: error
        })

    }
});

router.post('/', async( req, res) => {

    // ensureing the admin is logged in for this
    // put some block of code Here

    // get all body requests
    const { firstName, lastName, phone, email, lgeas, priveledges } = req.body;
    
    const _list = [ "Add_Teacher", "Edit_Teacher", "Delete_Teacher", "Download_Report",
    "Generate_Code", "Inspect_Teacher", "Edit_Evaluation", "View_Teacher", "Add_School", "View_School", "Edit_School",
    "Add_Inspector", "Edit_Inspector", "Delete_Inspector", "Attendance" ];
    
    // validating the error
    const {error} = staffValidaion(req.body);

     // consructing the 
     const success = [];
     const failure = [];

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return;
    }

    // transforming string to lowercase
    let _e = email.toLowerCase();
    
    try {
        // check to see if the staff already exist
        const _check = await Staff.findOne({ $or: [ { email: _e }, { phone: phone } ] });

        if(_check){

            res.status(400).json({
                error: "STAFF_EXISTS",
                status: false,
                message: "Oops, Staff already exist; Kindly try other emial or phone. 🤟 ",
            });
            return;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(email, salt);
        
        // filterting out the privileges
        const filter = _list.filter(x => priveledges.indexOf(x) !== -1 );
    
        const staff = Staff({
            staffId: uuidv4(),
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: _e,
            password: hashPassword,
            priveledges: filter
        });

        const data = await staff.save();

        // checking for each of the local goverment
        for( i = 0; i < lgeas.length; i++ ) {

            // check if the lgea entered is valid
            if(objectId.isValid(lgeas[i])) {

                const _l = await Lgea.findOne({ _id: lgeas[i] });
                
                const _u = await Lgea.findByIdAndUpdate({_id: lgeas[i]}, {
                    $push: {
                        "otherInfo.0.staffs": data._id
                    }
                });

                if( _l ) {

                    // then push to the array
                    const push = await Staff.findByIdAndUpdate({ _id: data._id }, {
                        $push: {
                            "lgeas": lgeas[i]
                        }
                    });

                    success.push({
                        status: true,
                        message: "INSERTED_SUCCESSFULLY",
                        lgeaId: lgeas[i]
                    });
                }else {
                    
                     // failure push
                     failure.push({
                        status: false,
                        error: "Sorry, Lgea Does not exist.",
                        lgeaId: lgeas[i]
                    });
                }
            } else {
                failure.push({
                    status: false,
                    error: "Sorry, An invalid id entered",
                    lgeaId: lgeas[i]
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

        console.error(error);
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error.message
        });
    }
});

router.put('/:id', async( req, res) => {
    // ensureing the admin is logged in for this
    // put some block of code Here

    // get all body requests
    const { firstName, lastName, phone, email, profileImg, password, lgeas, priveledges } = req.body;
    
    const _list = [ "Add_Teacher", "Edit_Teacher", "Delete_Teacher", "Download_Report",
    "Generate_Code", "Inspect_Teacher", "Edit_Evaluation", "View_Teacher", "Add_School", "View_School", "Edit_School",
    "Add_Inspector", "Edit_Inspector", "Delete_Inspector", "Attendance" ];
    
    // validating the error
    const {error} = staffValidaion(req.body);

     // consructing the 
     const success = [];
     const failure = [];

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return;
    }
        // check to see if id is valid
        if(!objectId.isValid(req.params.id)) {
          
            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            });
            return;   
        }

    // transforming string to lowercase
    let _e = email.toLowerCase();
    
    try {
        // check to see if the staff already exist
        const _check = await Staff.findOne({ $or: [ { email: _e }, { phone: phone } ] }).count();

        if(_check){

            res.status(400).json({
                error: "STAFF_EXISTS",
                status: false,
                message: "Oops, Staff already exist; Kindly try other emial or phone. 🤟 ",
            });
            return;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        
        // filterting out the privileges
        const filter = _list.filter(x => priveledges.indexOf(x) !== -1 );

        const data = await staff.findByIdAndUpdate({_id: req.params.id}, {
            $set: {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: _e,
                profileImg: profileImg,
                password: hashPassword,
                priveledges: filter
            }
        });

        // checking for each of the local goverment
        for( i = 0; i < lgeas.length; i++ ) {

            // check if the lgea entered is valid
            if(objectId.isValid(lgeas[i])) {

                const _l = await Lgea.findOne({ _id: lgeas[i] });
                
                const _u = await Lgea.findByIdAndUpdate({_id: lgeas[i]}, {
                    $push: {
                        "otherInfo.0.staffs": data._id
                    }
                });

                if( _l ) {

                    // then push to the array
                    const push = await Staff.findByIdAndUpdate({ _id: data._id }, {
                        $push: {
                            "lgeas": lgeas[i]
                        }
                    });

                    success.push({
                        status: true,
                        message: "INSERTED_SUCCESSFULLY",
                        lgeaId: lgeas[i]
                    });
                }else {
                    
                     // failure push
                     failure.push({
                        status: false,
                        error: "Sorry, Lgea Does not exist.",
                        lgeaId: lgeas[i]
                    });
                }
            } else {
                failure.push({
                    status: false,
                    error: "Sorry, An invalid id entered",
                    lgeaId: lgeas[i]
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

        console.error(error);
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error.message
        });
    }

});

router.delete('/:id', async( req, res) => {

    const success = [];
    // validate if the user is logged in
    // put some code section here

    try {

        // check to see if id is valid
        if(!objectId.isValid(req.params.id)) {
          
            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            });
            return;   
        }

        const _s = await Staff.findById({ _id: req.params.id });
        
        const lgeas = _s.lgeas;
        console.log(_s.lgeas);

        if(!_s) {

            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the staff do not exist"
            });
            return;
        }

       const deleteStaff = await Staff.findByIdAndDelete({ _id: req.params.id });
        
       if(deleteStaff) {
            // pulling form lgea arrays
            for(i = 0; i < lgeas.length; i++) {
                const _u = await Lgea.findByIdAndUpdate({_id: lgeas[i]}, {
                    $pull: {
                        "otherInfo.0.staffs": req.params.id
                    }
                }); 
            }

            success.push({
                status: true,
                message: "REMOVED_SUCCESSFULLY",
                lgeaId: lgeas[i]
            });
        }

        res.status(200).send({
            message: "DELETE_SUCCESS",
            status: true,
            query: deleteStaff,
            moreInfo: success
        })
        return;

    }catch(error){

        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error.message
        });
        return;
    }
});

module.exports = router;