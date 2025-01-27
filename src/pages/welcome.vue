<script setup lang="ts">
import myself from '../components/myself.vue'
import myTable from '../components/table.vue'

import { useUser } from '../Store/useUser.ts'
import { storeToRefs } from 'pinia'

const { isLogin } = storeToRefs(useUser())

</script>

<template>
  <a-layout>
    <a-layout-header class="header">
      <span>???人员管理系统</span>
      <div class="log"><myself /></div>
    </a-layout-header>
    <a-layout-content class="content">
      <div class="notice">
        你可以在
        <a href="https://blog.hmountainln.cn" target="_blank">https://blog.hmountainln.cn</a>
        查看所有人创建的角色
      </div>
      <div class="notice" v-if="isLogin === false">
        <a href="#/login">登录</a>
        后可以将你在本地创建的人员信息同步到在线服务器上
      </div>
      <div class="table">
        <myTable />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>

.header {
  text-align: center;
  height: 10vh;
  color: white;
  font-size: large;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log {
  position: absolute;
  right: 10px;
  color: white;
}

.content {
  text-align: center;
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.notice {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table {
  flex: 15;
}
</style>