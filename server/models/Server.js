//服务器模型
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ServerSchema = new Schema({
    ser_name: {type: String, required: true},     // 服务器名称
    ser_ip: {type: String, required: true},       // 服务器IP
    ser_type: {type: String, required: true},     // 服务器类别
    ser_admin: {type: String, required: true},    // 登录用户名
    ser_password: {type: String, required: true},  // 登录密码
    ser_os: {type: String, required: true},       // 服务器操作系统
    ipmi_ip: {type: String},                     // IPMI_IP
    ib_ip: {type: String},                       // IB内网IP
    ipmi_admin_password: {type: String},         // IPMI信息，用“/”分隔用户名和密码
    ser_purpose: {type: String},                  // 服务器用途
    ser_owner: {type: String, required: true},    // 使用人
    ser_location: {type: String, required: true}, // 服务器所属实验室
    ser_remarks: {type: String, required: true},  // 备注信息
});

// Export model.
module.exports = mongoose.model('Server', ServerSchema);
