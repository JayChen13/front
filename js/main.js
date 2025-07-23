// 只创建一次全局audio
if (!window._globalAudio) {
  const audio = document.createElement('audio');
  audio.id = 'player-audio';
  audio.style.display = 'none';
  document.body.appendChild(audio);
  window._globalAudio = audio;
}

function renderPlayerBar() {
  if (document.getElementById('global-player-bar')) return;
  const bar = document.createElement('div');
  bar.id = 'global-player-bar';
  bar.style = 'position:fixed;left:0;right:0;bottom:0;z-index:1000;background:#fff;box-shadow:0 -2px 8px rgba(0,0,0,0.08);display:flex;align-items:center;gap:1.2em;padding:0.5em 1.5em;min-height:64px;transition:box-shadow 0.2s;';
  bar.innerHTML = `
    <button id="player-prev" class="btn" style="min-width:40px;">⏮️</button>
    <img id="player-cover" src="" alt="封面" style="width:48px;height:48px;border-radius:0.5em;object-fit:cover;box-shadow:0 2px 8px rgba(30,185,84,0.08);">
    <div style="flex:1;min-width:0;">
      <div id="player-title" style="font-weight:bold;font-size:1.1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#000;"></div>
      <div id="player-artist" style="color:#888;font-size:0.97em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
      <input id="player-progress" type="range" min="0" max="100" value="0" style="width:100%;margin-top:0.3em;">
    </div>
    <input id="player-volume" type="range" min="0" max="1" step="0.01" value="1" style="width:90px;margin-left:1em;">
    <button id="player-play" class="btn" style="min-width:48px;">▶️</button>
    <button id="player-next" class="btn" style="min-width:40px;">⏭️</button>
  `;
  document.body.appendChild(bar);
  // 桌面歌词区域
  if (!document.getElementById('desktop-lyric')) {
    const lyricDiv = document.createElement('div');
    lyricDiv.id = 'desktop-lyric';
    lyricDiv.style = 'position:fixed;left:50%;bottom:80px;transform:translateX(-50%);z-index:2000;background:rgba(255,255,255,0.95);padding:0.5em 1.5em;border-radius:2em;box-shadow:0 2px 8px rgba(30,185,84,0.10);font-size:1.1em;color:#222;pointer-events:none;min-width:200px;text-align:center;transition:opacity 0.2s;';
    lyricDiv.textContent = '';
    document.body.appendChild(lyricDiv);
  }
  // 音量滑块事件绑定
  setTimeout(() => {
    const audio = window._globalAudio;
    const volumeSlider = document.getElementById('player-volume');
    if (volumeSlider && audio) {
      volumeSlider.value = audio.volume;
      volumeSlider.oninput = function() {
        audio.volume = parseFloat(this.value);
      };
    }
  }, 0);
}

// 假歌词数据
const lyricMap = {
  1: [
    { t: 0, text: '无歌词' },
  ],
  2: [
    { t: 0, text: '无歌词' },
  ],
  3: [
    { t: 0, text: '无歌词' },
  ],
  4: [
    { t: 0, text: '无歌词' },
  ]
};

let currentMusicIndex = -1;
let currentLyricTimer = null;

function playMusicById(id, isRestore) {
  const musicArr = window.musicList || [];
  const idx = musicArr.findIndex(m => m.id === id);
  if (idx === -1) return;
  currentMusicIndex = idx;
  const music = musicArr[idx];
  document.getElementById('player-cover').src = music.cover;
  document.getElementById('player-title').textContent = music.title;
  document.getElementById('player-artist').textContent = music.artist;
  const audio = window._globalAudio;
  const playBtn = document.getElementById('player-play');
  const progress = document.getElementById('player-progress');
  audio.src = music.url;
  if (!isRestore) audio.currentTime = 0;
  if (!isRestore) audio.play();
  // 歌词同步
  syncLyric(music.id, audio);
  // 重新绑定事件，确保切歌后依然有效
  if (playBtn && audio) {
    playBtn.onclick = function() {
      if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸️';
      } else {
        audio.pause();
        playBtn.textContent = '▶️';
      }
    };
    audio.onplay = function() { playBtn.textContent = '⏸️'; };
    audio.onpause = function() { playBtn.textContent = '▶️'; };
  }
  if (progress && audio) {
    audio.ontimeupdate = function() {
      if (!audio.duration) return;
      progress.value = Math.floor(audio.currentTime / audio.duration * 100);
      // 保存播放进度
      localStorage.setItem('playerState', JSON.stringify({
        id: music.id,
        currentTime: audio.currentTime,
        paused: audio.paused
      }));
    };
    progress.oninput = function() {
      if (audio.duration) {
        audio.currentTime = progress.value / 100 * audio.duration;
      }
    };
  }
  // 保存当前播放状态
  if (!isRestore) {
    localStorage.setItem('playerState', JSON.stringify({
      id: music.id,
      currentTime: 0,
      paused: false
    }));
  }
}

