<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名称">
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
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入创建日期"/>
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
        <span slot="nickname" slot-scope="text">
          <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="sex" slot-scope="text">
          {{ text | sexFilter }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span>
      </s-table>
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
import { getUserByPage, getUser, editUser } from '@/api/core/userManage'

import EditForm from './modules/EditUserForm'
import CreateForm from './modules/CreateRoleForm'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '用户Id',
    dataIndex: 'id'
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    scopedSlots: { customRender: 'nickname' }
  },
  {
    title: '性别',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '邮箱',
    dataIndex: 'email'
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

const sexMap = {
  1: {
    text: '男'
  },
  2: {
    text: '女'
  },
  3: {
    text: '未知'
  }
}

export default {
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
        return getUserByPage(params)
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
    },
    sexFilter (sex) {
      return sex ? sexMap[sex].text : sexMap[3].text
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
      this.editFormShow = true
    },
    handleEdit (record) {
      // 获取用户信息
      getUser(record.id).then(res => {
        this.mdl = { ...res }
        // 找到拥有的角色Id
        this.mdl.ownedRoleIds = []
        this.mdl.ownedRoles.forEach(n => {
          this.mdl.ownedRoleIds.push(n.id.toString())
        })
        // 将性别变为String
        this.mdl.sex = this.mdl.sex.toString()
        this.editFormShow = true
      })
    },
    handleEditOk () {
      const form = this.$refs.editModal.form
      this.confirmEditLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 如果有Id则为编辑
          console.log(values)
          editUser({
            id: values.id,
            sex: values.sex,
            nickname: values.nickname,
            email: values.email,
            roles: values.ownedRoleIds
          }).then(res => {
              this.editFormShow = false
              this.confirmEditLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            }
          ).catch(() => {
            this.confirmEditLoading = false
          })
        } else {
          this.confirmEditLoading = false
        }
      })
    },
    handleDel (record) {
      this.$message.info(record.name)
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
