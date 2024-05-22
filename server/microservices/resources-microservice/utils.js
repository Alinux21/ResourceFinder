const { resolve } = require('path')
const { rejects } = require('assert')

function getPostData(req) {

    return new Promise((resolve, reject) => {
        try {
            let body = ''

            req.on('data', (chunk) => {
                body += chunk.toString()
            })

            req.on('end', () => {
                resolve(body)
            })
        } catch (error) {
            reject(error)
        }

    })

}

module.exports = {
    getPostData
}
