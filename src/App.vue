<template>
  <div class="scale-root">
    <div id="app">
      <header class="navbar">
        <div class="logo">
          <img src="/images/logo.jpg" alt="logo" style="height:32px;width:32px;vertical-align:middle;margin-right:0.5em;border-radius:50%;object-fit:cover;" />
          MyMusic
        </div>
        <ul class="nav-links">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/library">音乐库</router-link></li>
          <li><router-link to="/playlist">歌单</router-link></li>
          <li><router-link to="/profile">个人中心</router-link></li>
          <li><router-link to="/about">关于我们</router-link></li>
        </ul>
        <div class="nav-auth" v-if="!currentUser">
          <router-link to="/login">登录</router-link> / <router-link to="/register">注册</router-link>
        </div>
        <div class="nav-user" v-else @mouseleave="showDropdown=false" style="position:relative;margin-left:2.5em;display:inline-flex;align-items:center;">
          <img :src="currentUser.avatar || '/images/logo.jpg'" alt="头像" class="nav-avatar" @click="showDropdown=!showDropdown" style="width:32px;height:32px;border-radius:50%;object-fit:cover;cursor:pointer;vertical-align:middle;" />
          <span class="nav-username" @click="showDropdown=!showDropdown" style="margin-left:0.5em;cursor:pointer;display:inline-flex;align-items:center;">
            {{ currentUser.username }}
            <svg @click.stop="showDropdown=!showDropdown" style="width:18px;height:18px;margin-left:0.3em;cursor:pointer;transition:transform 0.2s;vertical-align:middle;" :style="showDropdown ? 'transform:rotate(180deg);' : ''" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div v-if="showDropdown" class="nav-dropdown" style="position:absolute;right:0;top:40px;background:#fff;color:#222;border-radius:0.7em;box-shadow:0 4px 16px rgba(0,0,0,0.13);min-width:140px;z-index:1001;">
            <router-link to="/profile" class="nav-dropdown-item" style="display:block;padding:0.8em 1.2em;text-decoration:none;color:#222;">个人中心</router-link>
            <router-link to="/playlist" class="nav-dropdown-item" style="display:block;padding:0.8em 1.2em;text-decoration:none;color:#222;">我的歌单</router-link>
            <div class="nav-dropdown-item" @click="logout" style="display:block;padding:0.8em 1.2em;cursor:pointer;">退出登录</div>
          </div>
        </div>
      </header>
      <main>
        <router-view />
      </main>
      <PlayerBar />
      <footer>
        <p>&copy; 2024 MyMusic 音乐网站</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PlayerBar from './components/PlayerBar.vue'
const currentUser = ref(null)
const showDropdown = ref(false)
function logout() {
  localStorage.removeItem('currentUser')
  window.dispatchEvent(new Event('userchange'))
}
onMounted(() => {
  const user = localStorage.getItem('currentUser')
  if (user) currentUser.value = JSON.parse(user)
  window.addEventListener('userchange', () => {
    const user = localStorage.getItem('currentUser')
    currentUser.value = user ? JSON.parse(user) : null
    showDropdown.value = false
  })
})
</script> 