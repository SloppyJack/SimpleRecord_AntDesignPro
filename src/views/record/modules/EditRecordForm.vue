<template>
  <a-modal
    title="编辑记录"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', {rules: [{required: true}]}]" disabled />
        </a-form-item>
        <a-form-item label="金额">
          <a-input v-decorator="['amount', {rules: [{required: true, message: '请输入金额！'}]}]" />
        </a-form-item>
        <a-form-item v-show="showFlag" label="类别">
          <a-select v-decorator="['recordCategory', {rules: [{ required: true, message: '请选择类别' }]}]">
            <a-select-option v-for="(item, index) in recordCategoryList[model && model.recordTypeValue]" :key="index" :value="item.name" >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-show="showFlag" label="账户">
          <a-select v-decorator="['recordAccountId', {rules: [{ required: true, message: '请选择支出账户' }]}]">
            <a-icon slot="suffixIcon" type="smile" />
            <a-select-option v-for="(item, index) in recordAccounts" :key="index" :value="item.id" >
              <span>
                <my-icon-font :value="item.typeValue" class="icon-size" />
              </span>
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="账本">
          <a-select v-decorator="['recordBookId', {rules: [{ required: true, message: '请选择账本' }]}]">
            <a-select-option v-for="(item, index) in recordBooks" :key="index" :value="item.id" >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="日期">
          <a-date-picker
            style="width: 100%"
            format="YYYY-MM-DD"
            v-decorator="['occurTime', { rules: [{ required: true, message: '请选择日期' }] }]"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            v-decorator="['remark']"
            placeholder="备注可选填"
            auto-size
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { mapState } from 'vuex'
import MyIconFont from '@/components/MyIconFont/MyIconFont'
import { PAYMENT_ACCOUNT } from '@/store/mutation-types'
import { isTransferType } from '@/utils/businessUtil'

// 表单字段
const fields = ['id', 'amount', 'recordCategory', 'recordAccountId', 'recordBookId', 'recordTypeCode', 'occurTime', 'remark', 'isRecoverable']

export default {
  components: {
    MyIconFont
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      formLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
  },
  computed: {
    ...mapState({
      recordCategoryList: (state) => state.record.recordCategoryList,
      recordAccounts: (state) => state.record.recordAccounts.filter(n => n.typeValue !== PAYMENT_ACCOUNT), // 账户不为应收应付
      recordBooks: (state) => state.record.recordBooks
    }),
    showFlag () {
      return this.model !== null && isTransferType(this.model.recordTypeValue)
    }
  },
  async mounted () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>

<style lang="less" scoped>

.icon-size {
  font-size: 18px;
}
</style>
