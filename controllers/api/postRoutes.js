// This file handles operations for when user hits endpoints to create, update or delete blog posts

const router = require('express').Router();
const { Post } = require('../models');
const withAuth = require('../utils/auth');

// Create a new blog post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create a new blog post.' });
  }
});

// Update a blog post
router.put('/:id', withAuth, async (req, res) => {
  try {
    // allows either the title or content field or both to be updated
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        // req.params.id is used to identify a specific post, user_id: req.session.user_id is used to ensure that only the posts owned by the currently authenticated user are eligible for updating
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    // checks to see if any rows were updated
    if (updatedPost[0] === 0) {
      res.status(404).json({ error: 'No net changes were made to the post.' });
      return;
    }

    res.status(200).json({ message: 'Blog post updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update the blog post.' });
  }
});

// Delete a blog post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ error: 'No post with this id found or you are not the author.' });
      return;
    }

      res.status(204).end(); // successful deletion. Verified simply by the post disappearing (204 = no content)
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete the blog post.' });
    }
});

module.exports = router;
