<template>
  <div class="playlist-container">
    <h2 class="playlist-title">{{ displayName }}的歌单</h2>
    <div v-if="userPlaylist.length" class="batch-bar">
      <label class="round-checkbox">
        <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" /> 全选
      </label>
      <button v-if="selectedIds.length" class="btn batch-delete-btn" @click="removeSelected">
        一键删除 ({{ selectedIds.length}})
      </button>
    </div>
    <div class="music-list">
      <MusicCard v-for="(song, idx) in userPlaylist" :key="song.id" :song="song" :index="idx" type="remove" @play="playSong" @remove="removeFromPlaylist">
        <template #extra>
          <span @click.stop="toggleSongSelect(song.id)" class="logo-checkbox-wrapper">
            <img v-if="selectedIds.includes(song.id)" src="/images/logo.jpg" class="logo-checkbox checked" alt="logo" />
            <span v-else class="logo-checkbox-empty"></span>
          </span>
        </template>
      </MusicCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlayerStore } from '../stores/player'
import MusicCard from '../components/MusicCard.vue'
const player = usePlayerStore()
const userPlaylist = player.userPlaylist
const selectedIds = ref([])
const isAllSelected = computed(() => selectedIds.value.length === userPlaylist.length && userPlaylist.length > 0)
const displayName = ref('')
onMounted(() => {
  const user = localStorage.getItem('currentUser')
  displayName.value = user ? JSON.parse(user).username : '我的'
})
function playSong(index) {
  player.setPlayList([...userPlaylist], index)
}
function removeFromPlaylist(songId) {
  player.removeFromPlaylist(songId)
  selectedIds.value = selectedIds.value.filter(id => id !== songId)
}
function removeSelected() {
  player.clearPlaylist(selectedIds.value)
  selectedIds.value = []
}
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = userPlaylist.map(song => song.id)
  }
}
function toggleSongSelect(songId) {
  if (selectedIds.value.includes(songId)) {
    selectedIds.value = selectedIds.value.filter(id => id !== songId)
  } else {
    selectedIds.value.push(songId)
  }
}
</script>

<style scoped>
.playlist-container {
  background: rgba(255,255,255,0.95);
  border-radius: 1.5em;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  padding: 2.5em 2em 2em 2em;
  margin: 2em auto 0 auto;
  max-width: 1200px;
}
.playlist-title {
  text-align: center;
  font-size: 2.1em;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 1.5em;
  color: #ff9800;
  text-shadow: 0 2px 8px rgba(255,152,0,0.10);
}
.batch-bar {
  display: flex;
  align-items: center;
  gap: 1em;
  background: #fff;
  border-radius: 1em;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 0.7em 1.5em;
  margin-bottom: 1.5em;
}
.round-checkbox {
  display: flex;
  align-items: center;
  font-size: 1.05em;
  cursor: pointer;
  user-select: none;
}
.round-checkbox input[type='checkbox'] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ff9800;
  border-radius: 50%;
  background: #fff;
  margin-right: 0.5em;
  position: relative;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 0 2px #ff980033;
}
.round-checkbox input[type='checkbox']:checked {
  border-color: #ff5722;
  background: #fff;
}
.round-checkbox input[type='checkbox']:checked::after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  background: #ff9800;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
}
.btn.batch-delete-btn {
  margin-left: 1em;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: #fff;
  transition: box-shadow 0.2s, background 0.2s;
  border: none;
  box-shadow: none;
  border-radius: 0.7em;
}
.btn.batch-delete-btn:hover {
  box-shadow: 0 2px 12px rgba(255,152,0,0.15);
  background: linear-gradient(135deg, #ff5722, #ff9800);
}
.logo-checkbox-wrapper {
  display: inline-block;
}
.logo-checkbox {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(29,185,84,0.10);
  border: 2.5px solid #1db954;
  background: #fff;
  cursor: pointer;
  object-fit: cover;
  transition: box-shadow 0.2s, border 0.2s, filter 0.2s;
}
.logo-checkbox.checked {
  box-shadow: 0 0 0 4px #1db95433;
}
.logo-checkbox-empty {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2.5px solid #ff9800;
  background: #fff;
  display: inline-block;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(29,185,84,0.10);
  transition: border 0.2s, box-shadow 0.2s;
}
.logo-checkbox-wrapper:hover .logo-checkbox-empty {
  border: 2.5px solid #1db954;
}
</style> 