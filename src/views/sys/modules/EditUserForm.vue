<template>
  <a-modal
    title="编辑角色"
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
        <a-form-item label="昵称">
          <a-input v-decorator="['nickname', {rules: [{required: true, message: '请输入昵称！'}]}]" />
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-decorator="['sex', {rules: [{type: 'enum', enum: [`1`, `2`], message: '请选择性别！'}]}]" :options="sexOptions"/>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            v-decorator="
              ['email', {rules: [
                {type: 'email',message: '请输入正确的email!',},
                {required: true,message: '请输入Email!',}
              ]}]" />
        </a-form-item>
        <a-form-item v-if="model != null" label="角色权限">
          <a-select mode="tags" style="width: 100%" v-decorator="['ownedRoleIds']" placeholder="请选择角色">
            <a-select-option v-for="item in model.allRoles" :key="item.id.toString()" :value="item.id.toString()">
              {{ item.info }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

import { Tree } from 'ant-design-vue'

// 表单字段
const fields = ['id', 'nickname', 'sex', 'email', 'ownedRoleIds']

const sexOptions = [
  { label: '男', value: `1` },
  { label: '女', value: `2` }
]

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
      sexOptions
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
