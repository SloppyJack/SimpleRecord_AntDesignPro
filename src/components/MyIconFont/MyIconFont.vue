<template>
  <icon-font :type="iconMap[value]" class="icon-size" />
</template>

<script>
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2064096_x282tdkdwfe.js'
})

const iconMap = {
  cash: 'custom-icon-_xianjin',
  bankCard: 'custom-icon--yinhangqia',
  networkAccount: 'custom-icon-weixinzhifubao',
  financialAccount: 'custom-icon-jijinlicai',
  payment: 'custom-icon-yingshouyingfulei'
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
