const {readdir} = require('node:fs/promises')
const {join} =require('node:path')

const walk = async (dirPath) => Promise.all(
  await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
    const childPath = join(dirPath, entry.name)
    return entry.isDirectory() ? walk(childPath) : childPath
  })),
)

const flatArray = (arr) => arr.reduce((acc, val) => acc.concat(val), [])

module.exports = async function (dir) {
  return new Promise(async (resolve, reject) => {
    try{
      const allFiles = await walk(dir)
      let flatted = flatArray(allFiles)
      do {
        flatted = flatArray(flatted)
      } while (flatted.some(Array.isArray))
      const filesFormatted = flatted.map(file => file.replace(dir, ``).replace(/\\/g, '/').replace(`.js`, ``).slice(1))
      resolve(filesFormatted)
    } catch (err) {
      reject(err)
    }
  })
};