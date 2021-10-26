<template>
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
      label="支出类别"
      :labelCol="{lg: {span: 4}, sm: {span: 4}}"
      :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
      <a-select v-decorator="['spendCategory',{ initialValue: spendCategoryList[0].id}, {rules: [{ required: true, message: '请选择支出类别' }]}]">
        <a-select-option v-for="(item, index) in spendCategoryList" :key="index" :value="item.id" >{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="账户"
      help="默认选择第一个账户"
      :labelCol="{lg: {span: 4}, sm: {span: 4}}"
      :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
      <a-select v-decorator="['recordAccount',{ initialValue: recordAccounts[0].id}, {rules: [{ required: true, message: '请选择支出账户' }]}]">
        <a-icon slot="suffixIcon" type="smile" />
        <a-select-option v-for="(item, index) in recordAccounts" :key="index" :value="item.id" >
          <span role="img" aria-label="China">
            <icon-font :type="getAccountIcon(item.typeValue)" class="icon-size" />
          </span>
          {{ item.name + ' -- ' + item.typeText }}
        </a-select-option>
      </a-select>
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
      <a-date-picker v-decorator="['buildTime',{ initialValue: moment()}, {rules: [{ required: true, message: '请选择起止日期' }]}]" style="width: 100%" />
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
</template>

<script>

import { mapState } from 'vuex'
import { EXPEND_TYPE, IS_USER_DEFAULT } from '@/store/mutation-types'
import { Icon } from 'ant-design-vue'
import moment from 'moment'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2064096_sy2ci1zr88.js'
})

const iconMap = {
  cash: 'custom-icon-_xianjin',
  bankCard: 'custom-icon--yinhangqia',
  financialAccount: 'custom-icon-jijinlicai',
  payment: 'custom-icon-yingshouyingfulei'
}

export default {
  components: {
    IconFont
  },
  data () {
    return {
      form: this.$form.createForm(this),
      defaultAccount: 'test'
    }
  },
  methods: {
    moment,
    getAccountIcon (code) {
      return iconMap[code]
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
      console.log(this.defaultRecordBook)
    }
  },
  computed: {
    ...mapState({
      spendCategoryList: (state) => state.record.spendCategoryList[EXPEND_TYPE],
      recordAccounts: (state) => state.record.recordAccounts,
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
