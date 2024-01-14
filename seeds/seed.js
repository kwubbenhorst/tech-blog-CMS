const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: false }); //I am setting this to false because I don't want all tables dropped and recreated in the finished app. While convenient during development and testing, it can lead to data loss if all data is cleared from my tables every time the application starts.

  // Create users
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // Create posts and associate them with users
  // bulkCreate sequelize method is called on Post model which creates multiple instances of the model in the database.
  // map method iterates over each object in the postData array, transforming and creating a new array of objects.
  // ... spread operator spreads the properties of the original post object into a new object
  // find method assigns a new user_id property to the post object. It finds the corresponding user in the users array whose id matches the user_id from the original post object and retrieves the id of that user.
  // returning: true instructs Sequelize to return the created instances.
  const posts = await Post.bulkCreate(
    postData.map((post) => ({
      ...post,
      user_id: users.find((user) => user.id === post.user_id).id,
    })),
    {
      returning: true,
    }
  );

  // Create comments and associate them with users and posts
  // Same process as for post, but comments are associated with both a user and a post, so the find method is run for both user_id and post_id.
  // In my particular case I am seeding only one comment, but I wanted to code this as if I had a full array of comments in commentData.json to iterate through
  await Comment.bulkCreate(
    commentData.map((comment) => ({
      ...comment,
      user_id: users.find((user) => user.id === comment.user_id).id,
      post_id: posts.find((post) => post.id === comment.post_id).id,
    }))
  );

  process.exit(0);
};

seedDatabase();
