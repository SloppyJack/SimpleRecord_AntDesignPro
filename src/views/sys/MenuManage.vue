<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单标题">
                <a-input v-model="queryParam.title" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="创建日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入创建日期"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="outerChain" slot-scope="text">
          <a-tag :color="text ? 'green' : 'orange'">{{ text ? '是' : '否' }}</a-tag>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getMenus } from '@/api/manage'
import { Ellipsis, STable } from '@/components'

const columns = [
  {
    title: '标题',
    dataIndex: 'menuTitle'
  },
  {
    title: '名称',
    dataIndex: 'menuName'
  },
  {
    title: '类型',
    dataIndex: 'menuType'
  },
  {
    title: '是否外链',
    dataIndex: 'outerChain',
    scopedSlots: { customRender: 'outerChain' }
  },
  {
    title: '路径',
    dataIndex: 'path'
  },
  {
    title: '组件',
    dataIndex: 'component'
  },
  {
    title: '图标',
    dataIndex: 'iconName'
  },
  {
    title: '排序',
    dataIndex: 'orderNo'
  }
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}

export default {
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 高级搜索 展开/关闭
      advanced: false,
      loadData: parameter => {
        let deleted = null
        if (this.queryParam.status === '1') {
          deleted = false
        } else if (this.queryParam.status === '2') {
          deleted = true
        }
        const params = {
          'title': this.queryParam.title,
          'deleted': deleted,
          'date': this.queryParam.date,
          'pageNo': parameter.pageNo,
          'pageSize': parameter.pageSize
        }
        return getMenus(params).then((res) => {
          // 封装返回的数据，供s-table使用
          return {
            'pageNo': parameter.pageNo,
            'totalCount': res.total,
            'data': res.list
          }
        })
      },
      columns,
      rowSelection
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
