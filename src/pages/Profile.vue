<template>
  <div class="profile-container">
    <h2 class="profile-title">个人中心</h2>
    <form class="profile-form" @submit.prevent="onSave">
      <div class="form-group">
        <label>用户名</label>
        <input v-model="username" type="text" required />
      </div>
      <div class="form-group">
        <label>新密码</label>
        <input v-model="password" type="password" placeholder="不修改请留空" />
      </div>
      <div class="form-group">
        <label>头像</label>
        <input type="file" accept="image/*" @change="onAvatarChange" />
        <img v-if="avatar" :src="avatar" alt="头像预览" class="avatar-preview" />
      </div>
      <button class="btn save-btn" type="submit">保存修改</button>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
const avatar = ref('')
const msg = ref('')
const router = useRouter()

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
  username.value = user.username || ''
  avatar.value = user.avatar || ''
})

function onAvatarChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    avatar.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function onSave() {
  if (!username.value) {
    msg.value = '用户名不能为空'
    return
  }
  // 更新所有用户信息
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const current = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const idx = users.findIndex(u => u.username === current.username)
  if (idx === -1) {
    msg.value = '用户不存在'
    return
  }
  // 检查用户名是否被其他用户占用
  if (username.value !== current.username && users.find(u => u.username === username.value)) {
    msg.value = '用户名已存在'
    return
  }
  users[idx].username = username.value
  if (password.value) users[idx].password = password.value
  users[idx].avatar = avatar.value
  localStorage.setItem('users', JSON.stringify(users))
  // 更新当前用户
  localStorage.setItem('currentUser', JSON.stringify({ username: username.value, avatar: avatar.value }))
  msg.value = '修改成功！'
  setTimeout(() => {
    window.dispatchEvent(new Event('userchange'))
    router.go(0)
  }, 1000)
}
</script>

<style scoped>
.profile-container {
  max-width: 400px;
  margin: 3em auto;
  background: #fff;
  border-radius: 1.2em;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2.5em 2em 2em 2em;
  text-align: center;
}
.profile-title {
  font-size: 1.7em;
  font-weight: bold;
  margin-bottom: 1.5em;
  color: #1db954;
}
.profile-form .form-group {
  margin-bottom: 1.3em;
  text-align: left;
}
.profile-form label {
  display: block;
  margin-bottom: 0.4em;
  color: #333;
  font-weight: 500;
}
.profile-form input[type="text"], .profile-form input[type="password"] {
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
.profile-form input[type="file"] {
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
.profile-form input:focus {
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
.btn.save-btn {
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
.btn.save-btn:hover {
  background: linear-gradient(135deg, #159c43, #1db954);
}
.msg {
  color: #1db954;
  margin-top: 1em;
  font-size: 1.05em;
}
</style> 