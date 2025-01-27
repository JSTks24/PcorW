<script setup lang="ts">
import { reactive, computed, ref, h } from 'vue'
import { UserOutlined, LockOutlined, RollbackOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUser } from '../Store/useUser.ts'
import { storeToRefs } from 'pinia'
const { isLogin, name ,key } = storeToRefs(useUser())

const router = useRouter()
const formState = reactive({
  userid: '',
  password: '',
})
const log_loading = ref(false)
const onFinish = async () => {
  try {
    const res = await axios.post('https://blog.hmountainln.cn/api/auth', {
      username: formState.userid,
      password: formState.password
    })
    key.value = res.data.token
    name.value = formState.userid
    isLogin.value = true
    message.success(res.data.message)
    await ret ()
  } catch (err: any) {
    message.error(err.response.data)
  }
}

const onFinishFailed = () => {
  message.error('填写信息有误')
}
const disabled = computed(() => {
  return !(formState.password && formState.userid)
})

const ret = () => router.push('/')
</script>

<template>
  <div class="container">
    <a-button type="primary" shape="circle" :icon="h(RollbackOutlined)" class="ret" @click="ret"></a-button>
  <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
  >
    <a-form-item
        label="学号"
        name="userid"
        :rules="[{ required: true, message: '请输入你的8位学号!', pattern: /[0-9]{8}/ }]"
    >
      <a-input v-model:value="formState.userid">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '密码5-20位仅字母数字及下划线', pattern: /^[a-zA-Z0-9_]{5,20}$/ }]"
    >
      <a-input-password v-model:value="formState.password">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button" :loading="log_loading">
        登录
      </a-button>
      注：首次使用学号登录视为注册
    </a-form-item>
  </a-form>
  </div>
</template>

<style scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("../assets/login.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
}

.ret {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>