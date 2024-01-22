const router = require('express').Router();
const { User } = require('../../models');

// Sign up a new user (create a new entry in the user table of the db)
router.post('/', async (req, res) => {
  console.log('Inside signup route');
  try {
    const userData = await User.create(req.body); //assumes all fields are present in the req.body (ie. username and password) and uses the sequelize method, User.create

    // Set up session after successful signup
    req.session.user_id = userData.id;
    req.session.logged_in = true;

    // Redirect after successful signup
    res.redirect('/dashboard');
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      // Handle unique constraint violation
      res.status(400).json({ message: 'Username is already taken. Please choose another.' });
    } else {
      // Handle other errors
      res.status(400).json({ message: 'An error occurred during signup.' });
    }
  }
});

// Login route 
router.post('/login', async (req, res) => {
  console.log('Inside login route');
  try {
    // Check if the username entered matches one in the database
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username, please try again' });
      return;
    }

    // Check if the password entered matches one in the database
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// Logout route
router.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(() => {
      // Redirect to the login page after destroying the session
      res.redirect('/login');
  });
});


// Delete a user from the database
// Delete user route
router.delete('/:id', async (req, res) => {
  console.log('Inside delete user route');
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;