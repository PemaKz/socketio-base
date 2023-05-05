const fs = require('fs');

const allRoutes = fs.readdirSync(__dirname).filter(file => file !== 'index.js');

let siteRoutes = {};
allRoutes.forEach(route => {
  siteRoutes[route.replace('.js', '')] = require(`./${route}`);
});

module.exports = (io, socket, message) => {
  try{
    const { action, params } = JSON.parse(message);
    if(!action) throw new Error('Action not found');
    //if(!params) throw new Error('Params not found');
    //console.log(`Received from ${socket.id} | Action: ${action} | Params: ${params}`);
    if(!siteRoutes[action]) throw new Error('Action not found');
    return siteRoutes[action](io, socket, params);
  } catch (err) {
    console.log(err);
  }
};