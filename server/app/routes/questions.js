
const express = require('express')
const router = require('express').Router();

const controller= require("../controller");

// Add Question
router.post('/createQuestion',controller.questions.createQuestions);
router.get('/getAllQuestionsAndAnswers',controller.questions.getAllQuestionsAndAnswers);

// Get All Question 
router.get('/getAllQuestions', controller.questions.getAllQuestions);


// export the router folder 
module.exports = router;