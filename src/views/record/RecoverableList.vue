<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="check" @click="handleAdd">报销所选</a-button>
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
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">报销</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Ellipsis, STable } from '@/components'
import { getRecoverableList } from '@/api/record/recordManage'

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
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      columns,
      // edit model
      editFormShow: false,
      confirmEditLoading: false,
      mdl: null,
      loading: false,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const params = {
          pageNo: parameter.pageNo,
          pageSize: parameter.pageSize
        }
        return getRecoverableList(params).then(res => {
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
  },
  methods: {
    ...mapActions(['GetRecordCategoryList', 'GetRecordAccounts', 'GetRecordBooks']),
    moment,
    handleAdd () {
      // 跳转到记账
    },
    handleEdit (record) {
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  }
}
</script>
