<template>
  <a-card :bordered="false">
    <a-result title="树洞即将上线!">
      <template #icon>
        <a-icon type="heart" theme="twoTone" two-tone-color="#FC9D9A" />
      </template>
      <template #extra>
        <a-button @click="showMsg" type="primary">
          已知晓
        </a-button>
      </template>
    </a-result>
  </a-card>
</template>

<script>

export default {
  name: 'Robot',
  data () {
    return {
      title: '提交失败',
      description: '请核对并修改以下信息后，再重新提交。'
    }
  },
  methods: {
    showMsg () {
      this.$message.info('功能正在开发中，请耐心等待~')
    }
  }
}
</script>
