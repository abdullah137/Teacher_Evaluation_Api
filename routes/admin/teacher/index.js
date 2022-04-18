const express = require('express');
const router = express.Router();
const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

// Loading the models
const Teacher = require('../../../models/teacher');
const Inspector = require('../../../models/inspector');
const School = require('../../../models/school');

// importing the validation needed for this as well
const { teacherValidation } = require('../../../utils/admin/validation');

router.get('/', async (req, res) => {

    // same procedure as before that what you should do here
    // ie ensure admin is logged in

    try{

        const teacher = await Teacher.find({});

        res.status(200).status({
            message: "QUERY_SUCCESS",
            status: true,
            query: teacher
        });

        return;
    }catch(error) {

        res.send(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        });
        return;
    }

});

router.get('/:id', (req, res) => {

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
});

router.post('/', (req, res) => {

});

router.put('/:id', (req, res) => {

});

router.delete('/:id)', (req, res) => {

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
        const checkTeacher = await Teacher.findById({ _id: req.params.id });

        if(!checkTeacher) {

            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the teacher do not exist"
            });
            return;
        }

        const deleteTeacher = await Teacher.findByIdAndDelete({ _id: req.params.id });

        // some task will be performed here for teachers on lgea
        // some task too will be performed on school too as well
    }catch(error) {

    }
});

module.exports = router;