const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const userRoutes = require('./controllers/api/userRoutes');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
    secret: process.env.SESSION_SECRET, // Reference to the SESSION_SECRET value in my .env file
    cookie: {
      maxAge: 300000,
      httpOnly: true,
      secure: true, //both Heroku and Render where I intend to deploy the app provide a https url, so I am setting this to true. It means that the cookie will only be sent over secure (HTTPS) connections
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Calling userRoutes particularly because it contains routes for signup/login functionality
app.use(userRoutes);

// Define a route for rendering the login page
app.get('/login', (req, res) => {
  res.render('login'); // Invoking the login.handlebars file
});

// Define a route for rendering the signup form
app.get('/signup', (req, res) => {
  res.render('signup'); // Invoking the login.handlebars file
});

// Define a route, triggered upon submit from either login or signup or click on dashboard navlink when logged in, for rendering the dashboard
app.get('/dashboard', (req, res) => {
  // Check if the user is logged in
  const is_logged_in = req.session.logged_in;
  // Check if the query parameter is_dashboard is present
  const is_dashboard = req.query.is_dashboard === 'true';// Render your dashboard view
  res.render('dashboard', { logged_in: is_logged_in, is_dashboard }); // Invoking the dashboard.handlebars file
});


// Routes
app.use(routes);

// Start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});




