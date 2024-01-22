# tech-blog-CMS
A full stack, from scratch build, that allows users to manage content (view, create, edit &amp; delete posts) on a tech blog. Server &amp; RESTful API w/ node.js &amp; express.js. Database w/ MySQL2 &amp; Sequelize, View templating w/ express-handlebars, security w/ dotenv &amp; bcrypt, authentication w/ express-session &amp; connect-session-sequelize. MVC architecture.

At the current time code for the backend is complete:
server has been configured with express and synced with Sequelize
session secrets and db credentials have been stored in environment variables and are only disclosed in the untracked .env file
models have been created and seeded. Seeded tables are visible at Workbench and can be manipulated with some of my routes
all the routes the application needs have been coded.
some of the routes have been protected with middleware (for logged in users only) 
session and handlebars has been integrated in server.js
user authentication with bycrypt matching of hashed passwords and session storage have been coded
login and signup form groups have been created and rendered,
sign up and login work well front to back. I can add a new user to the database when I do a signup, and login lets me in or not depending on if I provide the right password
links in navbar satisfy acceptance criteria for redirect to login if user is not logged in already
front end files are there but are a bit of a mess, not many are rendering.  bugs, bugs, bugs.
Tried deploying to Heroku but the metrics identified two critical errors in the logs in the last 24 hours and decided not to trust it.   
Link is:
https://tech-blog-cm-system-c3dbc3b4df67.herokuapp.com/
(You'll likely only get an application not found).

A work in progress....  
