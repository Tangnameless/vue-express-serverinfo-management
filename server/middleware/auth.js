module.exports = options => {
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require(`../models/AdminUser`)

    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop();
        try {
            assert(token, 401, '请先登录') //express4 对assert有bug
        } catch (err) {
            next(err);
        }
        const { _id } = jwt.verify(token, req.app.get('secret'))
        try {
            assert(_id, 401, '请先登录') //express4 对assert有bug
        } catch (err) {
            next(err);
        }
        req.user = await AdminUser.findById(_id)
        try {
            assert(req.user, 401, '请先登录') //express4 对assert有bug
        } catch (err) {
            next(err);
        }
        await next()
    }
}