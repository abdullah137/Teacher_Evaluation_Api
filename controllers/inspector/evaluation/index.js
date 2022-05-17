const mongoose = require('mongoose');

// Loading the models 
const Evaluation = require('../../../models/evaluation');
const Teacher = require('../../../models/teacher');

const getAllEvaluation = async (req, res) => {
    
    // validate to ensure inspector is logged in
    const inspector = req.inspector
    console.log(inspector)
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

}

const insertEvaluation = async (req, res) => {

}

const deleteEvaluation = async(req, res) => {
    
}

const updateEvaluation = async (req, res) => {

}

module.exports = { getAllEvaluation, getSpecificEvaluation, insertEvaluation, deleteEvaluation,updateEvaluation }