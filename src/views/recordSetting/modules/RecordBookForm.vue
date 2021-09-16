<template>
  <a-modal
    title="操作"
    :visible="visible"
    :confirm-loading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
    :width="700"
    centered
  >
    <a-form :form="form" v-bind="formLayout">
      <a-form-item v-show="record && record.id > 0" label="主键ID">
        <a-input v-decorator="['id']" disabled />
      </a-form-item>
      <a-form-item label="账本名称">
        <a-input v-decorator="['name', {rules:[{required: true, message: '请输入账本名称'}]}]" />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea v-decorator="['remark']" placeholder="备注可选填" />
      </a-form-item>
      <a-form-item v-if="record && record.id > 0" label="默认账户">
        <a-switch v-decorator="['isUserDefault', {rules:[{required: true, message: '请选择是否为默认账户'}]}]" />
      </a-form-item>
      <a-form-item label="排序">
        <a-input-number v-decorator="['orderNo']"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

const fields = ['id', 'name', 'remark', 'isUserDefault', 'orderNo']

export default {
  props: {
    record: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
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
  mounted () {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 获取字典的

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
