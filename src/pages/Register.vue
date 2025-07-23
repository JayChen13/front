<template>
  <div class="auth-container">
    <h2>注册</h2>
    <form @submit.prevent="onRegister">
      <div class="form-group">
        <label>用户名*</label>
        <input v-model="username" type="text" required autocomplete="username" />
      </div>
      <div class="form-group">
        <label>密码*</label>
        <input v-model="password" type="password" required autocomplete="new-password" />
      </div>
      <div class="form-group">
        <label>确认密码*</label>
        <input v-model="confirmPassword" type="password" required autocomplete="new-password" />
      </div>
      <div class="form-group">
        <label>头像</label>
        <input type="file" accept="image/*" @change="onAvatarChange" />
        <img v-if="avatar" :src="avatar" alt="头像预览" class="avatar-preview" />
      </div>
      <button class="btn register-btn" type="submit">注册</button>
      <div class="auth-link">已有账号？<router-link to="/login">登录</router-link></div>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="success" class="success-msg">注册成功，正在跳转...</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const avatar = ref('')
const error = ref('')
const success = ref(false)
const router = useRouter()

function onAvatarChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    avatar.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function onRegister() {
  if (!username.value || !password.value || !confirmPassword.value) {
    error.value = '请填写所有字段'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = '两次密码不一致'
    return
  }
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.find(u => u.username === username.value)) {
    error.value = '用户名已存在'
    return
  }
  users.push({ username: username.value, password: password.value, avatar: avatar.value })
  localStorage.setItem('users', JSON.stringify(users))
  error.value = ''
  success.value = true
  setTimeout(() => router.push('/login'), 1200)
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
input[type="file"] {
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
  background: #fff;
}
input[type="file"]:focus {
  border: 1.5px solid #1db954;
}
.avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 0.5em;
  box-shadow: 0 2px 8px rgba(30,185,84,0.10);
}
.btn.register-btn {
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
.btn.register-btn:hover {
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
.success-msg {
  color: #1db954;
  margin-top: 1em;
}
</style> 