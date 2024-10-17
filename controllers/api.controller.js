const fs = require('fs')
const path = require('path')

exports.getApiDocs = (req, res, next) => {
    const filePath = path.join(__dirname, '../endpoints.json')

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            res.status(200).send(JSON.parse(data))
        }
    })
}
