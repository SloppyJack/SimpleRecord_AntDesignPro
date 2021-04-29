<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="小程序登录">
          <a-row type="flex" justify="center">
            <a-col class="avator-wrap">
              <div class="mask" v-show="qrcodeMaskShow" v-html="qrcodeMaskTips" @click="refreshQrcode"></div>
              <a-avatar :size="200" shape="square" :src="auth.minAppQrcode" :class="{'bgc-opacity': qrcodeMaskShow}" />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="账号密码登录">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误（admin/ant.design )" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账户：root"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              placeholder="密码：Abcd1234"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>

      <div class="user-login-other">
        <span>其他登录方式</span>
        <a-tooltip>
          <template slot="title">
            微信扫一扫授权登录
          </template>
          <a-icon class="item-icon" type="wechat"/>
        </a-tooltip>
      </div>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getUUID, getMinAppQrcode, getQrcodeInfo } from '@/api/login'

export default {
  data () {
    return {
      customActiveKey: 'tab1',
      isLoginError: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false
      },
      // 第三方授权相关
      auth: {
        uuid: null,
        minAppQrcode: null
      },
      timer: null,
      qrcodeMaskShow: false,
      qrcodeMaskTips: '',
      qrcodeInfo: {}
    }
  },
  async created () {
    await this.getMiniAppQrcode()
    await this.getQrcodeInfo()
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'Auth']),
    handleTabClick (key) {
      this.customActiveKey = key
      if (key !== 'tab1') {
        clearInterval(this.timer)
      } else {
        this.getQrcodeInfo()
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = {
              username: values.username,
              password: values.password
          }
          Login(loginParams)
            .then((res) => this.loginSuccess())
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess () {
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    async getMiniAppQrcode () {
      // step1：get uuid
      await getUUID().then((res) => {
        this.auth.uuid = res
      })
      // step2：get min app qrcode
      await getMinAppQrcode({ uuid: this.auth.uuid }).then(response => {
        // parse bytes to base64
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }).then(data => {
        this.auth.minAppQrcode = data
      })
    },
    async getQrcodeInfo () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
          getQrcodeInfo({ uuid: this.auth.uuid }).then(res => {
            this.qrcodeInfo = res
            if (!res.isExpired && res.isScanned) {
              this.qrcodeMaskTips = '已扫描<br>请确认'
              this.qrcodeMaskShow = true
            }
            if (res.isExpired) {
              this.qrcodeMaskTips = '二维码失效<br>请点击刷新'
              this.qrcodeMaskShow = true
              clearInterval(this.timer)
            }
            if (res.token) {
              // 跳转登录
              clearInterval(this.timer)
              this.Auth(res.token)
              this.loginSuccess()
            }
          })
      }, 800)
    },
    async refreshQrcode () {
      if (this.qrcodeInfo.isExpired) {
        clearInterval(this.timer)
        await this.getMiniAppQrcode()
        this.qrcodeMaskShow = false
        await this.getQrcodeInfo()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {

  .avator-wrap {
    position: relative;

    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    }
  }

  .bgc-opacity {
    opacity: 0.2;
  }

  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
