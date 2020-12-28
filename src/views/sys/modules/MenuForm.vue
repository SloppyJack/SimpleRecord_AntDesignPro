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
            v-model="parentId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="请选择父级菜单"
          />
        </a-form-item>
        <a-form-item label="菜单类型">
          <a-radio-group v-model="menuType" @change="changeMenuType">
            <a-radio value="C">
              目录
            </a-radio>
            <a-radio value="M">
              菜单
            </a-radio>
            <a-radio value="F">
              按钮
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { TreeSelect } from 'ant-design-vue'

// 表单字段
const fields = ['name', 'info']

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
    },
    parentId: {
      type: Number,
      default: () => null
    },
    menuType: {
      type: String,
      default: () => ''
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
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    changeMenuType (val) {
      console.log(val)
      console.log(this.menuType)
    }
  }
}
</script>
