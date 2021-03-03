<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://github.com/SloppyJack/SimpleRecord_AntDesignPro" target="_blank">Github</a>
    </template>
    <template v-slot:copyright>
      <a href="http://jackbin.cn" target="_blank">简账@2019~2021</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
