// Loading the models 
const Evaluation = require('../../../models/evaluation');

// importing the validation for inspection
//const {  }

// importing jwt verfication
// some code will be placed here

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

}

const _getEvaluation =  async(req, res) => {

}

const _update = async(req, res) => {

}

const _delete = async(req, res) => {

}

module.exports = { _delete, _update, _getEvaluation, _getSpecific, _getAll }