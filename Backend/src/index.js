// importation des dependances

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//definition de l'app express

const app = express();

//base de donnees

const questions = [];

//securisation de l'app avec helmet

app.use(helmet());

//utilisation de body-parser pour passer à l'app les diferents types

app.use(bodyParser.json());

//activation de toutes les requetes cors

app.use(cors());

//utilisation de requetes http

app.use(morgan('combined'));

//renvoie toutes les questions

app.get('/', (req, res) => {
    const qs = questions.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        answers: q.answers.length,
    }));
    res.send(qs);
});

//recuperation de question specifique

app.get('/:id', (req, res) => {
    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if(question.length > 1) return res.status(500).send();
    if(question.length === 0) return res.status(404).send();
    res.send(question[0]);
});

//insertion de nouvelle question

app.post('/', (req, res) => {
    const {title, description} = req.body;
    const newQuestion = {
        id: questions.length + 1,
        title,
        description,
        answers: [],
    };
    questions.push(newQuestion);
    res.status(200).send();
});

//insertion de nouvelle reponse

app.post('/answer/:id', (req, res) => {
    const {answer} = req.body;

    //filtrage des questions par id

    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if(question.length > 1) return res.status(500).send();
    if(question.length === 0) return res.status(404).send();

    question[0].answers.push({
        answer,
    });
    res.status(200).send();
});

//definition du port et lancement du server

app.listen(8081, () => {
    console.log('Listening on port 8081');
});