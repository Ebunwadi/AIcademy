const express = require("express");
const { careerAdvisor } = require("../controllers/careerController");

const router = express.Router();

router.post("/generate-career-advice", careerAdvisor);

module.exports = router;
