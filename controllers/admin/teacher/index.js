const mongoose = require('mongoose');
const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Loading the models
const Teacher = require('../../../models/teacher');
const Inspector = require('../../../models/inspector');
const School = require('../../../models/school');
const Lgea = require('../../../models/lgea');

// importing the validation needed for this as well
const { teacherValidation } = require('../../../utils/admin/validation');

const _getAll = async (req, res) => {

    // same procedure as before that what you should do here
    // ie ensure admin is logged in

    try{

        const teacher = await Teacher.find({});

        res.status(200).json({
            message: "QUERY_SUCCESS",
            status: true,
            query: teacher
        });

        return;
    }catch(error) {

        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        });
        return;
    }

}

const _getSpecific =  async (req, res) => {

    // check to see fi the admin is logged in
    // some code will be inserted here

    // checking for valid id
    try {

        if(!objectId.isValid(req.params.id)) {

            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "Sorry, you've entered a wrong id."
            });
            return;
        }

        // check to see if teacher's exist
        const teacher = await Teacher.findOne({ _id: req.params.id }).exec();

        if(!teacher){

            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the teacher do not exist"
            });
            return;
        }else {

            res.status(200).json({
                message: "QUERY_SUCCESS",
                status: true,
                query: teacher
            });
            return;
        }
    }catch(error) {

        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        });
    }
}

const _insert = async (req, res) => {

    // ensuring that admin is logged in for this
    // putting some block of code here


    //get all body requests
    const { lgeaId, schoolId, firstName, lastName, otherName, gender, phone, email, dob, position, yearsOfExperience, gradeLevel, 
    discipline, qualification, category, mathSpecial, status } = req.body;

    // validating the error
    const { error } = teacherValidation(req.body);

    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return;
    }

    // check if the lgeaId is valid
    if(!objectId.isValid(lgeaId)) {
        res.status(400).json({
            error: "INVALID_ID",
            status: false,
            messege: "Sorry, You've just entered an invalid LGEA ID"
        });
        return;
    }

     try {

    // check if the lgeadId exist
    const _l = await Lgea.find({ _id: lgeaId });
    
    
    if( !_l ) {
        res.status(404).json({
            error: "NONE_EXISTENCE",
            status: false,
            message: "Sorry, LGEA ID does not exist"
        });
        return;
    }
    
    // check if the schoolId is valid
    if(!objectId.isValid(schoolId)) {
        res.status(400).json({
            error: "INVALID_ID",
            status: false,
            messege: "Sorry, You've just entered an invalid School ID"
        });
        return;
    }

     // check if the school Id exist
     const _checkSchool = await School.find({ _id: schoolId })

     // generate teacher'sId using uuid
     if( !_checkSchool ) {
         res.status(400).json({
             error: "NONE_EXISTENCE",
             status: false,
             message: "Sorry, the school does not exist"
         });
         return;
     }

    // checking if the school in in the localgoverment
    const _checkSchoolValidity  = await Lgea.findOne({ $and: [  { _id: lgeaId  } ]});
   
    if(!_checkSchoolValidity) {
        res.status(400).json({
            error: "VALIDITY_INVALID",
            status: false,
            message: "Sorry, that school is not in that Local Government"
        });
        return;
    }
    
    // check if the phone is aldeady registered
    const _p = await Teacher.findOne({ phone: phone });

    if( _p ) {
        res.status(400).json({
            error: "ALREADY_REGISTERED",
            status: false,
            message: "Sorry, the user is already registered using that phone number"
        });
        return;
    }

    const _e = await Teacher.findOne({ email: email });
    
    if( _e ) {
        res.status(400).json({
            error: "ALREADY_REGISTERED",
            status: false,
            message: "Sorry, the user is already registered using that email"
        });
        return;
    }

    // get all inspectors in that table assiged to the person
    
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(email, salt);

     
    const options = {
        method: 'POST',
        url: 'https://bar-qr-code-generator.p.rapidapi.com/encoded/api',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Host': process.env.API_HOST,
          'X-RapidAPI-Key': process.env.API_SECRET
        },

        data: `{"codes":[{"data":"${uuidv4()}","type":"qr_code","size":5}]}`
      };

       // making the axios call
       const axiosCall = await axios.request(options);
      
       // teachers barcode
       const barCodeImage = axiosCall.data.codes[0].png;
 
       const barCodeProperty = axiosCall.data.codes[0].data;

    // constructing the object needed for insertion
    const teacherObject = {
        adminId: new mongoose.Types.ObjectId(req.admin.id),
        lgeaId: new mongoose.Types.ObjectId(lgeaId),
        schoolId: new mongoose.Types.ObjectId(schoolId),
        teacherId: uuidv4(),
        firstName: firstName, 
        lastName: lastName,
        otherName: otherName,
        gender: gender,
        phone: phone, 
        email: email,
        dob: dob, 
        position:position, 
        yearsOfExperience:yearsOfExperience,
        gradeLevel:gradeLevel, 
        discipline:discipline,
        qualification:qualification,
        class:category,
        mathSpecial:mathSpecial,
        barcodes: barCodeImage,
        barcodeProperty: barCodeProperty,
        status:status,
        password: hashPassword
    };

    // saving the teacher into the database
    const query = await Teacher.create(teacherObject);

      // Selecting the inspector under that localgoverment
      const _addTeachers = await Inspector.updateMany({ lgeaId: lgeaId }, {
             $push: {
                 "teachers.0.name": query.firstName+' '+query.lastName,
                 "teachers.0.id": query.id
             }
          
      });


      // Adding the teachers to the localgovernment
      const _addLgea = await Lgea.findOneAndUpdate({ _id : lgeaId }, {
            $push: {
                "otherInfo.0.teachers": query.id
            }
      });

    if(query && _addLgea && _addLgea) {

        res.status(201).json({
            message: "QUERY_SUCCESS",
            status: true,
            data: query
        });
        return;
    }

    } catch(error) {

        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error.message
        });
        return;

    }
}

const _update = async(req, res) => {
    
}

const _delete = async (req, res) => {

    // check to see if the admin is logged in
    // put some code here

    try {

        // check to see if id is valid
        if(!objectId.isValid(req.params.id)) {

            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            })
            return;
        }

        // check teacher if exist as usual
        const checkTeacher = await Teacher.findById({ _id: req.params.id }).populate('lgeaId');

        if(!checkTeacher) {

            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the teacher do not exist"
            });
            return;
        }

        const lgeaId = checkTeacher.lgeaId.id;
        
         const deleteTeacher = await Teacher.findByIdAndDelete({ _id: req.params.id });

         // removing the teacher from Inspector's table
        const _removeTeachers = await Inspector.updateMany({ lgeaId: lgeaId }, {
            $pull: {
                "teachers.0.name": checkTeacher.firstName+' '+checkTeacher.lastName,
                "teachers.0.id": checkTeacher.id
            }
        
    });

    // removing the teachers to the local government
    const _removeTeacherFromLgea = await Lgea.findOneAndUpdate({ _id : lgeaId }, {
        $pull: {
            "otherInfo.0.teachers": checkTeacher.id
        }
    });

    if(_removeTeacherFromLgea && _removeTeachers && deleteTeacher) {
        
        res.status(200).send({
            message: "DELETE_SUCCESS",
            status: true,
            query: deleteTeacher
        })
        return;

    }
            
        // some task will be performed here for teachers on lgea
        // some task too will be performed on school too as well
    }catch(error) {
        console.log(error)
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: "Sorry, An Internal Error Occured"
        })
    }
}

module.exports = { _getAll, _getSpecific, _insert, _update, _delete }