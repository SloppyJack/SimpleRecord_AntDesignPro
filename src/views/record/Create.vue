<template>
  <div>
    <a-card
      style="width:100%"
      title="记一笔"
      :tab-list="tabList"
      :active-tab-key="titleKey"
      @tabChange="key => onTabChange(key)"
    >
      <p v-if="titleKey === 'expend'">
        expend content
      </p>
      <p v-else-if="titleKey === 'income'">
        income content
      </p>
      <a-spin :spinning="loading">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
          <a-form-item label="金额">
            <a-input-number
              style="width: 100%"
              :min="0"
              v-decorator="['amount', { rules: [{ required: true, message: '金额不能为空' }] }]"
            />
          </a-form-item>
          <a-form-item label="类别">
            <a-select
              v-decorator="['spendCategoryId',{ rules: [{ required: true, message: '类别不能为空' }] },]"
              placeholder="请选择类别"
              @change="handleSelectChange"
            >
              <a-select-option v-for="i in selectOptions" :key="(i.id)">
                {{ i.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="日期">
            <a-date-picker
              style="width: 100%"
              format="YYYY-MM-DD"
              v-decorator="['occurTime', { rules: [{ required: true, message: '请选择日期' }] }]"
              @change="onDateChange"
            />
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea
              v-decorator="['remarks']"
              placeholder="备注可选填"
              auto-size
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit">
              保存
            </a-button>
          </a-form-item>
        </a-form>
      </a-spin>
      <a-button slot="tabBarExtraContent" type="primary" icon="right" @click="toMonthList">月账单</a-button>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getRecordTypes, createRecord } from '@/api/record/recordManage'
import { getSpendCategory } from '@/api/record/spendCategoryManage'

export default {
  data () {
    return {
      loading: false,
      tabList: [],
      titleKey: 'expendType',
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      selectOptions: []
    }
  },
  async mounted () {
    this.loading = true
    await this.getRecordTypes()
    // 从tabList中取出Id
    const recordTypeId = this.getRecordTypeId(this.tabList)
    await this.getSpendCategory(recordTypeId)
    this.loading = false
  },
  methods: {
    async onTabChange (key) {
      this.loading = true
      this.form.resetFields()
      this.titleKey = key
      // 从tabList中取出Id
      const recordTypeId = this.getRecordTypeId(this.tabList)
      await this.getSpendCategory(recordTypeId)
      this.loading = false
    },
    handleSubmit (e) {
      // 取消submit事件的默认动作
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const data = {
            spendCategoryId: values.spendCategoryId,
            amount: values.amount,
            occurTime: moment(values.occurTime).format('YYYY-MM-DD'),
            remarks: values.remarks
          }
          createRecord(data).then(res => {
            this.$message.success('记账成功')
            this.form.resetFields()
            this.loading = false
          })
        }
      })
    },
    handleSelectChange (value) {
      // do nothing
    },
    async getRecordTypes () {
      // 加载记账类别
      await getRecordTypes().then(res => {
        this.tabList = []
        res.forEach((item, index) => {
          const temp = {
            key: item.code,
            tab: item.name,
            id: item.id
          }
          this.tabList.push(temp)
        })
      }).catch(() => {
        this.$message.error('加载类别失败，请重试')
      })
    },
    // 此方法同步
    async getSpendCategory (id) {
      await getSpendCategory(id).then(res => {
        this.selectOptions = []
        res.forEach((item, index) => {
          const temp = {
            id: item.id,
            name: item.name
          }
          this.selectOptions.push(temp)
        })
      })
    },
    getRecordTypeId (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].key === this.titleKey) {
          return arr[i].id
        }
      }
    },
    onDateChange (date, str) {
      // do nothing
    },
    toMonthList () {
      // 跳转到月账单
      this.$router.push({ name: 'monthRecordList' })
    }
  }
}
</script>
