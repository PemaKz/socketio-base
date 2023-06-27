const extractFilesFromDir = require('../scripts/extractFilesFromDir');

let siteLanguages = {};

const loadLanguages = async () => {
  const allLanguages = (await extractFilesFromDir(__dirname))
    .filter(file => !file.endsWith('index'))
    .sort((a, b) => a.localeCompare(b));
  allLanguages.forEach(language => {
    siteLanguages[language] = require(`./${language}`);
  });
}

loadLanguages();

module.exports = (socket, message) => {
  try {
    const language = socket.lang;
    if (!language) return ('Language not found')
    if (!siteLanguages[language]) return ('Language not found')
    return siteLanguages[language][message] || message;
  } catch (err) {
    console.log(err);
  }
};