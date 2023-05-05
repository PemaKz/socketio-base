const fs = require('fs');

const allMiddlewares = fs.readdirSync(__dirname).filter(file => file !== 'index.js');

let siteMiddlewares = {};
allMiddlewares.forEach(middleware => {
  siteMiddlewares[middleware.replace('.js', '')] = require(`./${middleware}`);
});


module.exports = siteMiddlewares