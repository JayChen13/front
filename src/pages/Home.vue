<template>
  <div>
    <section class="hero">
      <h1>欢迎来到MyMusic音乐网站</h1>
      <p>发现好音乐，享受美好生活！</p>
    </section>
    <section>
      <h2 style="display:flex;align-items:center;justify-content:space-between;">
        <span>推荐音乐</span>
        <button class="btn change-btn" @click="changeRecommend">换一批</button>
      </h2>
      <div class="music-list">
        <MusicCard v-for="(song, idx) in recommendList" :key="song.id + '-' + idx" :song="song" :index="idx" type="add" @play="playSong" @add="addToPlaylist" />
      </div>
    </section>
    <section>
      <h2>热门歌单</h2>
      <div class="music-list">
        <MusicCard v-for="song in hotPlaylist" :key="song.id" :song="song" :index="song.indexInPlaylist" type="add" @play="playSong" @add="addToPlaylist" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'
import MusicCard from '../components/MusicCard.vue'
const player = usePlayerStore()
const recommendList = ref([])
function getRandomRecommend() {
  const arr = [...player.$state.playlist]
  const res = []
  while (arr.length && res.length < 2) {
    const idx = Math.floor(Math.random() * arr.length)
    res.push(arr.splice(idx, 1)[0])
  }
  return res
}
function changeRecommend() {
  recommendList.value = getRandomRecommend()
}
changeRecommend()

// 假设热门歌单为用户经常加入歌单的歌曲，这里用后两首模拟
const hotPlaylist = player.playlist.slice(-2).map((song, idx) => ({ ...song, indexInPlaylist: player.playlist.length - 2 + idx }))

function playSong(index) {
  player.play(index)
}
function addToPlaylist(song) {
  player.addToPlaylist(song)
}
</script>

<style scoped>
.btn.change-btn {
  background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
  color: #fff;
  border: none;
  border-radius: 1em;
  padding: 0.5em 0.7em;
  font-size: 0.65em;
  font-weight: 500;
  cursor: pointer;
  margin-left: 1em;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(255,152,0,0.10);
}
.btn.change-btn:hover {
  background: linear-gradient(135deg, #ff5722 0%, #ff9800 100%);
  box-shadow: 0 4px 16px rgba(255,152,0,0.18);
}
</style> 