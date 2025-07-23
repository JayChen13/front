<template>
  <div class="library-container">
    <h2 class="library-title">{{ displayName }}的音乐库</h2>
    <div class="music-list">
      <MusicCard v-for="(song, idx) in playlist" :key="song.id" :song="song" :index="idx" type="add" @play="playSong" @add="addToPlaylist" />
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '../stores/player'
import MusicCard from '../components/MusicCard.vue'
import { ref, onMounted } from 'vue'
const player = usePlayerStore()
// 直接用 $state.playlist，避免被 setPlayList 覆盖
const playlist = player.$state.playlist
const displayName = ref('')
onMounted(() => {
  const user = localStorage.getItem('currentUser')
  displayName.value = user ? JSON.parse(user).username : '我的'
})
function playSong(index) {
  player.play(index)
}
function addToPlaylist(song) {
  player.addToPlaylist(song)
}
</script>

<style scoped>
.library-container {
  background: rgba(255,255,255,0.95);
  border-radius: 1.5em;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  padding: 2.5em 2em 2em 2em;
  margin: 2em auto 0 auto;
  max-width: 1200px;
}
.library-title {
  text-align: center;
  font-size: 2.1em;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 1.5em;
  color: #1db954;
  text-shadow: 0 2px 8px rgba(29,185,84,0.10);
}
</style> 