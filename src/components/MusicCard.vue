<template>
  <div class="card" :class="{selected:selected}" >
    <div class="card-extra"><slot name="extra"></slot></div>
    <img :src="song.cover" :alt="song.title" />
    <div class="card-title">{{ song.title }}</div>
    <div class="card-desc">{{ song.artist }}</div>
    <button class="btn" @click="$emit('play', index)">播放</button>
    <button v-if="type==='add'" class="btn add-btn" :disabled="isAdded" @click.stop="addToPlaylist">{{ isAdded ? '已加入' : '加入歌单' }}</button>
    <button v-if="type==='remove'" class="btn remove-btn" @click.stop="$emit('remove', song.id)">移除</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '../stores/player'
const props = defineProps({ song: Object, index: Number, type: String, selected: Boolean })
const player = usePlayerStore()
const isAdded = computed(() => player.userPlaylist.some(s => s.id === props.song.id))
function addToPlaylist() {
  if (!isAdded.value) {
    player.addToPlaylist(props.song)
  }
}
</script>

<style scoped>
.card {
  background: rgba(255,255,255,0.9);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  width: 320px;
  max-width: 320px;
  min-width: 320px;
  height: 420px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 1px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
}
.card.selected {
  border: 2.5px solid #ff9800;
  box-shadow: 0 0 0 4px #ff980055, 0 8px 32px rgba(0,0,0,0.13);
}
.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 1rem;
  margin-bottom: 1.2rem;
  transition: transform 0.3s ease;
}
.card:hover img {
  transform: scale(1.05);
}
.card-title {
  font-size: 1.15rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}
.card-desc {
  font-size: 0.98rem;
  color: #666;
  margin-bottom: 1.2rem;
}
.btn {
  width: 100%;
  margin: 0.4rem 0 0 0;
  display: block;
  border-radius: 0.7rem;
  font-size: 1.08rem;
  font-weight: 500;
  background: linear-gradient(135deg, #1db954, #1ed760);
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(29,185,84,0.3);
  position: relative;
  overflow: hidden;
}
.btn:disabled {
  background: #bdbdbd;
  color: #fff;
  cursor: not-allowed;
}
.btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #159c43, #1db954);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(29,185,84,0.4);
}
.add-btn {
  background: linear-gradient(135deg, #ff9800, #ffc107);
  color: #fff;
}
.add-btn:disabled {
  background: #ffd54f;
  color: #fff;
}
.add-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ffb300, #ff9800);
}
.remove-btn {
  background: linear-gradient(135deg, #d32f2f, #f44336);
  color: #fff;
}
.remove-btn:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
}
.card-extra {
  position: absolute;
  top: 0.9em;
  right: 0.9em;
  z-index: 2;
}
</style> 