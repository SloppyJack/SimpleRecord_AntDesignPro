<template>
  <a-spin :spinning="loading">
    <a-form @submit="handleSubmit" :form="form">
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
          help="请选择出账账户"
          :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
        >
          <a-select v-decorator="['sourceAccount']">
            <a-icon slot="suffixIcon" type="smile" />
            <a-select-option v-for="(item, index) in sourceAccounts" :key="index" :value="item.id" >
              <span role="img" aria-label="China">
                <my-icon-font :value="item.typeValue" class="icon-size" />
              </span>
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
          👉
        </span>
        <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
          <a-select v-decorator="['targetAccount',{ initialValue: targetAccounts[0].id}]">
            <a-icon slot="suffixIcon" type="smile" />
            <a-select-option v-for="(item, index) in targetAccounts" :key="index" :value="item.id" >
              <span role="img" aria-label="China">
                <my-icon-font :value="item.typeValue" class="icon-size" />
              </span>
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item
        label="账单"
        help="默认为默认账单"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-select v-decorator="['recordBook',{ initialValue: defaultRecordBook.id}, {rules: [{ required: true, message: '请选择账单' }]}]">
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
import { createRecord } from '@/api/record/recordManage'
import MyIconFont from '@/components/MyIconFont/MyIconFont'

export default {
  components: {
    MyIconFont
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false
    }
  },
  methods: {
    moment,
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
            recordCategory: LOAN_TYPE,
            amount: values.amount,
            occurTime: values.occurTime,
            remark: values.remark
          }
          createRecord(params).then(res => {
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
      sourceAccounts: (state) => state.record.recordAccounts.filter(n => n.typeValue === PAYMENT_ACCOUNT),
      targetAccounts: (state) => state.record.recordAccounts.filter(n => n.typeValue !== PAYMENT_ACCOUNT),
      recordBooks: (state) => state.record.recordBooks
    }),
    defaultRecordBook () {
      return this.recordBooks.find(n => n.isUserDefault === IS_USER_DEFAULT)
    }
  }
}
</script>

<style lang="less" scoped>

.icon-size {
  font-size: 18px;
}
</style>
