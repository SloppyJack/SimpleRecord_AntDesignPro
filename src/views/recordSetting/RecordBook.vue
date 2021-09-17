<template>
  <page-header-wrapper
    :breadcrumb="false"
    content="tips：账本仅为记录账单的归处，与资产账户并无直接关联"
  >
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <info title="默认账本" value="8个任务" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="总支出" value="32分钟" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="总收入" value="24个" />
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="账本列表">

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="handleAdd">添加</a-button>
      </div>

      <a-spin :spinning="loading">
        <a-list size="large" :pagination="pagination">
          <a-list-item :key="index" v-for="(item, index) in data">
            <a-list-item-meta :description="item.name">
              <icon-font slot="avatar" type="custom-icon-zhangben" class="icon-size" />
              <a slot="title">{{ item.remark }}</a>
            </a-list-item-meta>
            <div v-if="item.isUserDefault">
              <a-tag color="green">默认账户</a-tag>
            </div>
            <div slot="actions">
              <a @click="handleEdit(item)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDel(record)"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </div>
          </a-list-item>
        </a-list>
      </a-spin>
    </a-card>
    <RecordBookForm
      ref="formModal"
      :visible="formShow"
      :loading="formLoading"
      :title="formTitle"
      :model="mdl"
      @ok="handleOk"
      @cancel="handleCancel"/>

  </page-header-wrapper>
</template>

<script>

import { STable } from '@/components'
import RecordBookForm from './modules/RecordBookForm'
import Info from './components/Info'
import { addRecordBook, getRecordBooksByPage, editRecordBook } from '@/api/record/recordBookManage'
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2064096_sy2ci1zr88.js'
})

// 表头
const columns = [
  {
    title: '主键',
    dataIndex: 'id'
  },
  {
    title: '账单名称',
    dataIndex: 'name'
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
    title: '是否系统内置',
    dataIndex: 'isUserDefault'
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
]

export default {
  components: {
    RecordBookForm,
    Info,
    STable,
    IconFont
  },
  data () {
    return {
      data: [],
      columns,
      pagination: {
        current: 1,
        pageSize: 10,
        hideOnSinglePage: true,
        total: 0,
        onChange: cur => {
          this.current = cur
          this.loadData()
        }
      },
      loading: false,
      mdl: {},
      formShow: false,
      formLoading: false,
      formTitle: ''
    }
  },
  methods: {
    handleAdd () {
      this.$refs.formModal.form.resetFields()
      this.formTitle = '新增账本'
      this.formShow = true
    },
    handleEdit (record) {
      this.mdl = record
      console.log(this.mdl)
      this.formTitle = '编辑账本'
      this.formShow = true
    },
    handleOk () {
      const form = this.$refs.formModal.form
      this.formLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            editRecordBook(values.id, {
              name: values.name,
              remark: values.remark,
              isUserDefault: values.isUserDefault,
              orderNo: values.orderNo
            }).then(() => {
              this.formShow = false
              this.formLoading = false
              // 重置表单数据
              form.resetFields()
              this.$message.info('修改成功')
              this.loadData()
            }).catch(() => {
              this.formLoading = false
            })
          } else {
            addRecordBook({
              name: values.name,
              remark: values.remark,
              orderNo: values.orderNo
            }).then(() => {
                this.formShow = false
                this.formLoading = false
                // 重置表单数据
                form.resetFields()
                this.$message.info('新增成功')
                this.loadData()
              }).catch(() => {
                this.formLoading = false
              })
          }
        } else {
          this.formLoading = false
        }
      })
    },
    handleCancel () {
      this.formShow = false
    },
    async loadData () {
      this.loading = true
      const param = { pageNo: this.pagination.current, pageSize: this.pagination.pageSize }
      await getRecordBooksByPage(param).then((res) => {
        this.data = res.list
        this.data.forEach((item) => {
          item.isUserDefault = item.isUserDefault === 1
        })
        this.pagination.current = res.pageNo
        this.pagination.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  computed: {
  },
  async mounted () {
    await this.loadData()
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
}

.list-content-item {
  color: rgba(0, 0, 0, .45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}

.icon-size {
  font-size: 48px;
}
</style>
