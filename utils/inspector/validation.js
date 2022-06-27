const Joi = require('joi');

// Login Validation
const loginValidation = data => {

    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

const profileValidation = data => {

    const schema = Joi.object({
        email: Joi.string().required().email(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

const evaluationValidation = (data) => {

    const schema = Joi.object({
        teacherId: Joi.string().required(),
        eval_1: Joi.string().required(),
        m_1: Joi.number().valid(1,2,3,4).required(),
        eval_2: Joi.string().required(),
        m_2: Joi.number().valid(1,2,3,4).required(),
        eval_3: Joi.string().required(),
        m_3: Joi.number().valid(1,2,3,4).required(),
        eval_4: Joi.string().required(),
        m_4: Joi.number().valid(1,2,3,4).required(),
        eval_5: Joi.string().required(),
        m_5: Joi.number().valid(1,2,3,4).required(),
        eval_6: Joi.string().required(),
        m_6: Joi.number().valid(1,2,3,4).required(),
        eval_7: Joi.string().required(),
        m_7: Joi.number().valid(1,2,3,4).required(),
        eval_8: Joi.string().required(),
        m_8: Joi.number().valid(1,2,3,4).required(),
        eval_9: Joi.string().required(),
        m_9: Joi.number().valid(1,2,3,4).required(),
        totalStudent: Joi.number().required(),
        evaluation: Joi.number().valid("first", "second", "third").required(),
        subject: Joi.string().required(),
        duration: Joi.string().required(),
        comment: Joi.string().required()
    });

    return schema.validate(data);
}

module.exports = { loginValidation, evaluationValidation, profileValidation }