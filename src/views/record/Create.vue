<template>
  <div>
    <a-card title="记一笔">
      <a-spin :spinning="loading">
        <a-tabs v-if="!loading" default-active-key="expendType" >
          <a-tab-pane key="expendType" tab="支出">
            <expend-form/>
          </a-tab-pane>
          <a-tab-pane key="incomeType" tab="收入">
            <income-form/>
          </a-tab-pane>
          <a-tab-pane key="transferType" tab="转账">
            Content of Tab Pane 3
          </a-tab-pane>
          <a-tab-pane key="loanType" tab="借贷">
            Content of Tab Pane 3
          </a-tab-pane>
        </a-tabs>
      </a-spin>
      <a-button slot="tabBarExtraContent" type="primary" icon="right" @click="toMonthList">月账单</a-button>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { createRecord } from '@/api/record/recordManage'
import ExpendForm from './modules/ExpendForm'
import IncomeForm from './modules/IncomeForm'
import { mapActions } from 'vuex'

export default {
  components: {
    ExpendForm,
    IncomeForm
  },
  data () {
    return {
      loading: true,
      form: this.$form.createForm(this),
      selectOptions: []
    }
  },
  methods: {
    ...mapActions(['GetRecordCategoryList', 'GetRecordAccounts', 'GetRecordBooks']),
    handleSubmit (e) {
      // 取消submit事件的默认动作
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const data = {
            spendCategoryId: values.spendCategoryId,
            amount: values.amount,
            occurTime: moment(values.occurTime).format('YYYY-MM-DD'),
            remarks: values.remarks
          }
          createRecord(data).then(res => {
            this.$message.success('记账成功')
            this.form.resetFields()
            this.loading = false
          })
        }
      })
    },
    toMonthList () {
      // 跳转到月账单
      this.$router.push({ name: 'monthRecordList' })
    }
  },
  async mounted () {
    // 获取记账类别
    await this.GetRecordCategoryList()
    // 获取资产账户
    await this.GetRecordAccounts()
    // 获取用户账单
    await this.GetRecordBooks()
    // 取消loading
    this.loading = false
  }
}
</script>
