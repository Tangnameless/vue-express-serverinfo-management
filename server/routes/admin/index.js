// 用户登录状态管理
module.exports = app => {
    const express = require('express');
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require(`../../models/AdminUser`)

     // 登陆验证
    app.post('/admin/api/login', async (req, res, next) => {
        const { username, password } = req.body;
        // 1.根据用户名找用户
        const user = await AdminUser.findOne({ username }).select('+password')
        assert(user, 422, '用户不存在') 
        // 2.校验密码
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')
        // 3.返回token
        const token = jwt.sign({
            _id: user._id,
            // username: user.username,
        }, app.get('secret'))
        res.send({ token })
    })

    // 查询用户信息
    // 返回一个用户对象
    // 这里就先不要用rest风格的接口了
    app.post('/admin/api/userinfo',async (req, res, next) =>{
        const token = String(req.headers.authorization || '').split(' ').pop();
        const { _id } = jwt.verify(token, req.app.get('secret'))
        // 根据用户名找用户
        const user = await AdminUser.findById(_id)
        res.send(user);

    })

    // 错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })

}