function syncLyric(musicId, audio) {
  const lyricArr = lyricMap[musicId] || [];
  const lyricDiv = document.getElementById('desktop-lyric');
  if (!lyricDiv) return;
  if (currentLyricTimer) {
    clearInterval(currentLyricTimer);
    currentLyricTimer = null;
  }
  if (lyricArr.length === 0) {
    lyricDiv.textContent = '';
    return;
  }
  function updateLyric() {
    const t = audio.currentTime;
    let current = '';
    for (let i = 0; i < lyricArr.length; i++) {
      if (t >= lyricArr[i].t) current = lyricArr[i].text;
      else break;
    }
    lyricDiv.textContent = current;
  }
  updateLyric();
  currentLyricTimer = setInterval(updateLyric, 300);
  audio.onended = function() {
    lyricDiv.textContent = '';
    clearInterval(currentLyricTimer);
    currentLyricTimer = null;
  };
}

function renderUserNav() {
  const navAuth = document.querySelector('.nav-auth');
  if (!navAuth) return;
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (user) {
    const avatar = user.avatar ? user.avatar : 'images/default-avatar.png';
    navAuth.innerHTML = `
      <div class="user-nav-dropdown" style="position:relative;display:inline-block;">
        <div id="userNavTrigger" style="cursor:pointer;display:flex;align-items:center;">
          <img src="${avatar}" alt="头像" style="width:32px;height:32px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:0.5em;border:2px solid #1db954;">
          <span style="vertical-align:middle;font-weight:bold;">${user.nickname || user.username}</span>
          <span style="margin-left:0.3em;font-size:1.1em;">▼</span>
        </div>
        <div id="userNavMenu" style="display:none;position:absolute;right:0;top:120%;background:#fff;border-radius:0.5em;box-shadow:0 2px 8px rgba(0,0,0,0.12);min-width:120px;z-index:99;">
          <a href="profile.html" style="display:block;padding:0.7em 1.2em;color:#222;text-decoration:none;">个人中心</a>
          <a href="playlist.html" style="display:block;padding:0.7em 1.2em;color:#222;text-decoration:none;">我的歌单</a>
          <a href="#" id="logoutBtnNav" style="display:block;padding:0.7em 1.2em;color:#d32f2f;text-decoration:none;">退出登录</a>
        </div>
      </div>
    `;
    // 下拉菜单交互
    const trigger = navAuth.querySelector('#userNavTrigger');
    const menu = navAuth.querySelector('#userNavMenu');
    if (trigger && menu) {
      trigger.onclick = function(e) {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      };
      document.addEventListener('click', function() {
        menu.style.display = 'none';
      });
    }
    // 退出登录
    const logoutBtn = navAuth.querySelector('#logoutBtnNav');
    if (logoutBtn) {
      logoutBtn.onclick = function(e) {
        e.preventDefault();
        if (confirm('确定要退出登录吗？')) {
          localStorage.removeItem('currentUser');
          window.location.reload();
        }
      };
    }
  } else {
    navAuth.innerHTML = '<a href="login.html">登录</a> / <a href="register.html">注册</a>';
  }
}

// 恢复播放状态
function restorePlayerState() {
  const state = JSON.parse(localStorage.getItem('playerState') || '{}');
  if (!state.id) return;
  playMusicById(state.id, true);
  const audio = window._globalAudio;
  if (audio && state.currentTime) {
    audio.currentTime = state.currentTime;
  }
  if (audio && state.paused === false) {
    setTimeout(() => audio.play(), 100);
  }
}

if (!/login\.html$|register\.html$/.test(location.pathname)) {
  renderPlayerBar();
  renderUserNav();
  bindGlobalPlayBtns();
  restorePlayerState();
  // 绑定播放器按钮
  setTimeout(() => {
    const audio = document.getElementById('player-audio');
    const playBtn = document.getElementById('player-play');
    const prevBtn = document.getElementById('player-prev');
    const nextBtn = document.getElementById('player-next');
    const progress = document.getElementById('player-progress');
    // 暂停/播放
    if (playBtn && audio) {
      playBtn.onclick = function() {
        if (audio.paused) {
          audio.play();
          playBtn.textContent = '⏸️';
        } else {
          audio.pause();
          playBtn.textContent = '▶️';
        }
      };
      audio.onplay = function() { playBtn.textContent = '⏸️'; };
      audio.onpause = function() { playBtn.textContent = '▶️'; };
    }
    // 上一首
    if (prevBtn) {
      prevBtn.onclick = function() {
        playPrevMusic();
      };
    }
    // 下一首
    if (nextBtn) {
      nextBtn.onclick = function() {
        playNextMusic();
      };
    }
    // 进度条同步和拖动
    if (progress && audio) {
      audio.ontimeupdate = function() {
        if (!audio.duration) return;
        progress.value = Math.floor(audio.currentTime / audio.duration * 100);
      };
      progress.oninput = function() {
        if (audio.duration) {
          audio.currentTime = progress.value / 100 * audio.duration;
        }
      };
    }
  }, 0);
}

// 上一首/下一首功能
function playPrevMusic() {
  const musicArr = window.musicList || [];
  if (musicArr.length === 0) return;
  if (currentMusicIndex <= 0) {
    currentMusicIndex = musicArr.length - 1;
  } else {
    currentMusicIndex--;
  }
  playMusicById(musicArr[currentMusicIndex].id);
}

function playNextMusic() {
  const musicArr = window.musicList || [];
  if (musicArr.length === 0) return;
  if (currentMusicIndex === -1 || currentMusicIndex >= musicArr.length - 1) {
    currentMusicIndex = 0;
  } else {
    currentMusicIndex++;
  }
  playMusicById(musicArr[currentMusicIndex].id);
} 