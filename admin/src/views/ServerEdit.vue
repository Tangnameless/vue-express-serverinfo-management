<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "创建" }}服务器</h1>
    <el-form ref="form" :model="form" label-width="100px" @submit.native.prevent="save">
      <el-form-item label="服务器名称">
        <el-col :span="8">
          <el-input
            v-model="form.ser_name"
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="服务器IP">
        <el-col :span="8">
          <el-input v-model="form.ser_ip"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="服务器类别">
        <el-select v-model="form.ser_type" placeholder="请选择服务器类别">
          <el-option label="GPU服务器" value="gpu"></el-option>
          <el-option label="刀片服务器" value="cpu"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作系统">
        <el-radio-group v-model="form.ser_os">
          <el-radio label="Windows"></el-radio>
          <el-radio label="Linux"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row>
        <el-col :span="8">
          <el-form-item label="登录用户名">
            <el-input v-model="form.ser_admin"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="登录密码">
            <el-input v-model="form.ser_password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属实验室">
            <el-select
              v-model="form.ser_location"
              placeholder="请选择所属实验室"
            >
              <el-option label="218" value="218"></el-option>
              <el-option label="其它" value="elsewhere"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用人">
            <el-input v-model="form.ser_owner"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="用途">
        <el-col :span="16">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="form.ser_purpose"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-col :span="16">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="form.ser_remarks"
          ></el-input>
        </el-col>
      </el-form-item>
        <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>    

<script>
export default {
  props:{
    id:{}     // 从前端router处定义的注入
  },
  data() {
    return {
      form: {
        ser_name: "", // 服务器名称
        ser_ip: "", // 服务器IP
        ser_type: "", // 服务器类别
        ser_admin: "", // 登录用户名
        ser_password: "", // 登录密码
        ser_os: "", // 服务器操作系统
        ipmi_ip: "", // ipmi_ip
        ib_ip: "", // IB内网IP
        ipmi_admin_password: "", // IPMI信息，用“/”分隔用户名和密码
        ser_purpose: "", // 服务器用途
        ser_owner: "", // 使用人
        ser_location: "", // 服务器所属实验室
        ser_remarks: "", // 备注信息
      },
    };
  },
  methods: {
    async save() {
      let res
      if(this.id){
        res = await this.$http.put(`rest/servers/${this.id}`, this.form);
      }else{
        res = await this.$http.post("rest/servers", this.form);
      }
      if (res) {
        this.$router.push("/servers/list");
        this.$message({
          type: "success",
          message: "保存成功",
        });
      }
    },

    async fetch() {
      const res = await this.$http.get(`rest/servers/${this.id}`) // 模板字符串（` `）
      this.form = res.data
    },
  },

    created() {
    this.id && this.fetch();
  }
};
</script>