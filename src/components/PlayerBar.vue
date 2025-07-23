<template>
  <div class="player-bar-wrapper">
    <div class="player-bar-main">
      <!-- 左侧：封面+歌名+歌手 -->
      <div class="player-info">
        <img :src="currentSong.cover" alt="封面" class="cover" />
        <div class="meta">
          <div class="title">{{ currentSong.title }}</div>
          <div class="artist">{{ currentSong.artist }}</div>
        </div>
      </div>
      <!-- 中间：控制按钮 -->
      <div class="player-controls">
        <button class="icon-btn" :class="{active: isLoop}" @click="toggleLoop" title="循环"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M17 17v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 7V6a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v1" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="7 17 3 21 7 21" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="17 7 21 3 17 3" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
        <button class="icon-btn" :class="{active: isShuffle}" @click="toggleShuffle" title="随机"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M16 3h5v5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 20l16-16" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 4l16 16" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 21h5v-5" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
        <button class="icon-btn" @click="prev" title="上一首"><svg width="32" height="32" viewBox="0 0 24 24"><path d="M6 4v16M20 4l-12 8 12 8z" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
        <button class="play-btn" @click="togglePlay" title="播放/暂停">
          <svg v-if="!playing" width="48" height="48" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1db954"/><polygon points="10,8 18,12 10,16" fill="#fff"/></svg>
          <svg v-else width="48" height="48" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1db954"/><rect x="9" y="8" width="2" height="8" fill="#fff"/><rect x="13" y="8" width="2" height="8" fill="#fff"/></svg>
        </button>
        <button class="icon-btn" @click="next" title="下一首"><svg width="32" height="32" viewBox="0 0 24 24"><path d="M18 20V4M4 4l12 8-12 8z" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
      </div>
      <!-- 右侧：音量/列表 -->
      <div class="player-side">
        <svg width="24" height="24" viewBox="0 0 24 24" style="vertical-align:middle;"><path d="M3 9v6h4l5 5V4L7 9H3z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="onVolume" class="volume-slider" />
        <button class="icon-btn" @click="toggleList" :class="{active: showList}" title="播放列表"><svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor"/><rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor"/><rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor"/></svg></button>
      </div>
    </div>
    <!-- 底部进度条 -->
    <div class="player-progress-bar">
      <span class="time">{{ formatTime(currentTime) }}</span>
      <input type="range" min="0" :max="duration" step="0.1" v-model="currentTime" @input="onSeek" class="progress-slider" />
      <span class="time">{{ formatTime(duration) }}</span>
    </div>
    <!-- 播放列表弹窗 -->
    <div v-if="showList" class="playlist-popup">
      <div class="playlist-title">播放列表</div>
      <ul>
        <li v-for="(song, idx) in player.playlist" :key="song.id" :class="{active: idx === player.currentIndex}" @click="playSong(idx)">
          <img :src="song.cover" alt="封面" />
          <span>{{ song.title }} - {{ song.artist }}</span>
        </li>
      </ul>
      <button class="close-btn" @click="toggleList">关闭</button>
    </div>
    <audio ref="audio" :src="currentSong.url" @timeupdate="onTimeUpdate" @ended="onEnded" @canplay="onCanPlay" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { usePlayerStore } from '../stores/player'
const player = usePlayerStore()
const audio = ref(null)

const playing = computed(() => player.playing)
const currentSong = computed(() => player.currentSong)
const volume = ref(player.volume)
const showList = ref(false)
const isShuffle = ref(false)
const isLoop = ref(false)
const duration = ref(0)
const currentTime = ref(0)

watch(() => player.currentIndex, () => {
  if (audio.value) {
    audio.value.src = player.currentSong.url
    if (player.playing) audio.value.play()
  }
  currentTime.value = 0
})

watch(playing, (val) => {
  if (!audio.value) return
  if (val) audio.value.play()
  else audio.value.pause()
})

onMounted(() => {
  if (audio.value) {
    audio.value.volume = player.volume
    if (player.playing) audio.value.play()
  }
})

