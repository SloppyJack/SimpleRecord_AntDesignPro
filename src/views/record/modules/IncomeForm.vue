<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
    <a-form-item v-show="model && model.id > 0" label="主键ID">
      <a-input v-decorator="['id', {rules: [{required: true}]}]" disabled />
    </a-form-item>
    <a-form-item label="金额">
      <a-input v-decorator="['amount', {rules: [{required: true, message: '请输入金额！'}]}]" />
    </a-form-item>
    <a-form-item label="类别">
      <a-select
        v-if="model && model.id > 0"
        v-decorator="['spendCategoryId', {rules: [{required: true, message: '请选择类别！'}]}]"
      >
        <a-select-opt-group
          v-for="item in spendCategoryList"
          :key="item.recordTypeCode"
        >
          <span slot="label">{{ item.recordTypeName }}</span>
          <a-select-option
            v-for="item1 in item.list"
            :key="item1.id"
            :value="item1.id"
          >
            {{ item1.name }}
          </a-select-option>
        </a-select-opt-group>
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
        v-decorator="['remarks']"
        placeholder="备注可选填"
        auto-size
      />
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { getRecordCategoryList } from '@/api/record/recordCategoryManage'

// 表单字段
const fields = ['id', 'amount', 'spendCategoryId', 'occurTime', 'remarks']

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
      form: this.$form.createForm(this),
      spendCategoryList: {}
    }
  },
  methods: {
  },
  filters: {
  },
  created () {
    // 加载花费类别
    getRecordCategoryList().then(res => {
      this.spendCategoryList = res
    })

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
