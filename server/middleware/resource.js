module.exports = options => {
    return async (req, res, next) => {
        // resource即为捕获的模型名（小写），用inflection进行转换
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../models/${modelName}`)
        next()
    }
}