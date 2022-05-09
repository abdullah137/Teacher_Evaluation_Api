const mongoose = require('mongoose');
const teacherSchema = new mongoose.Schema({
   adminId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Admin'
   },
   lgeaId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'lgea',
       required: true
   },
   schoolId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'School',
       required: true
   },
   teacherId: {
       type: String,
       required: true
   },
   firstName: {
       type: String,
       required: true
   },
   lastName: {
       type: String,
       required: true
   },
   otherName: {
       type: String
   },
   gender: {
       type: String,
       enum: [ "M", "F" ],
       required: true
   },
   phone: {
       type: String,
       required: true
   },
   email: {
       type: String,
       required: true
   },
   dob: {
       type: Date,
       required: true
   },
   position: {
       type: String,
       required: true,
       enum: [ "SM", "PT", "ASM", "NTS" ]
   },
   yearsOfExperience: {
       type: Number,
       required: true
   },
   gradeLevel: {
       type: Number,
       required: true
   },
   discipline: {
       type: String,
       required: true
   },
   qualification: {
       type: String,
       required: true
   },
   class: {
       type: String,
       required: true
   },
   mathSpecial: {
       type: Boolean,
       required: true
   },
   status: {
       type: Number,
       requied: true,
       enum: [ 0, 1],
       default: 0
   },
   barcodes: {
       type: String,
   },
   barcodeProperty: {
       type: String
   },
   password: {
       type: String,
       required: true
   },
   insertedBy: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Staff', 
   },
   inspect: [
       { 
            evaluationNumber: {
                type: Number
            },
            evaluationStatus: {
                type: Number,
                enum: [0, 1],
                default: 0
            }
       }
   ]
});

module.exports = mongoose.model('teacher', teacherSchema)