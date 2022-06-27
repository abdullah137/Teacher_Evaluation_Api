const mongoose = require('mongoose');

// Loading the models 
const Evaluation = require('../../../models/evaluation');
const Teacher = require('../../../models/teacher');
const Inspector = require('../../../models/inspector');

// Importing the validation for inspecton
const { evaluationValidation } = require('../../../utils/inspector/validation');

const getAllEvaluation = async (req, res) => {
    
    // validate to ensure inspector is logged in
    const inspector = req.inspector

    try {

        const evaluation = await Evaluation.find({inspectorId: new mongoose.Types.ObjectId(inspector.id)});

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

const getSpecificEvaluation = async (req, res) => {

    const inspector = req.inspector

       // check to see if the user is logged in
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

const insertEvaluation = async (req, res) => {

    // checking if the inspector is active
    const inspector = req.inspector;

    // check if inspector exist
    const checkInspector = await Inspector.findOne({ _id: inspector.id });
    
    if(!checkInspector) {
        res.status(400).json({
            error: "BAD_REQUEST",
            message: "Sorry, that's a bad request, inspector does not exist",
            status: false
        })
        return;
    }

    // get all request body
    const { teacherId,
        eval_1, m_1, eval_2, m_2, eval_3, m_3,
        eval_4, m_4, eval_5, m_5, eval_6, m_6,
        eval_7, m_7, eval_8, m_8, eval_9, m_9,
        totalStudent, evaluation, subject, duration,
        comment  } = req.body;

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
    // check if teacher exists
    const checkTeacher = await Teacher.findOne({ _id: teacherId });

    if(!checkTeacher) {

        res.status(404).json({
            error: "NONE_EXISTENCE",
            status: false,
            message: "Sorry, teacher does not exist"
        });
        return;
    }

    // Check if the entry has been entered before
    const checkEvaluation = await Evaluation.findOne({ $and:
     [{teacherId: mongoose.Types.ObjectId(teacherId)}, {evaluation: evaluation} ]});

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

    }catch(error) {
        
        console.log(error.message)
        res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: error.message
        });
        return;
    
    }
}

const deleteEvaluation = async(req, res) => {
    
}

const updateEvaluation = async (req, res) => {

}

module.exports = { getAllEvaluation, getSpecificEvaluation, insertEvaluation, deleteEvaluation,updateEvaluation }