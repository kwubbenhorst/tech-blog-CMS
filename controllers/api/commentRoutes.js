// This file handles operations for when user hits endpoint to create a comment. Users are often also allowed to manage their comments in applications of this type and update and delete routes could be added later, but they are not required for the functionality of the MVP

const router = require('express').Router();
const { Comment } = require('../models');
const withAuth = require('../utils/auth');

// Create a new comment on a blog post
router.post('/:post_id', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      text: req.body.text,
      post_id: req.params.post_id,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create a new comment.' });
  }
});

module.exports = router;

