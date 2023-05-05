module.exports = (socket, message) => {
  try {
    const language = socket.lang;
    if (!language) return ('Translation not found')
    if (!require(`./${language}`)[message]) return ('Translation not found')
    return require(`./${language}`)[message]
  } catch (err) {
    console.log(err);
  }
};