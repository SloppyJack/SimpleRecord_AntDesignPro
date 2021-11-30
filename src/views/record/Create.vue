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
            <transfer-form/>
          </a-tab-pane>
          <a-tab-pane key="loanType" tab="借贷">
            <loan-form/>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
      <a-button slot="extra" type="primary" icon="right" @click="toMonthList">月账单</a-button>
    </a-card>
  </div>
</template>

<script>
import ExpendForm from './modules/ExpendForm'
import IncomeForm from './modules/IncomeForm'
import TransferForm from './modules/TransferForm'
import LoanForm from './modules/LoanForm'
import { mapActions } from 'vuex'

export default {
  components: {
    ExpendForm,
    IncomeForm,
    TransferForm,
    LoanForm
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    ...mapActions(['GetRecordCategoryList', 'GetRecordAccounts', 'GetRecordBooks']),
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
