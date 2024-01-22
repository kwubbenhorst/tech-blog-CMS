const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

// Dashboard route /dashboard.  Access is restricted by middleware to logged-in users only
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Get all posts created by the logged-in user
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('dashboard', {
      posts,
      logged_in: req.session.logged_in,
      is_dashboard: true,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user\'s blog posts.' });
  }
});

// Render the form to create a new post
router.get('/new', withAuth, (req, res) => {
  res.render('new-post', { logged_in: req.session.logged_in });
});

// Handle the creation of a new post
router.post('/new', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).json({ error: 'Failed to create a new blog post.' });
  }
});

// Handle post deletion
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const affectedRows = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete the blog post.' });
  }
});

module.exports = router;
