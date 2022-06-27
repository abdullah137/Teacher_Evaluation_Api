const Teacher = require('../../../models/teacher');
const objectId = require('mongoose').Types.ObjectId;

const getAllTeachers = async(req, res) => {
    
    // same procedure as before that what you should do here
    // ie ensure admin is logged in
    const inspectorInfo = req.inspector;

    try{

        const teacher = await Teacher.find({ lgeaId: inspectorInfo.lgeaId.id }).select('-yearsOfExperience -qualification -adminId -barcodes -mathSpecial -class -position -gradeLevel -discipline -status -barcodeProperty -password -dob');

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

const getDetailTeacher = async(req, res) => {
    
    // same procedure as before that what you should do here
    // ie ensure admin is logged in
    const inspectorInfo = req.inspector;

    try{

        // getting the id passed
        const paramsId = req.params.id

        // check if id is valid
        if(!objectId.isValid(paramsId)) {

            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            })
            return; 
        }

        const teacher = await Teacher.find({ $and: [ { lgeaId: inspectorInfo.lgeaId.id }, { _id: paramsId } ] }).select('-adminId -barcodeProperty -password -dob');

        if(!teacher) {

            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the local government do not exist"
            })
            return;

        } else {
       
            res.status(200).json({
                message: "QUERY_SUCCESS",
                status: true,
                query: teacher
            });
    
            return;
       
        }
            
    }catch(error) {
        console.log(error)
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error
        });
        return;
    }
}

module.exports = { getAllTeachers, getDetailTeacher }