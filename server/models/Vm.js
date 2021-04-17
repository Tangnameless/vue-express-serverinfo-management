// 虚拟机模型
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VirtualMachineSchema = new Schema({
    vm_name: { type: String, required: true },   //虚拟机名称
    master_ser: { type: Schema.ObjectId, ref: 'Server', required: true }, // 虚拟机挂靠服务器
    vm_ip: { type: String, required: true },    // 虚拟器IP
    vm_os: { type: String, required: true },    // 虚拟机操作系统
    vm_admin: { type: String, required: true }, // 登录用户名
    vm_password: { type: String, required: true },   // 登录密码
    is_for_demo: { type: String, required: true, enum: ['是', '否']}, //是否存放演示程序
    vm_purpose: { type: String },               // 虚拟机用途
    vm_owner: { type: String },                 // 虚拟机使用人
    vm_remarks: { type: String },               // 备注
});

// Export model.
module.exports = mongoose.model('Vm', VirtualMachineSchema);
