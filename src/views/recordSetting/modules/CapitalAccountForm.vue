<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="账户类型">
          <a-radio-group v-decorator="['type', {rules: [{required: true, message: '请选择账户类型'}]}]" button-style="solid">
            <a-radio-button :key="index" v-for="(item, index) in accountType" :value="item.id">
              {{ item.text }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="账户名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请选择账户名称'}]}]" />
        </a-form-item>
        <a-form-item label="是否属于净资产">
          <a-switch v-decorator="['inNetAssets', {rules: [{required: true, message: '请选择是否属于净资产'}], initialValue: true, valuePropName: 'checked' }]" />
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
import { mapState } from 'vuex'

// 表单字段
const fields = ['id', 'type', 'name', 'inNetAssets', 'orderNo']

export default {
  props: {
    title: {
      type: String,
      required: true
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
  computed: {
    ...mapState({
      accountType: state => state.dict.accountType
    })
  },
  async created () {
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
