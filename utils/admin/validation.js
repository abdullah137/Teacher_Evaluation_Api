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

// Inspector Validation
const inspectorValidation = data => {

    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string(),
        lgeaId: Joi.string().required(),
        schools: Joi.array().required(),
        password: Joi.string(),
        profileImg: Joi.string(),
    });

    return schema.validate(data);
}

// School Validation
const schoolValidation = data => {

    const schema = Joi.object({
        name: Joi.string().required(),
        lgea: Joi.string().required()
    });

    return schema.validate(data);
}

// Teacher Validation
const teacherValidation = data => {

    const schema = Joi.object({
        lgeaId: Joi.string().required(),
        schoolId: Joi.string().required(),
        teacherId: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        otherName: Joi.string(),
        gender: Joi.string().valid("M","F").required(),
        phone: Joi.string().required(),
        email: Joi.string().required(),
        dob: Joi.string().required(),
        lgea: Joi.string().required(),
        position: Joi.string().valid("SM", "PT", "ASM", "NTS").required(),
        yearsOfExperience: Joi.number().required(),
        gradeLevel: Joi.number().required(),
        discipline: Joi.string().required(),
        qualification: Joi.string().required(),
        class: Joi.string().required(),
        mathSpecial: Joi.string().required,
        status: Joi.number().valid(1,2),
        baarcode: Joi.string(),
        barcodeProperty: Joi.string(),
        password: Joi.string()
    });

    return schema.validate(data);
}

module.exports = { 
    registerValidation,
    loginValidation,
    lgeaValidation,
    inspectorValidation,
    schoolValidation,
    teacherValidation
}