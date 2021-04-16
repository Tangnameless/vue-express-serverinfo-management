<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}虚拟机</h1>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <el-form-item label="所属服务器">
        <el-select v-model="form.master_ser">
          <el-option
            v-for="server in servers"
            :key="server._id"
            :label="server.ser_name"
            :value="server._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="虚拟机名称">
        <el-col :span="8">
          <el-input
            v-model="form.vm_name"
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="服务器IP">
        <el-col :span="8">
          <el-input v-model="form.vm_ip"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="操作系统">
        <el-radio-group v-model="form.vm_os">
          <el-radio label="Windows"></el-radio>
          <el-radio label="Linux"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row>
        <el-col :span="8">
          <el-form-item label="登录用户名">
            <el-input v-model="form.vm_admin"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="登录密码">
            <el-input v-model="form.vm_password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="演示程序">
            <el-select
              v-model="form.ser_location"
              placeholder="请选择是否存放demo"
            >
              <el-option label="否" value=0></el-option>
              <el-option label="是" value=1></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用人">
            <el-input v-model="form.vm_owner"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="用途">
        <el-col :span="16">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="form.vm_purpose"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-col :span="16">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="form.vm_remarks"
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
  props: {
    id: {}, // 从前端router处定义的注入
  },
  data() {
    return {
      form: {},
      servers: [],
    };
  },
  methods: {
    // 保存数据
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/vms/${this.id}`, this.form);
      } else {
        res = await this.$http.post("rest/vms", this.form);
      }
      if (res) {
        this.$router.push("/vms/list");
        this.$message({
          type: "success",
          message: "保存成功",
        });
      }
    },

    async fetch() {
      const res = await this.$http.get(`rest/vms/${this.id}`);
      this.form = res.data;
    },

    async fetchServers() {
      const res = await this.$http.get(`rest/servers`);
      this.servers = res.data;
    },
  },

  created() {
    this.fetchServers();
    this.id && this.fetch();
  },
};
</script>
