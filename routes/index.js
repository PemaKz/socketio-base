const fs = require('fs/promises');
const extractFilesFromDir = require('../scripts/extractFilesFromDir');

let siteRoutes = {};

const loadRoutes = async () => {
  const allRoutes = (await extractFilesFromDir(__dirname))
    .filter(file => !file.endsWith('index'))
    .sort((a, b) => a.localeCompare(b));
  console.log('Routes: ', allRoutes);
  await fs.writeFile(`allRoutesPreview.json`, JSON.stringify(allRoutes, null, 2));
  allRoutes.forEach(subroute => {
    siteRoutes[subroute] = require(`./${subroute}`);
  });
}

loadRoutes();

module.exports = async (io, socket, message) => {
  try{
    const { action, params } = JSON.parse(message);
    if(!action) throw new Error('Action not found');
    console.log(`Received from ${socket.id} | Action: ${action} | Params: ${params}`);
    if(!siteRoutes[action]) throw new Error('Action not found');
    try{
      const data = await siteRoutes[action](io, socket, params)
      if(data) socket.send(JSON.stringify({ 
        success: true,
        action,
        data
      }));
    } catch (err) {
      socket.send(JSON.stringify({ 
        success: false,
        action,
        message: err.message 
      }));
    }
  } catch (err) {
    console.log(err);
  }
};