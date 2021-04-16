// 通用CURD
module.exports = app => {
    const express = require('express');
    const router = express.Router({
        mergeParams: true
    });

    // 引入模型
    const Server = require('../../models/Server');
    const Vm = require('../../models/Vm');

    // 登录校验中间件
    const authMiddleware = require('../../middleware/auth')

    // 解析URL，自动查询模型中间件
    const resourceMiddleware = require('../../middleware/resource')

    var async = require('async');

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
    // router.delete('/:id', async (req, res) => {
    //     const model = await req.Model.findByIdAndDelete(req.params.id)
    //     res.send({
    //         success: true,
    //     })
    // })

    router.delete('/:id', async (req, res) => {
        if (req.Model.modelName === 'Server') {
            console.log('trying to delete server')
            async.parallel({
                server: function (callback) {
                    Server.findById(req.params.id).exec(callback)
                },
                server_vms: function (callback) {
                    Vm.find({ 'master_ser': req.params.id }).exec(callback)
                },
            }, function (err, results) {
                if (err) { return next(err); }
                // Success
                if (results.server_vms.length > 0) {
                    // 服务器上仍然有挂载的虚拟机, 向前端页面返回服务器挂载的虚拟机信息
                    res.send({ success: false, title: '服务器上仍然有挂载的虚拟机', server: results.server, server_vms: results.server_vms });
                }
                else {
                    // 服务器上已经没有挂载的虚拟机，删除服务器信息
                    Server.findByIdAndRemove(req.params.id, function deleteServer(err) {
                        if (err) { return next(err); }
                        res.send({
                            success: true,
                        })
                    })
                }
            })
        }
        else {
            const model = await req.Model.findByIdAndDelete(req.params.id)
            res.send({
                success: true,
            })
        }
    })

    // 资源列表
    router.get('', async (req, res) => {
        const queryOptions = {}

        // 针对不同模型，要做一些特化
        if (req.Model.modelName === 'Vm') { //modelName 是Model的一个属性
            queryOptions.populate = 'master_ser'
        };
        const items = await req.Model.find().populate('master_ser').limit(10)
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