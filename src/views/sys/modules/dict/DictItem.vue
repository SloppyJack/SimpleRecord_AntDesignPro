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
              <a-input v-model="queryParam.text" allow-clear placeholder="请输入字典项文本"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="唯一编码" >
              <a-input v-model="queryParam.value" allow-clear placeholder="请输入字典项值"/>
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
    <a-card :bordered="false">
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :alert="false"
        rowKey="id"
      >
        <span slot="status" slot-scope="text">
          <a-badge :status="statusTypeFilter(text)" :text="statusFilter(text)" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="确定要删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDel(record)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
      </s-table>
      <dict-item-form
        ref="dictItemModal"
        :visible="form.show"
        :loading="form.loading"
        :title="form.title"
        :model="form.mdl"
        @cancel="handleFormCancel"
        @ok="handleFormOk"
      />
    </a-card>
  </a-modal>
</template>
<script>
import { STable } from '@/components'
import { getDictItemByPage, editDictItem, addDictItem, delDictItem } from '@/api/core/dictManage'
import { statusFilter, statusTypeFilter } from '@/utils/businessUtil'
import DictItemForm from './DictItemForm'

export default {
  components: {
    STable,
    DictItemForm
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      visible: false,
      // 表头
      columns: [
        {
          title: '主键',
          dataIndex: 'id'
        },
        {
          title: '字典Id',
          dataIndex: 'dictId'
        },
        {
          title: '字典项文本',
          dataIndex: 'text'
        },
        {
          title: '字典项值',
          dataIndex: 'value'
        },
        {
          title: '排序',
          dataIndex: 'orderNo'
        },
        {
          title: '备注',
          dataIndex: 'remark'
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
      form: {
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
    handleOk () {
      this.$refs.table.refresh()
    },
    handleAdd () {
      this.form.mdl = {
        text: '',
        value: '',
        orderNo: '',
        remark: ''
      }
      this.form.title = '新增字典项'
      this.form.show = true
    },
    handleEdit (record) {
      this.form.mdl = record
      this.form.title = '编辑字典项'
      this.form.show = true
    },
    handleFormCancel () {
      this.form.show = false
    },
    handleFormOk () {
      const form = this.$refs.dictItemModal.form
      this.form.loading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 编辑
          if (values.id > 0) {
            editDictItem({
              id: values.id,
              dictId: values.dictId,
              text: values.text,
              value: values.value,
              orderNo: values.orderNo,
              remark: values.remark
            }).then(res => {
              this.form.loading = false
              this.form.show = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('编辑成功')
            }).catch(() => {
              this.form.loading = false
            })
          } else { // 新增
            addDictItem({
              dictId: this.dictId,
              text: values.text,
              value: values.value,
              orderNo: values.orderNo,
              remark: values.remark
            }).then(res => {
              this.form.loading = false
              this.form.show = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('新增成功')
            }).catch(() => {
              this.form.loading = false
            })
          }
        } else {
          this.form.loading = false
        }
      })
    },
    handleDel (record) {
      delDictItem(record.id).then(() => {
        this.$message.success('删除成功')
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
