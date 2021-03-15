<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item v-model="queryParam.date" label="月份">
              <a-month-picker placeholder="选择月份" :defaultValue="queryParam.date" :allowClear="false"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="类型">
              <a-select v-model="queryParam.recordTypeCode" placeholder="请选择">
                <a-select-option value="expendType">支出</a-select-option>
                <a-select-option value="incomeType">收入</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="right" @click="handleAdd">记一笔</a-button>
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
      <span slot="remarks" slot-scope="text">
        <ellipsis :length="8" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="spendCategoryName" slot-scope="text">
        <a-tag :color="'green'">{{ text }}</a-tag>
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
    <record-form
      ref="editModal"
      :visible="editFormShow"
      :loading="confirmEditLoading"
      :model="mdl"
      @cancel="handleEditCancel"
      @ok="handleEditOk"
    />
  </a-card>
</template>

<script>
import moment from 'moment'
import { Ellipsis, STable } from '@/components'
import { getMonthList, delRecord, editRecord } from '@/api/record/recordManage'

import RecordForm from './modules/RecordForm'

const columns = [
  {
    title: '记录Id',
    dataIndex: 'id'
  },
  {
    title: '金额',
    dataIndex: 'amount'
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' }
  },
  {
    title: '类别',
    dataIndex: 'spendCategoryName',
    scopedSlots: { customRender: 'spendCategoryName' }
  },
  {
    title: '日期',
    dataIndex: 'occurTime'
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
    RecordForm
  },
  data () {
    this.columns = columns
    return {
      // edit model
      editFormShow: false,
      confirmEditLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const params = {
          'recordTypeCode': this.queryParam.recordTypeCode,
          'date': moment(this.queryParam.date).format('YYYY-MM'),
          'pageNo': parameter.pageNo,
          'pageSize': parameter.pageSize
        }
        return getMonthList(params).then(res => {
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
  created () {
    this.queryParam.date = moment(new Date().toLocaleDateString(), 'YYYY-MM')
    this.queryParam.recordTypeCode = 'expendType'
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
    moment,
    handleAdd () {
      // 跳转到记账
      this.$router.push({ name: 'recordAdd' })
    },
    handleEdit (record) {
      // 格式化时间
      record.occurTime = moment(record.occurTime)
      this.mdl = { ...record }
      this.editFormShow = true
    },
    handleEditOk () {
      const form = this.$refs.editModal.form
      this.confirmEditLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          editRecord(values.id, {
            amount: values.amount,
            spendCategoryId: values.spendCategoryId,
            occurTime: moment(values.occurTime).format('YYYY-MM-DD'),
            remarks: values.remarks
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
      delRecord(record.id).then(res => {
        // 刷新表格
        this.$refs.table.refresh()
        this.$message.info('删除成功')
      })
    },
    handleEditCancel () {
      this.editFormShow = false
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
