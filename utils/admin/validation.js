const Joi = require('joi');

// Register Validation 
const registerValidation = data => {

    const schema = Joi.object({
        firstName: Joi.string().min(6).required(),
        lastName: Joi.string().min(6).required(),
        email: Joi.string().required().email(),
        isAdmin: Joi.boolean().required(),
        profileImg: Joi.string(),
        password: Joi.string().min(6).required(),
        isVerified: Joi.boolean()
    });

    return schema.validate(data);
}

// Login Validation 
const loginValidation = data => {

    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(data);
}

// Lgea Validation
const lgeaValidation = data => {

    const schema = Joi.object({
        name: Joi.string().required(),
        color: Joi.string().required(),
        image: Joi.string()
    })

    return schema.validate(data)
}

// Inspector Validatieon
const inspectorValidation = data => {

    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string(),
        schools: Joi.array().required(),
        password: Joi.string().required()
    })

    return schema.validate(data);
}

module.exports = { 
    registerValidation,
    loginValidation,
    lgeaValidation,
    inspectorValidation
}