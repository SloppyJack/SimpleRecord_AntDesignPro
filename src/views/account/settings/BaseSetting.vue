<template>
  <a-spin :spinning="loading">
    <div class="account-settings-info-view">
      <a-row :gutter="16">
        <a-col :md="24" :lg="16">
          <a-spin :spinning="loading">
            <a-form :form="form" layout="vertical">
              <a-form-item label="昵称">
                <a-input v-decorator="['nickname', {rules: [{required: true, min: 2, message: '请输入正确昵称！'}]}]" placeholder="给自己起个名字" />
              </a-form-item>
              <a-form-item label="性别">
                <a-radio-group v-decorator="['sex', {rules: [{type: 'enum', enum: [`1`, `2`], message: '请选择性别！'}]}]" :options="sexOptions"/>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="submit">保存</a-button>
              </a-form-item>
            </a-form>
          </a-spin>
        </a-col>
        <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
          <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
            <a-icon type="cloud-upload-o" class="upload-icon"/>
            <div class="mask">
              <a-icon type="plus" />
            </div>
            <img :src="model.avatarUrl"/>
          </div>
        </a-col>
      </a-row>
      <avatar-modal ref="modal" @ok="setAvatar"/>

    </div>
  </a-spin>
</template>

<script>
import AvatarModal from './AvatarModal'
import pick from 'lodash.pick'
import { baseSetting } from '@/api/core/acountManage'

// 表单字段
const fields = ['nickname', 'sex']

const sexOptions = [
  { label: '男', value: `1` },
  { label: '女', value: `2` }
]

export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      fields,
      sexOptions,
      loading: false,
      model: {
        nickname: '',
        sex: '',
        avatarUrl: ''
      },
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    const currentUser = this.$store.getters.userInfo
    this.model = {
      nickname: currentUser.nickname,
      sex: currentUser.sex.toString(),
      avatarUrl: currentUser.avatarUrl
    }
  },
  methods: {
    setAvatar (url) {
      // this.option.img = url
    },
    submit () {
      this.form.validateFields((errors, values) => {
        if (!errors) {
            baseSetting({
              sex: values.sex,
              nickname: values.nickname
            }).then(res => {
                this.loading = false
                this.$message.info('保存成功')
              }
            ).catch(() => {
              this.loading = false
            })
        } else {
          this.loading = false
        }
      })
    }
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

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
