const express = require('express');
const app = express();
const PORT = 3000;
const quizRouter = require('./routes/Quiz');

app.use(express.json());
app.use(
    express.urlencoded({
        extended:true,
    })
);
app.get('/', (req, res) => {
    res.json({
        'message' : 'OK'
    });
});
app.use('/api', quizRouter);

app.listen(PORT, () => {
    console.log(`App Running at port ${PORT}`);
});

