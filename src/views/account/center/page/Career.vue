<template>
  <div>
    <a-timeline pending="美好正在发生..." :reverse="reverse">
      <a-timeline-item>[简帐]小程序注册 2020-05-20</a-timeline-item>
      <a-timeline-item>[简帐]第一行代码提交 2020-07-03</a-timeline-item>
      <a-timeline-item>[简帐]小程序上线 2020-08-15</a-timeline-item>
      <a-timeline-item>[简帐]PC端上线 2021-04</a-timeline-item>
    </a-timeline>
    <a-button type="primary" style="margin-top: 16px" @click="handleClick">
      反转时间
    </a-button>
  </div>
</template>

<script>
import { Timeline } from 'ant-design-vue'

export default {
  name: 'Career',
  components: {
    ATimeline: Timeline,
    ATimelineItem: Timeline.Item
  },
  data () {
    return {
      reverse: false
    }
  },
  mounted () {
  },
  methods: {
    handleClick () {
      this.reverse = !this.reverse
      this.$message.warn('我是时间轴啦~')
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-pro-pages-account-projects-cardList {
    margin-top: 24px;

    /deep/ .ant-card-meta-title {
      margin-bottom: 4px;
    }

    /deep/ .ant-card-meta-description {
      height: 44px;
      overflow: hidden;
      line-height: 22px;
    }

    .cardItemContent {
      display: flex;
      height: 20px;
      margin-top: 16px;
      margin-bottom: -4px;
      line-height: 20px;

      > span {
        flex: 1 1;
        color: rgba(0,0,0,.45);
        font-size: 12px;
      }

      /deep/ .ant-pro-avatar-list {
        flex: 0 1 auto;
      }
    }
  }
</style>
