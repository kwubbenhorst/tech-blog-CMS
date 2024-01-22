const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
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
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in,
      is_dashboard: false, 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve blog posts.' });
  }
});

router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['text, data_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve the blog post.' });
  }
});

// Add a comment on a post
router.post('/post/:id/comment', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      text: req.body.text,
      post_id: req.params.id,
      user_id: req.session.user_id,
    });

    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add a comment.' });
  }
});

module.exports = router;

