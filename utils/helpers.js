const moment = require('moment'); 

module.exports = {
  format_date: (date) => {
    // Format date using moment.js, adjust the format as needed
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  },
};
