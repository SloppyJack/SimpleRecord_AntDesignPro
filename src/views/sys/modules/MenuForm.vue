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
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="上级菜单">
          <a-tree-select
            v-decorator="['parentId']"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :allowClear="true"
            placeholder="请选择父级菜单"
          />
        </a-form-item>
        <a-form-item label="菜单类型">
          <a-radio-group v-decorator="['menuType']" :options="options"/>
        </a-form-item>
        <a-form-item label="菜单标题">
          <a-input v-decorator="['menuTitle', {rules: [{required: true, min: 2, message: '请输入至少两个字符的标题！'}]}]" />
        </a-form-item>
        <a-form-item label="菜单名称">
          <a-input v-decorator="['menuName', {rules: [{required: true, min: 4, message: '请输入至少四个字符的名称！'}]}]" />
        </a-form-item>
        <a-form-item v-show="menuTypeRule() !== 'F'" label="路径">
          <a-input v-decorator="menuTypeRule() !== 'F' ? ['path', {rules: [{required: true}]}] : ['path']" />
        </a-form-item>
        <a-form-item v-show="menuTypeRule() === 'F'" label="权限标识">
          <a-input v-decorator="['permissionSign']" />
        </a-form-item>
        <a-form-item v-show="menuTypeRule() === 'C'" label="组件地址">
          <a-input v-decorator="menuTypeRule() === 'C' ? ['component', {rules: [{required: true}]}] : ['component']" />
        </a-form-item>
        <a-form-item v-show="menuTypeRule() !== 'F'" label="图标">
          <a-input ref="menuIconInput" v-decorator="['iconName']" @click="() => {this.showIconSelect=true}" :allowClear="true">
            <a-icon v-if="this.model && this.model.iconName" slot="prefix" :type="(this.model && this.model.iconName)||''" />
          </a-input>
          <a-modal
            title="图标选择"
            :visible="showIconSelect"
            @cancel="() => {this.showIconSelect=false}"
            :footer="null"
          >
            <icon-selector @change="handleIconChange"/>
          </a-modal>
        </a-form-item>
        <a-form-item v-show="menuTypeRule() === 'C'" label="是否为外链">
          <a-switch v-decorator="menuTypeRule() !== 'F' ? ['isOuterChain', {rules: [{required: true, message: '请输入选择'}],initialValue: false,valuePropName: 'checked'}]:['isOuterChain', {initialValue: false,valuePropName: 'checked'}]"/>
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
import IconSelector from '@/components/IconSelector/IconSelector'
import { TreeSelect } from 'ant-design-vue'
import { rmNullItem } from '@/utils/objUtil'

// 表单字段
const fields = ['id', 'parentId', 'menuType', 'menuTitle', 'menuName', 'path', 'permissionSign', 'component', 'iconName', 'isOuterChain', 'orderNo']

const options = [
  { label: '目录', value: 'M' },
  { label: '菜单', value: 'C' },
  { label: '按钮', value: 'F' }
]

export default {
  components: {
    ATreeSelect: TreeSelect,
    IconSelector
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
      showIconSelect: false,
      readonly: true
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      const obj = pick(this.model, fields)
      // 去除对象中的空值，防止报错
      rmNullItem(obj)
      this.model && this.form.setFieldsValue(obj)
    })
  },
  methods: {
    menuTypeRule () {
      return this.form.getFieldValue('menuType')
    },
    handleIconChange (icon) {
      this.model.iconName = icon
      this.form.setFieldsValue({ 'iconName': this.model.iconName })
      this.showIconSelect = false
    }
  },
  filters: {
  }
}
</script>
