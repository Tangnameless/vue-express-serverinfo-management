// 通用CURD
module.exports = app => {
    const express = require('express');
    const router = express.Router({
        mergeParams: true
    });

    // 登录校验中间件
    const authMiddleware = require('../../middleware/auth')

    // 解析URL，自动查询模型中间件
    const resourceMiddleware = require('../../middleware/resource')

    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

    // 命名规范
    // 模型用大写首字母命名

    // 创建
    router.post('', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })
    
    // 更新
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除
    router.delete('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndDelete(req.params.id)
        res.send({
            success: true,
        })
    })

    // 资源列表
    router.get('', async (req, res) => {
        const queryOptions = {}

        // 针对不同模型，要做一些特化
        if (req.Model.modelName === 'Category') { //modelName 是Model的一个属性
            queryOptions.populate = 'parent'
        };
        const items = await req.Model.find().populate('parent').limit(10)
        res.send(items)
    })

    // 资源详情
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}