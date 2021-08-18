<template>
  <page-header-wrapper :breadcrumb="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="字典名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="字典编码">
                <a-input v-model="queryParam.code" allow-clear placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
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
        :alert="false"
      >
        <span slot="status" slot-scope="text">
          <a-badge :status="statusTypeFilter(text)" :text="statusFilter(text)" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.dictItemModal.index(record)">字典</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                  v-if="record.status === 0"
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
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </s-table>
      <dict-form
        ref="dictModal"
        :visible="dictForm.show"
        :loading="dictForm.loading"
        :title="dictForm.title"
        :model="dictForm.mdl"
        @cancel="handleDictFormCancel"
        @ok="handleDictFormOk"
      />
      <dict-item
        ref="dictItemModal"
        @ok="showDictItem" />
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { STable } from '@/components'
import { getDictByPage, delDict, addDict, editDict, resetDict } from '@/api/core/dictManage'
import { statusFilter, statusTypeFilter } from '@/utils/businessUtil'
import DictForm from './modules/dict/DictForm'
import DictItem from './modules/dict/DictItem'

export default {
  components: {
    STable,
    DictForm,
    DictItem
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '类型名称',
          dataIndex: 'name'
        },
        {
          title: '唯一编码',
          dataIndex: 'code'
        },
        {
          title: '排序',
          dataIndex: 'orderNo'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDictByPage(Object.assign(parameter, this.queryParam)).then((res) => {
          // 封装返回的数据，供s-table使用
          return {
            'pageNo': res.pageNo,
            'totalCount': res.total,
            'data': res.list
          }
        })
      },
      dictForm: {
        show: false,
        loading: false,
        title: '',
        mdl: null
      }
    }
  },
  methods: {
    statusFilter,
    statusTypeFilter,
    showDictItem () {
      this.$refs.table.refresh()
    },
    handleEdit (record) {
      this.dictForm.mdl = record
      this.dictForm.title = '编辑字典'
      this.dictForm.show = true
    },
    handleAdd () {
      this.dictForm.mdl = null
      this.dictForm.title = '新增字典'
      this.dictForm.show = true
    },
    handleDictFormCancel () {
      this.dictForm.show = false
    },
    handleDictFormOk () {
      const form = this.$refs.dictModal.form
      this.dictForm.loading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 编辑
          if (values.id > 0) {
            editDict({
              id: values.id,
              name: values.name,
              code: values.code,
              orderNo: values.orderNo,
              remark: values.remark
            }).then(res => {
              this.dictForm.loading = false
              this.dictForm.show = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('编辑成功')
            }).catch(() => {
              this.dictForm.loading = false
            })
          } else { // 新增
            addDict({
              name: values.name,
              code: values.code,
              remark: values.remark
            }).then(res => {
              this.dictForm.loading = false
              this.dictForm.show = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('新增成功')
            }).catch(() => {
              this.dictForm.loading = false
            })
          }
        } else {
          this.dictForm.loading = false
        }
      })
    },
    handleDel (record) {
      delDict(record.id).then(() => {
        this.$message.success('删除成功')
        this.$refs.table.refresh()
      })
    },
    handleReset (record) {
      resetDict(record.id).then(() => {
        this.$message.success('启用成功')
        this.$refs.table.refresh()
      })
    }
  }
}
</script>
<style lang="less">
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}
</style>
