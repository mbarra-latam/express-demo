const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express'); 
const app = express();

// undefined by default
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);  
// development by default
console.log(`app: ${app.get('env')}`); 

// express internally loads this module so we don't have to require it 
app.set('view engine', 'pug');
// this is optionally
app.set('views', './views'); // views is the default value

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

// Configuration
console.log(`Aplication Name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled...');
}

// Db work...
dbDebugger('Connected to the database...');

// next is a simple reference to the next middleware function in the pipeline 
app.use(logger);

app.use(authenticator);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));