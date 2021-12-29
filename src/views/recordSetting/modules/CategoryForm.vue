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
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-form-item label="类型">
          <a-select v-decorator="['typeValue', {rules: [{required: true, message: '请选择类型！'}]}]">
            <a-select-option value="expendType">支出</a-select-option>
            <a-select-option value="incomeType">收入</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入名称！'}]}]" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-decorator="['orderNo', {rules: [{required: true, message: '请输入排序'}]}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'typeValue', 'name', 'orderNo']

export default {
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
  filters: {
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
