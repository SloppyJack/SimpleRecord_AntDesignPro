<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="18">
            <a-form-item label="月份">
              <a-month-picker placeholder="选择月份" v-model="queryParam.month" :defaultValue="queryParam.month" @change="changeMonth" :allowClear="false"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="18">
            <a-form-item label="日期">
              <a-date-picker placeholder="选择日期" v-model="queryParam.occurTime" :disabled-date="disabledDate" @openChange="datePickerOpen"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="18">
            <a-form-item label="关键词">
              <a-input v-model="queryParam.keyWord" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="18">
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
      showPagination="auto"
      bordered
    >
      <span slot="amount" slot-scope="text">
        <a-tag :color="text > 0 ? 'green' : 'red'">{{ text }}</a-tag>
      </span>
      <span slot="recordCategory" slot-scope="text">
        <a-tag :color="'blue'">{{ text }}</a-tag>
      </span>
      <span slot="remark" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="description" slot-scope="text, record">
        <ellipsis :length="45" tooltip>{{ buildDesc(record.recordTypeValue, record.sourceAccountName,
                                                    record.targetAccountName, record.amount) }} </ellipsis>
      </span>
      <span slot="recoverableStatus" slot-scope="text">
        <a-tag v-if="text && text !== 1" :color="recoverableColor(text)">{{ recoverableText(text) }}</a-tag>
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
    <edit-record-form
      ref="editModal"
      v-if="loading"
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
import { buildDesc, recoverableText, recoverableColor } from '@/utils/businessUtil'

import EditRecordForm from './modules/EditRecordForm'
import { mapActions } from 'vuex'

const columns = [
  {
    title: '日期',
    dataIndex: 'occurTime'
  },
  {
    title: '账户',
    dataIndex: 'recordAccountName'
  },
  {
    title: '类型',
    dataIndex: 'recordTypeText'
  },
  {
    title: '类别',
    dataIndex: 'recordCategory',
    scopedSlots: { customRender: 'recordCategory' }
  },
  {
    title: '金额',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '报销',
    dataIndex: 'recoverableStatus',
    scopedSlots: { customRender: 'recoverableStatus' }
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
    EditRecordForm
  },
  data () {
    return {
      columns,
      // edit model
      editFormShow: false,
      confirmEditLoading: false,
      mdl: null,
      loading: false,
      // 查询参数
      queryParam: {
        month: null,
        occurTime: null,
        keyWord: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const params = {
          month: moment(this.queryParam.month).format('YYYY-MM'),
          occurTime: this.queryParam.occurTime && moment(this.queryParam.occurTime).format('YYYY-MM-DD'),
          keyWord: this.queryParam.keyWord,
          pageNo: parameter.pageNo,
          pageSize: parameter.pageSize
        }
        return getMonthList(params).then(res => {
          // 封装返回的数据，供s-table使用
          return {
            'pageNo': parameter.pageNo,
            'totalCount': res.total,
            'data': res.list
          }
        })
      }
    }
  },
  created () {
    this.queryParam.month = moment()
  },
  methods: {
    ...mapActions(['GetRecordCategoryList', 'GetRecordAccounts', 'GetRecordBooks']),
    moment,
    buildDesc,
    recoverableText,
    recoverableColor,
    changeMonth (date, dateString) {
      this.queryParam.occurTime = null
    },
    disabledDate (current) {
      const currDate = moment(this.queryParam.month)
      // Can not select days before today and today
      return current < currDate.startOf('month') || current > currDate.endOf('month')
    },
    datePickerOpen (open) {
      if (open && this.queryParam.occurTime === null) {
        // init occurTime
        this.queryParam.occurTime = moment(this.queryParam.month).startOf('month')
      }
    },
    handleAdd () {
      // 跳转到记账
      this.$router.push({ name: 'recordAdd' })
    },
    handleEdit (record) {
      this.mdl = { ...record }
      // 日期格式化
      this.mdl.occurTime = moment(record.occurTime)
      // 金额取绝对值
      this.mdl.amount = Math.abs(this.mdl.amount)
      this.editFormShow = true
    },
    handleEditOk () {
      const form = this.$refs.editModal.form
      this.confirmEditLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          editRecord(values.id, {
            sourceAccountId: this.mdl.sourceAccountId,
            targetAccountId: values.recordAccountId,
            recordBookId: values.recordBookId,
            recordTypeCode: this.mdl.recordTypeValue,
            recordCategory: values.recordCategory,
            amount: values.amount,
            occurTime: moment(values.occurTime).format('YYYY-MM-DD'),
            remark: values.remark
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
    }
  },
  async mounted () {
    // 获取记账类别
    await this.GetRecordCategoryList()
    // 获取资产账户
    await this.GetRecordAccounts()
    // 获取用户账单
    await this.GetRecordBooks()
    this.loading = true
  }
}
</script>
