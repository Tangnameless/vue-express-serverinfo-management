<template>
  <div class="about">
    <h1>服务器列表</h1>
    <el-button @click="resetOsFilter">清除操作系统过滤器</el-button>
    <el-button @click="clearFilter">清除所有过滤器</el-button>
    <el-table :data="items" height="400" ref="filterTable">
      <el-table-column prop="ser_name" label="服务器名称"></el-table-column>
      <el-table-column prop="ser_ip" label="服务器IP"></el-table-column>
      <el-table-column
        column-key="ser_type"
        prop="ser_type"
        label="类别"
        :filters="[
          { text: '刀片', value: '刀片' },
          { text: 'gpu', value: 'gpu' },
        ]"
        :filter-method="filterType"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column
        column-key="ser_os"
        prop="ser_os"
        label="操作系统"
        :filters="[
          { text: 'Windows', value: 'Windows' },
          { text: 'Linux', value: 'Linux' },
        ]"
        :filter-method="filterOs"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column
        prop="ser_owner"
        label="使用人"
        column-key="ser_owner"
        :filters="[
          { text: '汤艺', value: '汤艺' },
          { text: '其他', value: '其他' },
        ]"
        :filter-method="filterOwner"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column
        prop="ser_location"
        label="所属实验室"
        column-key="ser_location"
        :filters="[
          { text: '218', value: '218' },
          { text: '其它', value: '其它' },
        ]"
        :filter-method="filterLocation"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/servers/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <template v-if="display_vms">
      <el-card class="box-card" shadow="hover" style="margin-top: 1rem">
        <div slot="header" class="clearfix">
          <span>该服务器上挂载的虚拟机</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="
              $router.push({
                path: '/vms/list',
                query: delete_server,
              })
            "
            >前往删除</el-button
          >
        </div>
        <div v-for="vm in server_vms" :key="vm._id" class="text item">
          {{ vm.vm_name }}
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      server_vms: [],
      display_vms: false,
      delete_server: {},
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/servers");
      this.items = res.data;
    },

    async remove(row) {
      this.$confirm(`是否要删除服务器"${row.ser_name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await this.$http.delete(`rest/servers/${row._id}`); // eslint-disable-line no-unused-vars
        if (res.data.success == true) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        } else if (res.data.success == false) {
          this.$message({
            type: "warning",
            message: res.data.title,
          });
          this.server_vms = res.data.server_vms;
          this.display_vms = true;
          this.delete_server = { ser_to_delete: row.ser_name };
        }
        this.fetch();
      });
    },

    resetOsFilter() {
      this.$refs.filterTable.clearFilter("ser_os");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    filterOs(value, row) {
      return row.ser_os === value;
    },
    filterType(value, row) {
      return row.ser_type === value;
    },
    filterOwner(value, row) {
      return row.ser_owner === value;
    },
    filterLocation(value, row) {
      return row.ser_location === value;
    },

    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },

  created() {
    this.fetch();
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>