<template>
  <div class="about">
    <h1>虚拟机列表</h1>
    <el-button @click="resetOsFilter">清除操作系统过滤器</el-button>
    <el-button @click="clearFilter">清除所有过滤器</el-button>
    <el-table :data="items" ref="filterTable">
      <el-table-column
        width="250"
        prop="master_ser.ser_name"
        label="所属服务器"
        sortable
      ></el-table-column>
      <el-table-column
        prop="vm_name"
        label="虚拟机名称"
        width="250"
      ></el-table-column>
      <el-table-column
        column-key="vm_os"
        prop="vm_os"
        label="操作系统"
        :filters="[
          { text: 'Windows', value: 'Windows' },
          { text: 'Linux', value: 'Linux' },
        ]"
        :filter-method="filterOs"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/vms/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  methods: {
    // get方式获取所有的虚拟机信息
    async fetch() {
      const res = await this.$http.get("rest/vms");
      this.items = res.data;
    },

    // delete方式删除虚拟机信息
    async remove(row) {
      this.$confirm(`是否要删除虚拟机"${row.vm_name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await this.$http.delete(`rest/vms/${row._id}`); // eslint-disable-line no-unused-vars
        if (res.data.success == true) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        }
        this.fetch();
      });
    },

    resetOsFilter() {
      this.$refs.filterTable.clearFilter("vm_os");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    filterOs(value, row) {
      return row.vm_os === value;
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
