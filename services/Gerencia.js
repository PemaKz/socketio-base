const Gerencianet = require('gn-api-sdk-node')
const gerenciaCredentials = require('../gerenciaCredentials')
const crypto = require('crypto')

module.exports = new class Gerencia{
  constructor(){
    this.client = new Gerencianet(gerenciaCredentials)
    this.pixChave = '50604182000188'
  }
  createPixCharge({ seconds = 3600, fullName = '', CPF = '', price = 0}){
    return new Promise(async (resolve, reject) => {
      try {
        const body = {
          calendario: {
            expiracao: seconds,
          },
          devedor: {
            cpf: CPF.replace(/\D/g, ''),
            nome: fullName,
          },
          valor: {
            original: price.toFixed(2),
          },
          chave: this.pixChave, // Informe sua chave Pix cadastrada na gerencianet	
        }
        const response = await this.client.pixCreateImmediateCharge([], body)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  }
  generateQRCode({ locID = 0 }){
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          id: locID
        }
        const response = await this.client.pixGenerateQRCode(params)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  }
  createWithdrawal({ pixChave, amount, }){
    return new Promise(async (resolve, reject) => {
      try {
        let params = {
          idEnvio: crypto.randomBytes(16).toString('hex'),
        }
        let body = {
          valor: amount.toFixed(2),
          pagador: {
            chave: this.pixChave
          },
          favorecido: {
            chave: pixChave,
          },
        }
        const response = await this.client.pixSend(params, body)
        resolve({
          ...response,
          txid: params.idEnvio,
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}()