const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.get('/quiz', async (req, res, next) => {
    try {
        let data = await db.query("SELECT * FROM quizzes");
        res.status(200).json({
            'success':true,
            'data':data,
        });
    } catch (error) {
        res.status(422).json({
            'success':false,
            'errors' : [
                error.message
            ]
        });
    }
});

router.post('/quiz', async (req, res, next) => {
    try {
        let quiz = await db.query(`INSERT INTO quizzes(title, description) VALUES('${req.body.title}', '${req.body.description}')`);
        req.body.questions.map(async question => {
            let que = await db.query(`INSERT INTO questions(quiz_id, question, is_mandatory) VALUES(${quiz.insertId}, '${question.question}', ${question.is_mandatory})`);
            question.answers.map(async answer => {
                await db.query(`INSERT INTO answers(question_id, answer, is_correct) VALUES(${que.insertId}, '${answer.answer}', ${answer.is_correct})`);
            })
        });
        let quizzes = await db.query(`SELECT * FROM quizzes WHERE id = ${quiz.insertId}`);
        let data = await Promise.all(
            quizzes.map(async quiz => {
                let thisQuiz = quiz;
                thisQuiz['questions'] = await db.query(`SELECT * FROM questions WHERE quiz_id = ${quiz.id}`);
                for(let i = 0; i < thisQuiz.questions.length; i++){
                    let answers = await db.query(`SELECT * FROM answers WHERE question_id = ${thisQuiz.questions[i].id}`);
                    thisQuiz.questions[i].answers = answers;
                }
                return new Promise((resolve, reject) => {
                    return resolve(thisQuiz);
                });
            })
        );
        res.status(200).json({
            'success':true,
            'data':data,
        });
    } catch (error) {
        res.status(422).json({
            'success':false,
            'errors' : [
                error.message
            ]
        });
    }
});

router.get('/quiz', async (req, res, next) => {
    try {
        let data = await db.query("SELECT * FROM quizzes");
        res.status(200).json({
            'success':true,
            'data':data,
        });
    } catch (error) {
        res.status(422).json({
            'success':false,
            'errors' : [
                error.message
            ]
        });
    }
});

router.get('/quiz/:id', async (req, res, next) => {
    try {
        let quizzes = await db.query(`SELECT * FROM quizzes WHERE id = ${req.params.id}`);
        let data = await Promise.all(
            quizzes.map(async quiz => {
                let thisQuiz = quiz;
                thisQuiz['questions'] = await db.query(`SELECT * FROM questions WHERE quiz_id = ${quiz.id}`);
                for(let i = 0; i < thisQuiz.questions.length; i++){
                    let answers = await db.query(`SELECT * FROM answers WHERE question_id = ${thisQuiz.questions[i].id}`);
                    thisQuiz.questions[i].answers = answers;
                }
                return new Promise((resolve, reject) => {
                    return resolve(thisQuiz);
                });
            })
        );
        res.status(200).json({
            'success':true,
            'data':data,
        });
    } catch (error) {
        res.status(422).json({
            'success':false,
            'errors' : [
                error.message
            ]
        });
    }
});

module.exports = router;