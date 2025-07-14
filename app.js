const dotenv = require("dotenv");
dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

//Express
var express = require('express');
var cookieParser = require('cookie-parser');
var bluebird = require('bluebird');

//incorporo cors
var cors = require('cors');

//importo middlewares
const errorHandler = require('./middleware/errorHandler');

//importo router
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api'); //Custom

//instancio el servidor
var app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: false,
  limit: '10mb'
}));

//aplico cors
app.use(cors());

app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  next();
});

//Indico las rutas de los endpoint
app.use('/api', apiRouter);
app.use('/', indexRouter);

// Global error handling middleware
app.use(errorHandler);

//console.log("processENV",process.env);
if (process.env.NODE_ENV === 'Development') {
  require('./config').config();
}

//Database connection --
var mongoose = require('mongoose')
mongoose.Promise = bluebird;
let url = process.env.URI_BD;
console.log("BD conectando a:", url ? 'URL configurada' : 'URL no configurada');

let opts = {
  useNewUrlParser : true,
  connectTimeoutMS:20000,
  useUnifiedTopology: true
};

mongoose.connect(url, opts)
  .then(() => {
    console.log(`Successfully Connected to the MongoDB Database..`)
  })
  .catch((e) => {
    console.log(`Error Connecting to the MongoDB Database...`);
    console.log(e);
  });

// Setup server port
var port = process.env.PORT || 3000;
// Escuchar en el puerto
app.listen(port, () => {
    console.log('Servidor de ABM Users iniciado en el puerto ', port);
});

module.exports = app;