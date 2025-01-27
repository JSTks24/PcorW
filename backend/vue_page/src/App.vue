<script setup lang="ts">
import { ref, onMounted } from 'vue' 
import axios from 'axios'
import Tab from './components/table.vue'

const time = ref('') 
const data = ref<any>([])

const formatTime = (date: any) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} `
    + `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}` 
} 

const fetchData = async () => {
  const res = await axios.get('https://blog.hmountainln.cn/api/all-json') 
  data.value = res.data 
  time.value = formatTime(new Date())
}

onMounted(() => {
  fetchData()
  setInterval(fetchData, 30000) 
}) 
</script>

<template>
  <div class="app">
    <a-flex vertical align="center" justify="center">
      <img src="./assets/neu.png" alt="?">
      <p>当前页面载入时间：{{ time }}</p>
      <p>你可以通过手动刷新或者是每隔30s的自动刷新，来看到下面内容的变化</p>
    </a-flex>
    <div class="show">
    <a-flex vertical>

      <a-collapse :bordered="false">
      <a-collapse-panel v-for="item of data" :key="item.username">
        <template #header>
          来自用户：  <b>{{ item.username }}</b>  上传的表格
        </template>
        <Tab v-model="item.json_data"></Tab>
      </a-collapse-panel>
      </a-collapse>

    </a-flex>
    </div>
  </div>
</template>

<style scoped>
.app {
  height: 90vh;
}

img {
  width: 50px;
  height: 50px;
}

.show {
  overflow-y: auto;
  height: 80%;
  width: 90%;
  justify-self: center;
}
</style>