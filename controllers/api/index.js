// Aggregates all api routes (those defined in userRoutes, postRoutes and commentRoutes) and exports them as a bundle
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes'); 
const commentRoutes = require('./commentRoutes'); 

router.use('/users', userRoutes);
router.use('/posts', postRoutes); 
router.use('/comments', commentRoutes); 

module.exports = router;
