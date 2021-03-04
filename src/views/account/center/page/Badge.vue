<template>
  <div class="app-list">
    <a-list
      :grid="{ gutter: 36, column: 3 }"
      :dataSource="dataSource">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card hoverable size="small" >
          <img :src="item.badgeUrl"/>
          <a-card-meta :title="item.title" :description="item.description"/>
        </a-card>
      </a-list-item>
    </a-list>

  </div>
</template>

<script>
const dataSource = []
for (let i = 0; i < 11; i++) {
  dataSource.push({
    title: '魅力大葱',
    badgeUrl: '/badges/badge1.svg',
    description: '【徽章】：功能正在开发中...'
  })
}

export default {
  name: 'Badge',
  components: {},
  data () {
    return {
      dataSource
    }
  }
}
</script>
