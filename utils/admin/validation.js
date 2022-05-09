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
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        otherName: Joi.string(),
        gender: Joi.string().valid("M","F").required(),
        phone: Joi.string().required(),
        email: Joi.string().required(),
        dob: Joi.string().required(),
        position: Joi.string().valid("SM", "PT", "ASM", "NTS").required(),
        yearsOfExperience: Joi.number().required(),
        gradeLevel: Joi.number().required(),
        discipline: Joi.string().required(),
        qualification: Joi.string().required(),
        category: Joi.string().required(),
        mathSpecial: Joi.boolean().required(),
        status: Joi.number().valid(0,1),
        barcode: Joi.string(),
        barcodeProperty: Joi.string(),
        password: Joi.string()
    });

    return schema.validate(data);
}

const staffValidaion = (data) => {

    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().required().email(),
        profileImg: Joi.string(),
        password: Joi.string(),
        lgeas: Joi.array().required(),
        priveledges: Joi.array().items(Joi.valid("Add_Teacher", "Edit_Teacher", "Delete_Teacher", "Download_Report",
        "Generate_Code", "Inspect_Teacher", "Edit_Evaluation", "View_Teacher", "Add_School", "View_School", "Edit_School",
        "Add_Inspector", "Edit_Inspector", "Delete_Inspector", "Attendance"))
    });

    return schema.validate(data);
}

module.exports = { 
    registerValidation,
    loginValidation,
    lgeaValidation,
    inspectorValidation,
    schoolValidation,
    teacherValidation,
    staffValidaion
}