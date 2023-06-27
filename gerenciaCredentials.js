module.exports = {
	// PRODUÇÃO = false
	// HOMOLOGAÇÃO = true
	sandbox: false,
	client_id: process.env.GERENCIA_CLIENT_ID,
	client_secret: process.env.GERENCIA_CLIENT_SECRET,
	certificate: __dirname + '/certs/GerenciaCert.p12',
}