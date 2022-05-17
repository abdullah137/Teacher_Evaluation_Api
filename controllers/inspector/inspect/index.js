const mongoose = require('mongoose');

// Loading the models 
const Evaluation = require('../../../models/evaluation');
const Teacher = require('../../../models/teacher');

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

const insertEvaluation = async (req, res) => {

}

const deleteEvaluation = async(req, res) => {
    
}

const updateEvaluation = async (req, res) => {

}

module.exports = { getAllEvaluation, getSpecificEvaluation, insertEvaluation, deleteEvaluation,updateEvaluation }