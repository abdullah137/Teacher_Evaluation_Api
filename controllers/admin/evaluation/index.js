const mongoose = require('mongoose')
const objectId = require('mongoose').Types.ObjectId;

// Loading the models 
const Evaluation = require('../../../models/evaluation');
const Teacher = require('../../../models/teacher');

// importing the validation for inspection
const { evaluationValidation } = require('../../../utils/admin/validation');

const _getAll = async(req, res) => {

    // validate to ensure admin is logged in

    try {

        const evaluation = await Evaluation.find({});

        if(evaluation) {
            res.status(200).json({
                message: "QUERY_SUCCESS",
                status: true,
                query: evaluation
            })
            return;
        }
    }catch(error) {

        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error.message
        });
        return;        
    }
}

const _getSpecific = async(req, res) => {
    
    // check to see if the user is loged in
    
    try {
        // check to see id is valid
        if(!objectId.isValid(req.params.id)) {
           
            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            })
            return;  
 
        }

        // check if evalutaion exists
        const checkEvaluationExist = await Evaluation.findOne({ _id: req.params.id });

        if(!checkEvaluationExist) {
            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the evaluation does not exists"
            })
            return;
        } else {

            res.status(200).json({
                message: "QUERY_SUCCESS",
                status: true,
                query: checkEvaluationExist
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
}

const _getEvaluation =  async(req, res) => {

    // Check to see if the admin is logged in
    // Perform some checks here

    const paramsId = req.params.id
    const evaluation = req.params.eval;

    // check to see if the user is loged in    
    try {
        // check to see id is valid
        if(!objectId.isValid(paramsId)) {
        
            res.status(400).json({
                error: "INVALID_PARAMETERS",
                status: false,
                message: "sorry, you entered an invalid paramater"
            })
            return;  

        }

        // check if evalutaion exists
        const checkEvaluationExist = await Evaluation.findOne({ $and: [{ _id: paramsId }, { evaluation: evaluation}] });

        if(!checkEvaluationExist) {
            res.status(404).json({
                error: "NONE_EXISTENCE",
                status: false,
                message: "Sorry, the evaluation does not exists"
            })
            return;
        } else {

            res.status(200).json({
                message: "QUERY_SUCCESS",
                status: true,
                query: checkEvaluationExist
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

}

const _insert = async(req, res) => {
    
    // checking if the admin is logged
    // put some block of code here

    // get all body request
    const { inspectorId, teacherId,
    eval_1, m_1, eval_2, m_2, eval_3, m_3,
    eval_4, m_4, eval_5, m_5, eval_6, m_6,
    eval_7, m_7, eval_8, m_8, eval_9, m_9,
    totalStudent, evaluation, subject, duration,
    comment } = req.body;

    // validate for errors
    const { error } = evaluationValidation(req.body);
    
    if(error) {
        res.status(400).json({
            error: "FIELD_REQUIREMENT",
            status: false,
            message: error.details[0].message
        });
        return;
    }

    // check to see if teacher id is valid
    if(!objectId.isValid(teacherId)) {
        res.status(400).json({
            error: "INVALID_ID",
            status: false,
            message: "Sorry, You've just entered an invalid id for teacher"
        });
        return;
    }

    try {

        // check to see if teacherExist
        const checkTeacher = await Teacher.find({ _id: teacherId });

                if(!checkTeacher) {
        
                    res.status(404).json({
                        error: "NONE_EXISTENCE",
                        status: false,
                        message: "Sorry, LGEA ID does not exist"
                    });
                    return;
                }

        // Check if the entry has been entred bfore
        const checkEvaluation = await Evaluation.findOne({ $and: [{teacherId: mongoose.Types.ObjectId(teacherId)}, {evaluation: evaluation} ]});

        if(checkEvaluation) {

            res.status(400).json({
                error: "DUPLICATE_ENTRY",
                status: false,
                message: "Sorry, an entry has been made"
            });
            return;
        }

        // get the grades of teachers
        const grades = [ m_1, m_2, m_3, m_4, m_5, m_6, m_7, m_8, m_9 ];
        // computing for the avarage using for loop
        var total = 0;
    
        for(i = 0; i < grades.length; i++) {
            total += parseInt(grades[i]);
        }
        var average = Math.ceil((total/36)*100);
        
        // getting ratings based on average
        var rating = "";
        if(average <= 40) {
            rating = "inadequate"
        }else if(average >= 40 && average <= 60) {
            rating = 'poor'
        }else if(average >= 60 && average <= 80) {
            rating = "good"
        } else {
            rating = "great";
        }

        // contruct the object need for this
        const evaluationObject = {
            teacherId: new mongoose.Types.ObjectId(teacherId),
            eval_1, m_1, eval_2, m_2, eval_3, m_3,
            eval_4, m_4, eval_5, m_5, eval_6, m_6,
            eval_7, m_7, eval_8, m_8, eval_9, m_9,
            totalStudent, evaluation, subject, duration,
            total:average, rating: rating, comment
        }

        // saving the evalution into the database
        const query = await Evaluation.create(evaluationObject);

        // Updating the info about the teacher
        const updateTeacher = await Teacher.findByIdAndUpdate(teacherId, {
            $push: {
                "inspect.0.evaluationId": query._id,
                "inspect.0.evaluationNumber": query.evaluation,
            }
        });

        // Checking if the it's inserted
        if(query && updateTeacher) {

            res.status(201).json({
                message: "QUERY_SUCCESS",
                status: true,
                data: query
            });
            return;
        }

    } catch(error) {
        console.log(error.message)
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

const _delete = async(req, res) => {
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

        // Check to see if the id exist
        const checkEvaluation = await Evaluation.find({ _id: req.params.id} ).populate('Teacher');

        console.log(checkEvaluation);
    //     if(!checkEvaluation) {

    //         res.status(404).json({
    //             error: "NONE_EXISTENCE",
    //             status: false,
    //             message: "Sorry, the evaluation do not exist"
    //         });
    //         return;
    //     }

    //      const deleteEvaluation = await Evaluation.findByIdAndDelete({ _id: req.params.id });

         
    //      // Updating the info about the teacher
    //      const updateEvaluation = await Teacher.findByIdAndUpdate(req.params.id, {
    //         $pull: {
    //             "inspect.0.evaluationId": query._id,
    //             "inspect.0.evaluationNumber": query.evaluation,
    //         }
    //     });


    // if(deleteEvaluation && updateEvaluation) {
        
    //     res.status(200).send({
    //         message: "DELETE_SUCCESS",
    //         status: true,
    //         query: deleteEvaluation
    //     })
    //     return;

    // }

    }catch(error) {

        console.log(error)
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: "Sorry, An Internal Error Occured"
        });
        return;

    }
}

module.exports = { _delete, _update, _getEvaluation, _getSpecific, _getAll, _insert }