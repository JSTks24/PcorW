<script setup lang="ts">
import { useUser } from '../Store/useUser.ts'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const { name, isLogin, key } = storeToRefs(useUser())
const router = useRouter()

const to_login = () => router.push('./login')

function logout() {
  name.value = ''
  isLogin.value = false
  key.value = ''
}
</script>

<template>
  <div v-if="isLogin === false">
    <a-button type="link" @click="to_login">登录</a-button>
  </div>
  <div v-else>
    <span>已登录：{{name}}</span>
    <a-button type="link" @click="logout" danger>退出登录</a-button>
  </div>
</template>

<style scoped>
span {
  font-size: small;
}
</style>