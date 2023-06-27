const Steam = require(`../../services/Steam`)

module.exports = async (io, socket, params) => {
  const redirectUrl = await Steam.getRedirectUrl();
  return redirectUrl
}