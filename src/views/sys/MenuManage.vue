<template>
  <page-header-wrapper :breadcrumb="false">
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        :scroll="{ x: 1400 }"
        :showPagination="false"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="menuType" slot-scope="text">
          <a-tag>{{ text | menuTypeFilter }}</a-tag>
        </span>
        <span slot="outerChain" slot-scope="text">
          <a-tag :color="text ? 'green' : 'orange'">{{ text ? '是' : '否' }}</a-tag>
        </span>
        <span slot="deleteTime" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="record.deleteTime === null"
              title="确定要删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDel(record)"
            >
              <a href="#">删除</a>
            </a-popconfirm>
            <a-popconfirm
              v-else
              title="确定要启用吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleReset(record)"
            >
              <a href="#">启用</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>

      <menu-form
        ref="menuModal"
        :visible="createFormShow"
        :loading="confirmCreateLoading"
        :model="mdl"
        :tree-data="treeData"
        @cancel="handleCreateCancel"
        @ok="handleCreateOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getAllMenus, getTreeMenus, addMenu, delMenu, resetMenu, editMenu } from '@/api/core/menuManage'
import { Ellipsis, STable } from '@/components'

import MenuForm from './modules/MenuForm'

const columns = [
  {
    title: '标题',
    dataIndex: 'menuTitle',
    width: 200,
    fixed: 'left'
  },
  {
    title: '名称',
    dataIndex: 'menuName',
    width: 150
  },
  {
    title: '类型',
    dataIndex: 'menuType',
    scopedSlots: { customRender: 'menuType' }
  },
  {
    title: '是否外链',
    dataIndex: 'outerChain',
    scopedSlots: { customRender: 'outerChain' }
  },
  {
    title: '路径',
    dataIndex: 'path',
    width: 150
  },
  {
    title: '组件',
    dataIndex: 'component',
    width: 150
  },
  {
    title: '图标',
    dataIndex: 'iconName',
    width: 150
  },
  {
    title: '权限标识',
    dataIndex: 'permissionSign',
    width: 150
  },
  {
    title: '排序',
    dataIndex: 'orderNo'
  },
  {
    title: '状态',
    dataIndex: 'deleteTime',
    scopedSlots: { customRender: 'deleteTime' },
    fixed: 'right'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

const menuTypeMap = {
  'M': {
    text: '目录'
  },
  'C': {
    text: '菜单'
  },
  'F': {
    text: '按钮'
  }
}

const statusMap = {
  1: {
    status: 'success',
    text: '已启用'
  },
  2: {
    status: 'default',
    text: '已停用'
  }
}

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}

export default {
  components: {
    STable,
    Ellipsis,
    MenuForm
  },
  data () {
    return {
      loadData: () => {
        return getTreeMenus().then((res) => {
          // 封装返回的数据，供s-table使用
          return {
            'data': res
          }
        })
      },
      columns,
      rowSelection,
      createFormShow: false,
      confirmCreateLoading: false,
      mdl: null,
      treeData: []
    }
  },
  created () {
  },
  filters: {
    menuTypeFilter (menuType) {
      return menuType ? menuTypeMap[menuType].text : ''
    },
    statusFilter (deleteTime) {
      return deleteTime ? statusMap[2].text : statusMap[1].text
    },
    statusTypeFilter (deleteTime) {
      return deleteTime ? statusMap[2].status : statusMap[1].status
    }
  },
  computed: {
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleAdd () {
      this.mdl = {}
      this.treeData = []
      getAllMenus().then(res => {
        this.treeData = this.handleTree(res)
        // 重置表单
        this.$refs.menuModal.form.resetFields()
        this.createFormShow = true
      })
    },
    handleDel (record) {
      delMenu(record.id).then(res => {
        // 刷新表格
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleReset (record) {
      resetMenu(record.id).then(res => {
        // 刷新表格
        this.$refs.table.refresh()
        this.$message.info('启用成功')
      })
    },
    handleEdit (record) {
      this.mdl = this.buildModel(record)
      this.treeData = []
      getAllMenus().then(res => {
        this.treeData = this.handleTree(res)
        this.createFormShow = true
      })
    },
    handleCreateCancel () {
      this.createFormShow = false
    },
    handleCreateOk () {
      const form = this.$refs.menuModal.form
      this.confirmCreateLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 修改
          if (values.id > 0) {
            editMenu(values).then((res) => {
              this.createFormShow = false
              this.confirmCreateLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            }).catch(() => {
              this.confirmCreateLoading = false
            })
          } else {
            addMenu(values).then((res) => {
              this.createFormShow = false
              this.confirmCreateLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('新增成功')
            }).catch(() => {
              this.confirmCreateLoading = false
            })
          }
        } else {
          this.confirmCreateLoading = false
        }
      })
    },
    handleTree (tree) {
      const children = []
      tree.forEach(item => {
        const node = {
          //  标题
          title: item.menuTitle,
          value: item.id,
          key: item.id,
          disabled: item.deleteTime !== null || item.menuType === 'F'
        }
        // 是否有子菜单，并递归处理
        if (item.children && item.children.length > 0) {
          // Recursion
          const t = this.handleTree(item.children)
          // 如果没有孩子，则不赋值
          if (t.length > 0) node.children = t
        }
        children.push(node)
      })
      return children
    },
    buildModel (record) {
      return {
        id: record.id,
        parentId: record.parentId,
        menuType: record.menuType,
        menuTitle: record.menuTitle,
        menuName: record.menuName,
        path: record.path,
        permissionSign: record.permissionSign,
        component: record.component,
        iconName: record.iconName,
        isOuterChain: record.outerChain,
        orderNo: record.orderNo
      }
    }
  }
}
</script>
