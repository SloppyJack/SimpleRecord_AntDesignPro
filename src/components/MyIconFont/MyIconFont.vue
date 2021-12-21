<template>
  <icon-font :type="iconMap[value]" class="icon-size" />
</template>

<script>
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2064096_19igr1p9zbo.js'
})

const iconMap = {
  cash: 'custom-icon-xianjin',
  bankCard: 'custom-icon--yinhangqia',
  networkAccount: 'custom-icon-weixinzhifubao',
  financialAccount: 'custom-icon-jijinlicai',
  payment: 'custom-icon-yingshouyingfulei',
  'recordBook': 'custom-icon-zhangdan-'
}

export default {
  name: 'MyIconFont',
  components: {
    IconFont
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      iconMap
    }
  }
}
</script>

<style>

.icon-size {
  font-size: 48px;
}

</style>
