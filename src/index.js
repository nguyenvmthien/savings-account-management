require('dotenv').config();

const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const route = require('./routes');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
    }),
); // use the handlebars engine for rendering views

app.set('view engine', 'hbs'); // set the view engine to handlebars
app.set('views', path.join(__dirname, 'resources', 'views')); // set the views directory to resources/views

// Routers
route(app);

// Global error handler.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('An error occurred. Please try again later.');
});

// Listen on pc port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
