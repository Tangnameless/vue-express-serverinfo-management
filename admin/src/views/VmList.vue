<template>
  <div class="about">
    <h1>虚拟机列表</h1>
    <el-button @click="resetOsFilter">清除操作系统过滤器</el-button>
    <el-button @click="clearFilter">清除所有过滤器</el-button>
    <el-table :data="items" ref="filterTable">
      <div v-if="this.$route.query.ser_to_delete">
        <el-table-column
          width="250"
          column-key="master_ser"
          prop="master_ser.ser_name"
          :filters="server_filter_list"
          :filter-method="filterMasterSer"
          :filtered-value="[this.$route.query.ser_to_delete]"
          filter-placement="bottom-end"
          label="所属服务器"
          sortable
        ></el-table-column>
      </div>
      <div v-else>
        <el-table-column
          width="250"
          column-key="master_ser"
          prop="master_ser.ser_name"
          :filters="server_filter_list"
          :filter-method="filterMasterSer"
          filter-placement="bottom-end"
          label="所属服务器"
          sortable
        ></el-table-column>
      </div>
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

      <el-table-column
        prop="is_for_demo"
        label="是否存放演示程序"
        column-key="is_for_demo"
        :filters="[
          { text: '是', value: '是' },
          { text: '否', value: '否' },
        ]"
        :filter-method="filterDemo"
        filter-placement="bottom-end"
      ></el-table-column>

      <el-table-column
        prop="vm_owner"
        label="使用人"
        column-key="vm_owner"
        :filters="[
          { text: '汤艺', value: '汤艺' },
          { text: '其他', value: '其他' },
        ]"
        :filter-method="filterOwner"
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
      server_filter_list: [],
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

    async createServerFilter() {
      for (const vm of this.items) {
        let row = {
          text: vm.master_ser.ser_name,
          value: vm.master_ser.ser_name,
        };
        if (!this.server_filter_list.find((item) => item.text == row.text)) {
          this.server_filter_list.push(row);
        }
      }
      this.server_filter_list = Array.from(new Set(this.server_filter_list));
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
    filterOwner(value, row) {
      return row.vm_owner === value;
    },
    filterDemo(value, row) {
      return row.is_for_demo === value;
    },
    filterMasterSer(value, row) {
      return row.master_ser.ser_name === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },

  created() {
    this.fetch().then(this.createServerFilter);
  },
};
</script>
