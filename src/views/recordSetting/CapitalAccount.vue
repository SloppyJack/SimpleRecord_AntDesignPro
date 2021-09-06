<template>
  <page-header-wrapper
    content="在这里您可以看到多个资产账户的概况"
    :breadcrumb="false"
  >
    <a-list
      rowKey="id"
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="recordAccounts"
    >
      <a-list-item>
        <a-button class="new-btn" type="dashed" @click="handleAdd">
          <a-icon type="plus"/>
          新增账户
        </a-button>
      </a-list-item>
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :hoverable="true">
          <a-card-meta>
            <a slot="title">{{ item.title }}</a>
            <icon-font slot="avatar" type="custom-icon-xianjin" class="icon-size"/>
            <div class="meta-content" slot="description">{{ item.content }}</div>
          </a-card-meta>
          <template class="ant-card-actions" slot="actions">
            <a>操作一</a>
            <a>操作二</a>
          </template>
        </a-card>
      </a-list-item>
    </a-list>
    <capital-account-form
      ref="formModal"
      :visible="formShow"
      :loading="formLoading"
      :title="formTitle"
      :model="mdl"
      @ok="handleOk"
      @cancel="handleCancel"
    />
  </page-header-wrapper>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ACCOUNT_TYPE } from '@/store/mutation-types'
import CapitalAccountForm from './modules/CapitalAccountForm'
import { addRecordAccount, getRecordAccounts } from '@/api/record/recordAccountManage'
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2064096_t32k0b706a.js'
})

export default {
  components: {
    CapitalAccountForm,
    IconFont
  },
  data () {
    return {
      recordAccounts: [],
      mdl: {},
      formShow: false,
      formLoading: false,
      formTitle: ''
    }
  },
  methods: {
    ...mapActions(['GetDictItems']),
    handleAdd () {
      this.mdl = {}
      this.formTitle = '新增资产账户'
      this.formShow = true
    },
    handleOk () {
      const form = this.$refs.formModal.form
      this.formLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            console.log('编辑')
          } else {
            addRecordAccount({
              type: values.type,
              name: values.name,
              inNetAssets: values.inNetAssets ? 1 : 2
            }).then(res => {
                this.formShow = false
                this.formLoading = false
                // 重置表单数据
                form.resetFields()
                this.$message.info('新增成功')
              }
            ).catch(() => {
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
    async getRecordAccounts () {
      // get recordAccounts
      getRecordAccounts().then(res => {
        this.recordAccounts = res
      })
    }
  },
  computed: {
    ...mapState({
      accountType: state => state.dict.accountType
    })
  },
  async mounted () {
    // get dict values
    if (!this.accountType.length) {
      await this.GetDictItems(ACCOUNT_TYPE)
    }
    await this.getRecordAccounts()
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.card-list {
  /deep/ .ant-card-body:hover {
    .ant-card-meta-title>a {
      color: @primary-color;
    }
  }

  /deep/ .ant-card-meta-title {
    margin-bottom: 12px;

    &>a {
      display: inline-block;
      max-width: 100%;
      color: rgba(0,0,0,.85);
    }
  }

  /deep/ .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    margin-bottom: 1em;
  }
}

.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 48px;
}

.ant-card-actions {
  background: #f7f9fa;

  li {
    float: left;
    text-align: center;
    margin: 12px 0;
    color: rgba(0, 0, 0, 0.45);
    width: 50%;

    &:not(:last-child) {
      border-right: 1px solid #e8e8e8;
    }

    a {
      color: rgba(0, 0, 0, .45);
      line-height: 22px;
      display: inline-block;
      width: 100%;
      &:hover {
        color: @primary-color;
      }
    }
  }
}

.new-btn {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 188px;
}

.icon-size {
  font-size: 48px;
}

</style>
