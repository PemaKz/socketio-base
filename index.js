
require('dotenv').config()
const { Role, Permission } = require('./models')

require('./models').sequelize.sync().then(async () => {
  console.log('Database connected')
  await Role.bulkCreate(require('./enums/Roles'), { ignoreDuplicates: true })
  await Permission.bulkCreate(require('./enums/Permissions'), { ignoreDuplicates: true })
  require('./services/SocketIO')
}).catch((err) => {
  console.log(err)
})