require("dotenv").config();
require('./models/connection');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userProRouter = require('./routes/userPro');
var notesRouter = require('./routes/notes');
//var formulesRouter = require('./routes/formules');
//var rdvRouter = require('./routes/rdv');

var app = express();
const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/userpros', userProRouter);
app.use('/notes', notesRouter);
//app.use('/formules', formulesRouter);
//app.use('/rdv', rdvRouter);

module.exports = app;
