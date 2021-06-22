module.exports = options => {
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require(`../models/AdminUser`)

    // assert(user, 422, “用户不存在”);//三个参数分别是 判断条件，不满足条件的状态码，不满足条件的信息。
    // 当不满足设定条件会抛出一个错误
    // 使用express的错误处理中间件来统一处理这样的错误，简化所有接口的判断书写
    // 前端部署的拦截器会全局拦截错误，显示错误信息


    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop();
        try {
            assert(token, 401, '请提供 jwt token，请先登录！') //express4 对assert有bug
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
            assert(req.user, 401, '用户不存在，请先登录') //express4 对assert有bug
        } catch (err) {
            next(err);
        }
        await next()
    }
}