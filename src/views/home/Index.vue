<template>
  <page-header-wrapper :breadcrumb="false">
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatarUrl"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ currentUser.username }}
          </div>
          <div>让记账简简单单！</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <a-skeleton active :loading="loading">
        <div class="extra-content">
          <div class="stat-item">
            <a-statistic title="月份" :value="currentMonth" />
          </div>
          <div class="stat-item">
            <a-statistic title="支出" :value="currentSpendTotal"/>
          </div>
          <div class="stat-item">
            <a-statistic title="收入" :value="currentIncomeTotal" />
          </div>
        </div>
      </a-skeleton>
    </template>

    <div>
      <a-skeleton active :loading="loading">
        <a-row :gutter="24">
          <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card
              style="margin-bottom: 24px;"
              :bordered="false"
              title="本月消费前三">
              <a slot="extra" @click="toMonthBookList">全部</a>
              <a-list item-layout="vertical" :data-source="spendCategories">
                <a-list-item slot="renderItem" slot-scope="item">
                  <a-list-item-meta
                    :description="'金额：' + item.total"
                  >
                    <div slot="title">{{ item.spendCategoryName }}</div>
                  </a-list-item-meta>
                  <a-progress :percent="item.total/spendCategoryTotal | toPercent" />
                </a-list-item>
              </a-list>
            </a-card>
          </a-col>
          <a-col
            style="padding: 0 12px"
            :xl="8"
            :lg="24"
            :md="24"
            :sm="24"
            :xs="24">
            <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
              <div class="item-group">
                <a @click="toRecordAdd">记账</a>
                <a @click="toRecordAnalysis">图标分析</a>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-skeleton>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import moment from 'moment'
import { getSpendTotalInMonth, getTopThreeSpendCategoryTotal } from '@/api/home/homeManage'

export default {
  components: {
    PageHeaderWrapper
  },
  data () {
    return {
      timeFix: timeFix(),
      projects: [],
      loading: false,
      currentMonth: null,
      currentSpendTotal: 0.0,
      currentIncomeTotal: 0.0,
      spendCategories: [],
      spendCategoryTotal: null
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters.userInfo
    }
  },
  async mounted () {
    this.loading = true
    // 当前月份
    this.currentMonth = moment(new Date()).format('YYYY-MM')
    await this.getSpendTotalInMonth(this.currentMonth)
    await this.getTopThreeSpendCategoryTotal(this.currentMonth)
    this.loading = false
  },
  filters: {
    toPercent: function (val) {
      return Number((val * 100).toFixed(2))
    }
  },
  methods: {
    async getSpendTotalInMonth (date) {
      await getSpendTotalInMonth(date).then(res => {
        this.currentSpendTotal = res[0]
        this.currentIncomeTotal = res[1]
      })
    },
    async getTopThreeSpendCategoryTotal (date) {
      await getTopThreeSpendCategoryTotal(date).then(res => {
        res.forEach(item => {
          this.spendCategoryTotal += item.total
        })
        this.spendCategories = res
      })
    },
    toMonthBookList () {
      // 跳转到月账本
      this.$router.push({ name: 'monthBookList' })
    },
    toRecordAdd () {
      // 跳转到记账
      this.$router.push({ name: 'recordAdd' })
    },
    toRecordAnalysis () {
      // 跳转
      this.$router.push({ name: 'charAnalysis' })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./Index.less";

  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
