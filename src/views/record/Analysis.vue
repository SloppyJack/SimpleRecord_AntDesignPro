<template>
  <div>
    <a-card :loading="barLoading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs v-model="barQueryParam.tabKey" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a-radio-group v-model="barQueryParam.recordType">
                <a-radio-button v-for="i in options" :key="i.value" :value="i.value"> {{ i.label }} </a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <a-tab-pane tab="近六个月" key="sixMonth">
            <a-row>
              <a-col>
                <bar :data="sixMonthBarData" title="支出" />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="周数据" key="week">
            <a-row>
              <a-col>
                <a-empty description="功能即将上线"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :style="{ marginTop: '24px' }">
        <a-col>
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="pieLoading" :bordered="false" title="年收支分析" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit;">
              <div class="analysis-salesTypeRadio">
                <a-radio-group v-model="pieRecordType">
                  <a-radio-button v-for="i in options" :key="i.value" :value="i.value"> {{ i.label }} </a-radio-button>
                </a-radio-group>
              </div>

            </div>
            <h4>本年度</h4>
            <div>
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <!-- position="right" :offsetX="-140" -->
                  <v-legend dataKey="item"/>
                  <v-pie position="percent" color="item" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  Bar
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import { Empty } from 'ant-design-vue'
import { getSpendCategoryTotalInYear, getLatestSixMonthList } from '@/api/record/analysis'

const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

const options = [
  { label: '支出', value: 'expendType' },
  { label: '收入', value: 'incomeType' }
]

const DataSet = require('@antv/data-set')

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    Bar,
    AEmpty: Empty
  },
  data () {
    return {
      // 树状图相关
      barLoading: false,
      sixMonthBarData: [],
      barQueryParam: {
        tabKey: 'sixMonth',
        recordType: 'expendType'
      },
      options,
      // 饼状图相关
      pieScale,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      pieRecordType: 'expendType',
      pieLoading: false,
      pieData: []
    }
  },
  async mounted () {
    await this.getBarData()
    await this.getPieData()
  },
  methods: {
    // 获取年份记账类别总计
    async getSpendCategoryTotal () {
      await getSpendCategoryTotalInYear(moment(new Date()).format('YYYY'), this.pieRecordType).then(res => {
        const sourceData = []
        res.forEach((item, index) => {
          sourceData.push({
            item: item.spendCategoryName,
            count: item.total
          })
        })
        // FIXME 饼图显示为百分比+数值
        const dv = new DataSet.View().source(sourceData)
        dv.transform({
          type: 'percent',
          field: 'count',
          dimension: 'item',
          as: 'percent'
        })
        this.pieData = dv.rows
      })
    },
    async getLatestSixMonth (recordType) {
      const data = {
        beginDate: moment(new Date()).subtract(6, 'months').format('YYYY-MM'),
        recordTypeCode: recordType
      }
      await getLatestSixMonthList(data).then(res => {
        this.sixMonthBarData = []
        res.forEach((item, index) => {
            this.sixMonthBarData.push({
              x: item.occurMonth,
              y: item.total
            })
        })
      })
    },
    async getBarData () {
      this.barLoading = true
      const type = this.barQueryParam.tabKey
      switch (type) {
        // 六个月数据
        case 'sixMonth':
          await this.getLatestSixMonth(this.barQueryParam.recordType)
          break
        // 周数据
        case 'week':
          // TODO 周数据功能需要完成
          break
      }
      this.barLoading = false
    },
    async getPieData () {
      // 获取饼状图数据
      this.pieLoading = true
      await this.getSpendCategoryTotal()
      this.pieLoading = false
    },
    handleTabChange (activeKey) {
      this.getLatestSixMonth(activeKey)
    }
  },
  watch: {
    // 监听barQueryParam
    barQueryParam: {
      handler: function () {
        this.getBarData()
      },
      deep: true
    },
    pieRecordType: {
      handler: function () {
        this.getPieData()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
