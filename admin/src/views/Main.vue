<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu
        router
        unique-opened
        :default-openeds="['1']"
        :default-active="$route.path"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-document"></i>服务器信息管理
          </template>
          <el-menu-item-group>
            <template slot="title">服务器</template>
            <el-menu-item index="/servers/create">新建服务器</el-menu-item>
            <el-menu-item index="/servers/list">服务器列表</el-menu-item>
            <el-menu-item index="/servers/search">服务器检索</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">虚拟机</template>
            <el-menu-item index="/virtual_machines/create">新建虚拟机</el-menu-item>
            <el-menu-item index="/virtual_machines/list">虚拟机列表</el-menu-item>
            <el-menu-item index="/virtual_machines/list">虚拟机检索</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>系统设置
          </template>
          <el-menu-item-group>
            <template slot="title">管理员</template>
            <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
            <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown trigger="click">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push(`/admin_users/edit/${model._id}`)">查看个人资料</el-dropdown-item>
            <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>欢迎你，{{ this.model.username }}</span>
      </el-header>

      <el-main>
        <router-view :key="$route.path"></router-view>
      </el-main>

      <el-footer>北京邮电大学电子工程学院通信与网络研究中心（2021）</el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      model: {
        username: "",
      },
    };
  },

  methods: {
    // 获取当前登录用户信息
    async fetchUser() {
      const res = await this.$http.post("/userinfo");
      this.model = Object.assign({}, this.model, res.data);
    },

    // 用户登出
    async logout(){
      this.$confirm(`是否要退出`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
            window.localStorage.removeItem('token')
          this.$message({
            type: 'success',
            message: '成功退出!'
          });
          this.$router.push(`/login`);
        });
    }
  },

  created() {
    this.fetchUser();
  },
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #409eff;
  color: rgb(255, 253, 253);
  text-align: center;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
