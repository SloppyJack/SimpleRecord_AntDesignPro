<template>
  <page-header-wrapper content="在这里您可以看到多个资产账户的概况" :breadcrumb="false">
    <a-row :gutter="16">
      <a-col class="gutter-row" :span="8">
        <a-list-item>
          <a-button class="new-btn" type="dashed" @click="handleAdd">
            <a-icon type="plus" />
            新增账户
          </a-button>
        </a-list-item>
      </a-col>
      <a-col class="gutter-row" :span="8" v-for="item in recordAccounts" :key="item.id">
        <div class="card-wrap">
          <a-card :hoverable="true">
            <div class="content-wrap">
              <a-card-meta>
                <a slot="title">{{ item.name }}</a>
                <icon-font slot="avatar" type="custom-icon-xianjin" class="icon-size" />
                <div class="meta-content" slot="description">{{ item.typeText }}</div>
              </a-card-meta>
              <div class="right-content">
                <div class="amount">金额</div>
                <div class="account-flow_wrap">
                  <span>流入: 10</span>
                  <a-divider type="vertical" />
                  <span>流出: 10</span>
                </div>
              </div>
            </div>
            <template class="ant-card-actions" slot="actions">
              <a>删除</a>
              <a>修改</a>
            </template>
          </a-card>
        </div>
      </a-col>
    </a-row>
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
  scriptUrl: '//at.alicdn.com/t/font_2064096_t32k0b706a.js',
})

export default {
  components: {
    CapitalAccountForm,
    IconFont,
  },
  data() {
    return {
      recordAccounts: [],
      mdl: {},
      formShow: false,
      formLoading: false,
      formTitle: '',
    }
  },
  methods: {
    ...mapActions(['GetDictItems']),
    handleAdd() {
      this.mdl = {}
      this.formTitle = '新增资产账户'
      this.formShow = true
    },
    handleOk() {
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
              inNetAssets: values.inNetAssets ? 1 : 2,
            })
              .then((res) => {
                this.formShow = false
                this.formLoading = false
                // 重置表单数据
                form.resetFields()
                this.$message.info('新增成功')
              })
              .catch(() => {
                this.formLoading = false
              })
          }
        } else {
          this.formLoading = false
        }
      })
    },
    handleCancel() {
      this.formShow = false
    },
    async getRecordAccounts() {
      // get recordAccounts
      getRecordAccounts().then((res) => {
        this.recordAccounts = res
      })
    },
  },
  computed: {
    ...mapState({
      accountType: (state) => state.dict.accountType,
    }),
  },
  async mounted() {
    // get dict values
    if (!this.accountType.length) {
      await this.GetDictItems(ACCOUNT_TYPE)
    }
    await this.getRecordAccounts()
  },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';

.gutter-row {
  margin-bottom: 16px;
  & li {
    padding: 0;
  }
}

.card-wrap {
  min-height: 140px;
  display: flex;
  align-items: center;
  width: 100%;

  .ant-card {
    width: 100%;
  }

  .content-wrap {
    display: flex;

    .ant-card-meta {
      flex: 1;
    }

    .right-content {
      .amount {
        text-align: right;
        margin-bottom: 8px;
      }
      .account-flow_wrap {
        text-align: right;
        font-size: 12px;
      }
    }
  }
}

.card-list {
  /deep/ .ant-card-body:hover {
    .ant-card-meta-title > a {
      color: @primary-color;
    }
  }

  /deep/ .ant-card-meta-title {
    margin-bottom: 12px;

    & > a {
      display: inline-block;
      max-width: 100%;
      color: rgba(0, 0, 0, 0.85);
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
      color: rgba(0, 0, 0, 0.45);
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
  height: 140px;
}

.icon-size {
  font-size: 48px;
}
</style>
