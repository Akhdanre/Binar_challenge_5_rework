var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")

const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')
const file = fs.readFileSync('api_docs.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

var app = express();
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


var indexRouter = require('./routes/index.routes');
var usersRouter = require('./routes/users.routes');
var accountRouter = require('./routes/account.routes');
var transactionRouter = require('./routes/transaction.routes');



app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/transaction', transactionRouter);

module.exports = app;
