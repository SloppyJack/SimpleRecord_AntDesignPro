<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="创建日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:roleManage:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="deleteTime" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="info" slot-scope="text">
          <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">删除</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="createFormShow"
        :loading="confirmCreateLoading"
        :model="mdl"
        @cancel="handleCreateCancel"
        @ok="handleCreateOk"
      />
      <edit-form
        ref="editModal"
        :visible="editFormShow"
        :loading="confirmEditLoading"
        :model="mdl"
        @cancel="handleEditCancel"
        @ok="handleEditOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { Ellipsis, STable } from '@/components'
import { getRoleList, addRole, editRole } from '@/api/manage'

import EditForm from './modules/EditForm'
import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '角色Id',
    dataIndex: 'id'
  },
  {
    title: '角色名',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'info',
    scopedSlots: { customRender: 'info' }
  },
  {
    title: '状态',
    dataIndex: 'deleteTime',
    scopedSlots: { customRender: 'deleteTime' }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

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

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    EditForm
  },
  data () {
    this.columns = columns
    return {
      // create model
      createFormShow: false,
      confirmCreateLoading: false,
      // edit model
      editFormShow: false,
      confirmEditLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(this.queryParam)
        let deleted = null
        if (this.queryParam.status === '1') {
          deleted = false
        } else if (this.queryParam.status === '2') {
          deleted = true
        }
        const params = {
          'name': this.queryParam.name,
          'deleted': deleted,
          'date': this.queryParam.date,
          'pageNo': parameter.pageNo,
          'pageSize': parameter.pageSize
        }
        return getRoleList(params)
          .then(res => {
            // 封装返回的数据，供s-table使用
            return {
              'pageNo': parameter.pageNo,
              'totalCount': res.total,
              'data': res.list
            }
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (deleteTime) {
      return deleteTime ? statusMap[2].text : statusMap[1].text
    },
    statusTypeFilter (deleteTime) {
      return deleteTime ? statusMap[2].status : statusMap[1].status
    }
  },
  created () {
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.createFormShow = true
    },
    handleEdit (record) {
      this.editFormShow = true
      this.mdl = { ...record }
    },
    handleCreateOk () {
      const form = this.$refs.createModal.form
      this.confirmCreateLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          addRole(values).then(res => {
              this.createFormShow = false
              this.confirmCreateLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('新增成功')
          }
          ).catch(() => {
            this.confirmCreateLoading = false
          })
        } else {
          this.confirmCreateLoading = false
        }
      })
    },
    handleEditOk (finalCheckedKeys) {
      const form = this.$refs.editModal.form
      this.confirmEditLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          console.log('finalCheckedKeys', finalCheckedKeys)
          editRole({
            id: values.id,
            name: values.name,
            info: values.info,
            menuIds: finalCheckedKeys
          }).then(res => {
              this.editFormShow = false
              this.confirmEditLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('新增成功')
            }
          ).catch(() => {
            this.confirmEditLoading = false
          })
        } else {
          this.confirmEditLoading = false
        }
      })
    },
    handleCreateCancel () {
      this.createFormShow = false
    },
    handleEditCancel () {
      this.editFormShow = false
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
