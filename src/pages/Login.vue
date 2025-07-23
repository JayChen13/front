<template>
  <div class="auth-container">
    <h2>登录</h2>
    <form @submit.prevent="onLogin">
      <div class="form-group">
        <label>用户名</label>
        <input v-model="username" type="text" required autocomplete="username" />
      </div>
      <div class="form-group">
        <label>密码</label>
        <input v-model="password" type="password" required autocomplete="current-password" />
      </div>
      <div class="form-group" style="margin-bottom:0.7em;">
        <label style="display:flex;align-items:center;font-weight:400;font-size:0.98em;">
          <input type="checkbox" v-model="remember" style="margin-right:0.5em;" />记住密码
        </label>
      </div>
      <button class="btn login-btn" type="submit">登录</button>
      <div class="auth-link">还没有账号？<router-link to="/register">注册</router-link></div>
      <div v-if="error" class="error-msg">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
const remember = ref(false)
const error = ref('')
const router = useRouter()

onMounted(() => {
  const saved = localStorage.getItem('rememberLogin')
  if (saved) {
    const { username: u, password: p } = JSON.parse(saved)
    username.value = u
    password.value = p
    remember.value = true
  }
})

function onLogin() {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.username === username.value && u.password === password.value)
  if (!user) {
    error.value = '用户名或密码错误'
    return
  }
  localStorage.setItem('currentUser', JSON.stringify({ username: user.username, avatar: user.avatar }))
  if (remember.value) {
    localStorage.setItem('rememberLogin', JSON.stringify({ username: username.value, password: password.value }))
  } else {
    localStorage.removeItem('rememberLogin')
  }
  error.value = ''
  window.dispatchEvent(new Event('userchange'))
  router.push('/')
}
</script>

<style scoped>
.auth-container {
  max-width: 350px;
  margin: 3em auto;
  background: #fff;
  border-radius: 1.2em;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2.5em 2em 2em 2em;
  text-align: center;
}
.form-group {
  margin-bottom: 1.3em;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 0.4em;
  color: #333;
  font-weight: 500;
}
input[type="text"], input[type="password"] {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.7em;
  border-radius: 0.5em;
  border: 1.5px solid #bdbdbd;
  font-size: 1em;
  outline: none;
  margin-bottom: 0.2em;
  transition: border 0.2s;
  display: block;
}
input:focus {
  border: 1.5px solid #1db954;
}
.btn.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #1db954, #1ed760);
  color: #fff;
  border: none;
  border-radius: 0.7em;
  padding: 0.7em 0;
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 0.5em;
  cursor: pointer;
  transition: background 0.2s;
}
.btn.login-btn:hover {
  background: linear-gradient(135deg, #159c43, #1db954);
}
.auth-link {
  margin-top: 1.2em;
  font-size: 0.98em;
}
.error-msg {
  color: #d32f2f;
  margin-top: 1em;
}
</style> 