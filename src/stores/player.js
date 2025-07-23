import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    playlist: [
      {
        id: 1,
        title: 'Cloud9 - 怪自己',
        artist: 'Cloud9',
        url: '/mp3/Cloud9 - 怪自己.mp3',
        cover: '/images/cloud9.jpg'
      },
      {
        id: 2,
        title: 'Cloud9 - 新封建说唱2025',
        artist: 'Cloud9',
        url: '/mp3/Cloud9 - 新封建说唱2025.mp3',
        cover: '/images/cloud9.jpg'
      },
      {
        id: 3,
        title: 'Rapeter - NO HOOK FREESTYLE Pt.4',
        artist: 'Rapeter',
        url: '/mp3/Rapeter - NO HOOK FREESTYLE Pt.4.mp3',
        cover: '/images/Rapeter.jpg'
      },
      {
        id: 4,
        title: 'Rapeter - 被毁掉的孩子',
        artist: 'Rapeter',
        url: '/mp3/Rapeter - 被毁掉的孩子.mp3',
        cover: '/images/Rapeter.jpg'
      }
    ],
    userPlaylist: JSON.parse(localStorage.getItem('userPlaylist') || '[]'),
    currentIndex: 0,
    playing: false,
    progress: 0,
    volume: 1
  }),
  getters: {
    currentSong(state) {
      return state.playlist[state.currentIndex] || {};
    }
  },
  actions: {
    play(index) {
      if (typeof index === 'number') this.currentIndex = index;
      this.playing = true;
    },
    pause() {
      this.playing = false;
    },
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      this.playing = true;
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.playing = true;
    },
    setProgress(val) {
      this.progress = val;
    },
    setVolume(val) {
      this.volume = val;
    },
    addToPlaylist(song) {
      if (!this.userPlaylist.find(s => s.id === song.id)) {
        this.userPlaylist.push(song)
        localStorage.setItem('userPlaylist', JSON.stringify(this.userPlaylist))
      }
    },
    removeFromPlaylist(songId) {
      const idx = this.userPlaylist.findIndex(s => s.id === songId)
      if (idx !== -1) {
        this.userPlaylist.splice(idx, 1)
        localStorage.setItem('userPlaylist', JSON.stringify(this.userPlaylist))
      }
    },
    clearPlaylist(ids) {
      for (let i = this.userPlaylist.length - 1; i >= 0; i--) {
        if (ids.includes(this.userPlaylist[i].id)) {
          this.userPlaylist.splice(i, 1)
        }
      }
      localStorage.setItem('userPlaylist', JSON.stringify(this.userPlaylist))
    },
    setPlayList(list, index = 0) {
      this.playlist = list
      this.currentIndex = index
      this.playing = true
    }
  }
}) 