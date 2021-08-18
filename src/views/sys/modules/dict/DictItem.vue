<template>
  <a-modal
    title="字典项管理"
    :width="900"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="table-page-search-wrapper" >
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="字典值" >
              <a-input v-model="queryParam.value" allow-clear placeholder="请输入字典值"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="唯一编码" >
              <a-input v-model="queryParam.code" allow-clear placeholder="请输入唯一编码"/>
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
    <a-card :bordered="false">
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowKey="(record) => record.code"
      >
        <template slot="operator">
          <a-button @click="$refs.addForm.add(dictId)" icon="plus" type="primary">新增数据</a-button>
        </template>
        <span slot="status" slot-scope="text">
          <a-badge :status="statusTypeFilter(text)" :text="statusFilter(text)" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.editForm.edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => sysDictDataDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </s-table>
    </a-card>
  </a-modal>
</template>
<script>
import { STable } from '@/components'
import { getDictItemByPage, editDict } from '@/api/core/dictManage'
import { statusFilter, statusTypeFilter } from '@/utils/businessUtil'

export default {
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      visible: false,
      // 表头
      columns: [
        {
          title: '字典值',
          dataIndex: 'value'
        },
        {
          title: '唯一编码',
          dataIndex: 'code'
        },
        {
          title: '排序',
          dataIndex: 'sort'
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
      dictId: null,
      loadData: parameter => {
        this.queryParam.dictId = this.dictId
        return getDictItemByPage(Object.assign(parameter, this.queryParam)).then((res) => {
          // 封装返回的数据，供s-table使用
          return {
            'pageNo': res.pageNo,
            'totalCount': res.total,
            'data': res.list
          }
        })
      },
      statusDict: []
    }
  },
  methods: {
    statusFilter,
    statusTypeFilter,
    // 首先加载此方法
    index (record) {
      this.visible = true
      this.dictId = record.id
      this.queryParam.dictId = record.id
      try {
        this.$refs.table.refresh()
      } catch (e) {
        // 首次进入界面，因表格加载顺序，会抛异常，我们不予理会
      }
    },
    handleCancel () {
      this.queryParam = {}
      this.visible = false
    },
    sysDictDataDelete (record) {
      editDict(record).then((res) => {
        if (res.success) {
          this.$message.success('删除成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      }).catch((err) => {
        this.$message.error('删除错误：' + err.message)
      })
    },
    handleOk () {
      this.$refs.table.refresh()
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
