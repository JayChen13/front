import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Library from '../pages/Library.vue'
import Playlist from '../pages/Playlist.vue'
import Profile from '../pages/Profile.vue'
import About from '../pages/About.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/library', component: Library },
  { path: '/playlist', component: Playlist },
  { path: '/profile', component: Profile },
  { path: '/about', component: About },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 