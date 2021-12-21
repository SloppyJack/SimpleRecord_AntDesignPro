<template>
  <a-spin :spinning="loading">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="借贷类别"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-select v-decorator="['recordCategory', {initialValue: '借入', rules: [{ required: true, message: '请选择借贷类别' }]}]" @change="handleChange">
          <a-select-option v-for="(item, index) in recordCategoryList" :key="index" :value="item.name" >{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="金额"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input-number
          :min="0"
          :precision="2"
          v-decorator="['amount',{rules: [{ required: true, message: '请输入金额' }]}]"/>
      </a-form-item>
      <a-form-item
        label="账户"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-form-item
          validate-status="validating"
          :help="sourceText"
          :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
        >
          <a-select v-decorator="['sourceAccount', { initialValue: sourceAccounts[0] && sourceAccounts[0].id}]">
            <a-icon slot="suffixIcon" type="smile" />
            <a-select-option v-for="(item, index) in sourceAccounts" :key="index" :value="item.id" >
              <span>
                <my-icon-font :value="item.typeValue" class="icon-size" />
              </span>
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
          👉
        </span>
        <a-form-item
          :help="targetText"
          :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
          <a-select v-decorator="['targetAccount',{ initialValue: targetAccounts[0] && targetAccounts[0].id}]">
            <a-icon slot="suffixIcon" type="smile" />
            <a-select-option v-for="(item, index) in targetAccounts" :key="index" :value="item.id" >
              <span>
                <my-icon-font :value="item.typeValue" class="icon-size" />
              </span>
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item
        label="账本"
        help="默认为默认账本"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-select v-decorator="['recordBook',{ initialValue: defaultRecordBook.id}, {rules: [{ required: true, message: '请选择账本' }]}]">
          <a-select-option v-for="(item, index) in recordBooks" :key="index" :value="item.id" >{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="记账日期"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-date-picker v-decorator="['occurTime',{ initialValue: moment()}, {rules: [{ required: true, message: '请选择起止日期' }]}]" style="width: 100%" />
      </a-form-item>
      <a-form-item
        label="备注"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          v-decorator="['remark']" />
      </a-form-item>
      <a-form-item
        :wrapperCol="{lg: {span: 16}, sm: {span: 23} }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">提交</a-button>
        <a-button style="margin-left: 8px">保存</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>

import { mapState } from 'vuex'
import { LOAN_TYPE, IS_USER_DEFAULT, PAYMENT_ACCOUNT } from '@/store/mutation-types'
import moment from 'moment'
import { addRecordDetail } from '@/api/record/recordManage'
import MyIconFont from '@/components/MyIconFont/MyIconFont'

export default {
  components: {
    MyIconFont
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      sourceText: '出借方（应收/应付）',
      targetText: '收款方',
      targetAccounts: [],
      sourceAccounts: []
    }
  },
  methods: {
    moment,
    handleChange (value) {
      switch (value) {
        case '借入':
          this.sourceAccounts = this.recordAccounts.filter(n => n.typeValue === PAYMENT_ACCOUNT)
          this.targetAccounts = this.recordAccounts.filter(n => n.typeValue !== PAYMENT_ACCOUNT)
          this.sourceText = '出借方（应收/应付）'
          this.targetText = '收款账户'
          break
        case '借出':
          this.sourceAccounts = this.recordAccounts.filter(n => n.typeValue !== PAYMENT_ACCOUNT)
          this.targetAccounts = this.recordAccounts.filter(n => n.typeValue === PAYMENT_ACCOUNT)
          this.sourceText = '付款账户'
          this.targetText = '借款方（应收/应付）'
          break
        case '还款':
          this.sourceAccounts = this.recordAccounts.filter(n => n.typeValue !== PAYMENT_ACCOUNT)
          this.targetAccounts = this.recordAccounts.filter(n => n.typeValue === PAYMENT_ACCOUNT)
          this.sourceText = '付款账户'
          this.targetText = '出借方（应收/应付）'
          break
        case '收款':
          this.sourceAccounts = this.recordAccounts.filter(n => n.typeValue === PAYMENT_ACCOUNT)
          this.targetAccounts = this.recordAccounts.filter(n => n.typeValue !== PAYMENT_ACCOUNT)
          this.sourceText = '借款方（应收/应付）'
          this.targetText = '收款账户'
          break
      }
      // 重置form为默认值
      this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const params = {
            sourceAccountId: values.sourceAccount,
            targetAccountId: values.targetAccount,
            recordBookId: values.recordBook,
            recordTypeCode: LOAN_TYPE,
            recordCategory: values.recordCategory,
            amount: values.amount,
            occurTime: values.occurTime,
            remark: values.remark
          }
          addRecordDetail(params).then(res => {
            // 重置表单数据
            this.form.resetFields()
            this.$message.info('记账成功')
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }
      })
    }
  },
  computed: {
    ...mapState({
      recordCategoryList: (state) => state.record.recordCategoryList[LOAN_TYPE],
      recordAccounts: (state) => state.record.recordAccounts,
      recordBooks: (state) => state.record.recordBooks
    }),
    defaultRecordBook () {
      return this.recordBooks.find(n => n.isUserDefault === IS_USER_DEFAULT)
    }
  },
  mounted () {
    this.sourceAccounts = this.recordAccounts.filter(n => n.typeValue === PAYMENT_ACCOUNT)
    this.targetAccounts = this.recordAccounts.filter(n => n.typeValue !== PAYMENT_ACCOUNT)
  }
}
</script>

<style lang="less" scoped>

.icon-size {
  font-size: 18px;
}
</style>
