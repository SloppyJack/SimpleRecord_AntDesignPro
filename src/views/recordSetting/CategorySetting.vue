<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="类型">
              <a-select v-model="recordTypeCode" placeholder="请选择" :allowClear="true">
                <a-select-option value="expendType">支出</a-select-option>
                <a-select-option value="incomeType">收入</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-popconfirm
                style="margin-left: 8px"
                title="确定将类别重置为初始状态吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="resetCategory"
              >
                <a-button type="danger">重置类别</a-button>
              </a-popconfirm>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :pageSize="10"
      bordered
    >
      <span slot="typeText" slot-scope="text, record">
        <a-tag :color="record.typeValue === 'expendType' ? 'red' : 'green'">{{ text }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDel(record)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <category-form
      ref="formModal"
      :visible="formShow"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleEditCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import moment from 'moment'
import { Ellipsis, STable } from '@/components'
import { getRecordCategoryByPage, delRecordCategory, editRecordCategory, addRecordCategory, resetRecordCategory } from '@/api/record/recordCategoryManage'

import CategoryForm from './modules/CategoryForm'

const columns = [
  {
    title: '类型',
    dataIndex: 'typeText',
    scopedSlots: { customRender: 'typeText' }
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    STable,
    Ellipsis,
    CategoryForm
  },
  data () {
    this.columns = columns
    return {
      // edit model
      formShow: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      recordTypeCode: '',
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const params = {
          pageNo: parameter.pageNo,
          pageSize: parameter.pageSize,
          recordTypeCode: this.recordTypeCode
        }
        return getRecordCategoryByPage(params).then(res => {
          return {
            'pageNo': parameter.pageNo,
            'totalCount': res.total,
            'data': res.list
          }
        })
      }
    }
  },
  methods: {
    moment,
    handleAdd () {
      // 重置表单数据
      this.$refs.formModal.form.resetFields()
      this.mdl = {}
      this.formShow = true
    },
    handleEdit (record) {
      this.mdl = { ...record }
      this.formShow = true
    },
    handleOk () {
      const form = this.$refs.formModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            editRecordCategory(values.id, {
              recordTypeCode: values.typeValue,
              name: values.name,
              orderNo: values.orderNo
            }).then(res => {
                this.formShow = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                this.$message.info('修改成功')
              }
            ).catch(() => {
              this.confirmLoading = false
            })
          } else {
            addRecordCategory({
              recordTypeCode: values.typeValue,
              name: values.name,
              orderNo: values.orderNo
            }).then(res => {
                this.formShow = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                this.$message.info('新增成功')
              }
            ).catch(() => {
              this.confirmLoading = false
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleDel (record) {
      delRecordCategory(record.id).then(res => {
        // 刷新表格
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleEditCancel () {
      this.formShow = false
    },
    resetCategory () {
      resetRecordCategory().then(res => {
        // 刷新表格
        this.$refs.table.refresh()
        this.$message.info('重置成功')
      })
    }
  }
}
</script>
