const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Welcome to BAF Electronic Evaluation Portal 👨‍💻"
    })    
})

router.get('/about', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Bunmi Adedayo Foundation Electronic Evaluation Portal (BEEP) is an innovative approach developed to digitize the monitoring and evaluation process of the Foundation’s projects. It makes it easy for the Foundation to track performance and measure impact of its various projects overtime. BEEP provides quantitative and inferential analysis for all the Foundation’s projects. BEEP is your go-to application for real-time access to BAF’s project metrics for planning and decision-making purposes. With BEEP, data of classroom observations across the nation, even in the remotest parts can be uploaded within minutes. Using BEEP, BAF is solving the dearth of teacher-performance data while also providing our funders and partners with insight into the progress that we are making. BEEP will be a one-stop database of public primary education where policy makers, researchers, philanthropists, content developers and Programme Planners or corporate organization who want to do their CSR in education can visit to get an unbiased data set. It is a go-to database and resource Centre for Education Parastatals, Donors/Funders, Researchers And School Owners"
    })
}) 

module.exports = router;