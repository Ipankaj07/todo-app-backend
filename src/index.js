const express = require('express');

const todoController = require("./controllers/todo.controller");

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/todos', todoController);

module.exports = app;