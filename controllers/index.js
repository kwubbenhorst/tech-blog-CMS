// Aggregates all routes in the controllers folder and bundles them for export. When server.js  calls app.use(routes) it gets them all
const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const dashboardRoutes = require('./dashboardRoutes'); 

router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes); 
router.use('/api', apiRoutes);

module.exports = router;