function togglePlay() {
  if (!audio.value) return
  if (player.playing) {
    audio.value.pause()
    player.pause()
  } else {
    audio.value.play()
    player.play()
  }
}
function prev() {
  if (isShuffle.value) {
    playRandom()
  } else {
    player.prev()
  }
}
function next() {
  if (isShuffle.value) {
    playRandom()
  } else {
    player.next()
  }
}
function playRandom() {
  let idx = Math.floor(Math.random() * player.playlist.length)
  while (idx === player.currentIndex && player.playlist.length > 1) {
    idx = Math.floor(Math.random() * player.playlist.length)
  }
  player.play(idx)
}
function onTimeUpdate() {
  if (!audio.value) return
  currentTime.value = audio.value.currentTime
  duration.value = audio.value.duration || 0
  player.setProgress((currentTime.value / (duration.value || 1)) * 100)
}
function onSeek() {
  if (!audio.value || !audio.value.duration) return
  audio.value.currentTime = currentTime.value
}
function onVolume() {
  if (!audio.value) return
  audio.value.volume = volume.value
  player.setVolume(volume.value)
}
function onCanPlay() {
  if (player.playing) audio.value.play()
  duration.value = audio.value.duration || 0
}
function onEnded() {
  if (isLoop.value) {
    audio.value.currentTime = 0
    audio.value.play()
  } else {
    next()
  }
}
function toggleShuffle() {
  isShuffle.value = !isShuffle.value
}
function toggleLoop() {
  isLoop.value = !isLoop.value
}
function toggleList() {
  showList.value = !showList.value
}
function playSong(idx) {
  player.play(idx)
  showList.value = false
}
function formatTime(t) {
  t = Math.floor(t)
  const m = Math.floor(t / 60)
  const s = t % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.player-bar-wrapper {
  width: 100vw;
  background: #181818;
  color: #fff;
  position: fixed;
  left: 0; right: 0; bottom: 0;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.18);
  font-family: inherit;
}
.player-bar-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.5em 2em 0.2em 2em;
}
.player-info {
  display: flex;
  align-items: center;
  min-width: 0;
}
.cover {
  width: 48px; height: 48px; border-radius: 0.5em; object-fit: cover; box-shadow: 0 2px 8px rgba(30,185,84,0.08);
  margin-right: 1em;
}
.meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}
.title {
  font-weight: bold;
  font-size: 1.1em;
  color: #fff;
  margin-bottom: 0.2em;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.artist {
  color: #b3b3b3;
  font-size: 0.97em;
}
.player-controls {
  display: flex;
  align-items: center;
  gap: 0.7em;
  justify-content: center;
}
.icon-btn {
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0.3em;
  border-radius: 50%;
  transition: background 0.2s, color 0.2s;
}
.icon-btn.active, .icon-btn:hover {
  color: #1db954;
  background: rgba(29,185,84,0.08);
}
.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 0.7em;
  padding: 0;
  border-radius: 50%;
  transition: box-shadow 0.2s;
}
.play-btn:active {
  box-shadow: 0 0 0 4px rgba(29,185,84,0.15);
}
.player-side {
  display: flex;
  align-items: center;
  gap: 0.7em;
  min-width: 180px;
}
.volume-slider {
  width: 90px;
  margin: 0 0.5em;
}
.player-progress-bar {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.2em 2em 0.7em 2em;
}
.progress-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #404040;
  accent-color: #1db954;
}
.time {
  font-size: 0.95em;
  color: #b3b3b3;
  min-width: 40px;
  text-align: center;
}
.playlist-popup {
  position: absolute;
  right: 2em;
  bottom: 70px;
  background: #222;
  color: #fff;
  border-radius: 1em;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  min-width: 320px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 2000;
  padding: 1em;
}
.playlist-title {
  font-weight: bold;
  margin-bottom: 0.7em;
  font-size: 1.1em;
}
.playlist-popup ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.playlist-popup li {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.5em 0.2em;
  border-radius: 0.5em;
  cursor: pointer;
  transition: background 0.2s;
}
.playlist-popup li.active, .playlist-popup li:hover {
  background: rgba(29,185,84,0.12);
  color: #1db954;
}
.playlist-popup img {
  width: 36px; height: 36px; border-radius: 0.5em; object-fit: cover;
}
.close-btn {
  margin-top: 1em;
  background: #1db954;
  color: #fff;
  border: none;
  border-radius: 0.7em;
  padding: 0.5em 1.2em;
  font-size: 1em;
  cursor: pointer;
  float: right;
}
@media (max-width: 800px) {
  .player-bar-main, .player-progress-bar {
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
  .playlist-popup {
    right: 0.5em;
    min-width: 220px;
  }
}
</style> 