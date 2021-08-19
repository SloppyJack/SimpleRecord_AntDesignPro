<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-form-item v-show="model && model.id > 0" label="字典ID">
          <a-input v-decorator="['dictId']" disabled />
        </a-form-item>
        <a-form-item label="字典项文本">
          <a-input v-decorator="['text', {rules: [{required: true, message: '请输入字典项文本！'}]}]" />
        </a-form-item>
        <a-form-item label="字典项值">
          <a-input v-decorator="['value', {rules: [{required: true, message: '请输入字典项值！'}]}]" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-decorator="['remark']" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-decorator="['orderNo']"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

import { Tree } from 'ant-design-vue'

// 表单字段
const fields = ['id', 'dictId', 'text', 'value', 'remark', 'orderNo']

export default {
  components: {
    ATree: Tree
  },
  props: {
    title: {
      type: String,
      default: () => '编辑字典'
    },
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
