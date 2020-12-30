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
        <a-form-item label="上级菜单">
          <a-tree-select
            v-decorator="['parentId']"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="请选择父级菜单"
          />
        </a-form-item>
        <a-form-item label="菜单类型">
          <a-radio-group v-decorator="['menuType']" :options="options" @change="changeMenuType"/>
        </a-form-item>
        <a-form-item label="菜单标题">
          <a-input v-decorator="['menuTitle', {rules: [{required: true, min: 4, message: '请输入至少四个字符的标题！'}]}]" />
        </a-form-item>
        <a-form-item label="菜单名称">
          <a-input v-decorator="['menuName', {rules: [{required: true, min: 4, message: '请输入至少四个字符的名称！'}]}]" />
        </a-form-item>
        <a-form-item v-if="menuType !== 'F'" label="路径">
          <a-input v-decorator="['path', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item v-if="menuType === 'F'" label="权限标识">
          <a-input v-decorator="['permissionSign']" />
        </a-form-item>
        <a-form-item v-if="menuType === 'M'" label="组件地址">
          <a-input v-decorator="['component', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item v-if="menuType !== 'F'" label="图标">
          <a-input v-decorator="['iconName']" />
        </a-form-item>
        <a-form-item v-if="menuType === 'M'" label="是否为外链">
          <a-switch v-decorator="['isOuterChain', {rules: [{required: true, message: '请输入选择'}],initialValue: false,valuePropName: 'checked'}]" @change="onChangeSwitch" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number :min="1" v-decorator="['orderNo', {initialValue: 1}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { TreeSelect } from 'ant-design-vue'

// 表单字段
const fields = ['parentId', 'menuType', 'menuTitle', 'menuName', 'path', 'permissionSign', 'component', 'iconName', 'isOuterChain', 'orderNo']

const options = [
  { label: '目录', value: 'C' },
  { label: '菜单', value: 'M' },
  { label: '按钮', value: 'F' }
]

export default {
  components: {
    ATreeSelect: TreeSelect
  },
  props: {
    title: {
      type: String,
      default: () => ''
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
    },
    treeData: {
      type: Array,
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
      form: this.$form.createForm(this),
      options,
      menuType: ''
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.menuType = this.model.menuType
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    changeMenuType (e) {
      this.menuType = e.target.value
      this.form.setFieldsValue({ menuType: e.target.value })
    },
    onChangeSwitch (checked) {
      this.form.setFieldsValue({ isOuterChain: checked })
      console.log(this.form.getFieldsValue())
    }
  },
  computed: {

  }
}
</script>
