const Joi = require('joi');

// Register Validation 
const registerValidation = data => {

    const schema = Joi.object({
        firtName: Joi.string().min(6).required(),
        lastName: Joi.string().min(6).required(),
        email: Joi.string().required().email(),
        isAdmin: Joi.boolean().required(),
        profileImg: Joi.string(),
        password: Joi.string().min(6).required(),
        otpCode: Joi.number().min(6).required(),
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

module.exports = { registerValidation, loginValidation }