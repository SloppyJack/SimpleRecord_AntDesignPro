<template>
  <a-modal
    title="编辑角色"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok', finalCheckedKeys) }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少两个字符的规则描述！'}]}]" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['info', {rules: [{required: true, min: 4, message: '请输入至少四个字符的规则描述！'}]}]" />
        </a-form-item>
        <a-form-item label="角色权限">
          <a-tree
            checkable
            v-model="checkedKeys"
            :tree-data="treeData"
            @check="onCheck"
          >
            <span slot="title0010" style="color: #1890ff">sss</span>
          </a-tree>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

import { Tree } from 'ant-design-vue'
import { getOwnedMenus } from '@/api/manage'

// 表单字段
const fields = ['id', 'name', 'info']

export default {
  components: {
    ATree: Tree
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
      form: this.$form.createForm(this),
      checkedKeys: [],
      finalCheckedKeys: [], // 需要的checkedKeys
      treeData: []
    }
  },
  methods: {
    onCheck (checkedKeys, info) {
      this.checkedKeys = checkedKeys
      this.finalCheckedKeys = [...checkedKeys, ...info.halfCheckedKeys]
    },
    handleTree (tree) {
      const children = []
      tree.forEach(item => {
        // 如果为按钮，则终止此次循环
        if (item.menuType !== 'F') {
          const parent = {
            //  标题
            title: item.menuTitle,
            key: item.id
          }
          if (item.owned) {
            this.checkedKeys.push(item.id)
          }
          // 是否有子菜单，并递归处理
          if (item.children && item.children.length > 0) {
            // Recursion
            const t = this.handleTree(item.children, parent)
            // 如果没有孩子，则不赋值
            if (t.length > 0) parent.children = t
          }
          children.push(parent)
        }
      })
      return children
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      this.checkedKeys = []
      this.finalCheckedKeys = []
      this.treeData = []
      // 获取当前角色所拥有的菜单权限
      getOwnedMenus(this.model.id).then(res => {
        this.treeData = this.handleTree(res)
        console.log('checked', this.checkedKeys)
      })
    })
  }
}
</script>
