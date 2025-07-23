// 假数据：音乐列表
const musicList = [
  {
    id: 1,
    title: 'Cloud9 - 新封建说唱2025',
    artist: 'Cloud9',
    cover: 'images/cloud9.jpg',
    url: 'mp3/Cloud9 - 新封建说唱2025.mp3'
  },
  {
    id: 2,
    title: 'Cloud9 - 怪自己',
    artist: 'Cloud9',
    cover: 'images/cloud9.jpg',
    url: 'mp3/Cloud9 - 怪自己.mp3'
  },
  {
    id: 3,
    title: 'Rapeter - 被毁掉的孩子',
    artist: 'Rapeter',
    cover: 'images/Rapeter.jpg',
    url: 'mp3/Rapeter - 被毁掉的孩子.mp3'
  },
  {
    id: 4,
    title: 'Rapeter - NO HOOK FREESTYLE Pt.4',
    artist: 'Rapeter',
    cover: 'images/Rapeter.jpg',
    url: 'mp3/Rapeter - NO HOOK FREESTYLE Pt.4.mp3'
  }
];

// 假数据：歌单
const playlistList = [
  {
    id: 1,
    name: '华语流行',
    desc: '最受欢迎的华语流行歌曲',
    cover: 'https://p1.music.126.net/0Qw1Qw1Qw1Qw1Qw1Qw1Qw==/109951163167489127.jpg',
    musics: [1, 2, 3]
  },
  {
    id: 2,
    name: '英文经典',
    desc: '经典英文歌曲推荐',
    cover: 'https://p1.music.126.net/0Qw1Qw1Qw1Qw1Qw1Qw1Qw==/109951163167489128.jpg',
    musics: [4]
  }
];

// 渲染音乐库
function renderMusicList(containerId = 'music-list') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = musicList.map(music => `
    <div class="card">
      <img src="${music.cover}" alt="${music.title}">
      <div class="card-title">${music.title}</div>
      <div class="card-desc">${music.artist}</div>
      <div class="card-btn-group">
        <button class="btn" data-play-id="${music.id}">播放</button>
        <button class="btn add-to-playlist" data-id="${music.id}">加入歌单</button>
      </div>
    </div>
  `).join('');
  bindAddToPlaylist();
}

// 渲染歌单
function renderPlaylistList(containerId = 'playlist-list') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = playlistList.map(list => `
    <div class="card">
      <img src="${list.cover}" alt="${list.name}">
      <div class="card-title">${list.name}</div>
      <div class="card-desc">${list.desc}</div>
      <div class="card-btn-group">
        <button class="btn" data-play-id="${list.id}">播放</button>
        <button class="btn remove-from-playlist" data-id="${list.id}">移除</button>
      </div>
    </div>
  `).join('');
}

// 渲染推荐音乐（首页）
function renderRecommend(containerId = 'recommend-list') {
  const container = document.getElementById(containerId);
  if (!container) return;
  let arr = musicList.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const recommend = arr.slice(0, 2);
  container.innerHTML = recommend.map(music => `
    <div class="card">
      <img src="${music.cover}" alt="${music.title}">
      <div class="card-title">${music.title}</div>
      <div class="card-desc">${music.artist}</div>
      <button class="btn" data-play-id="${music.id}">播放</button>
      <button class="btn add-to-playlist" data-id="${music.id}">加入歌单</button>
    </div>
  `).join('');
  bindAddToPlaylist();
  bindGlobalPlayBtns();
}

// 渲染热门歌单（首页）
function renderHotPlaylist(containerId = 'hot-playlist-list') {
  const container = document.getElementById(containerId);
  if (!container) return;
  // 统计所有用户歌单中每首歌出现的次数
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  let countMap = {};
  users.forEach(user => {
    if (user.userPlaylist && Array.isArray(user.userPlaylist)) {
      user.userPlaylist.forEach(id => {
        countMap[id] = (countMap[id] || 0) + 1;
      });
    }
  });
  // 取出现次数最多的两首
  let hotIds = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => parseInt(id));
  let hotMusics = hotIds.map(id => musicList.find(m => m.id === id)).filter(Boolean);
  // 若不足两首则补充推荐
  if (hotMusics.length < 2) {
    let extra = musicList.filter(m => !hotIds.includes(m.id)).slice(0, 2 - hotMusics.length);
    hotMusics = hotMusics.concat(extra);
  }
  container.innerHTML = hotMusics.length === 0
    ? '<div style="text-align:center;color:#888;">暂无热门歌单</div>'
    : hotMusics.map(music => `
      <div class="card">
        <img src="${music.cover}" alt="${music.title}">
        <div class="card-title">${music.title}</div>
        <div class="card-desc">${music.artist}</div>
        <button class="btn" data-play-id="${music.id}">播放</button>
        <button class="btn add-to-playlist" data-id="${music.id}">加入歌单</button>
      </div>
    `).join('');
  bindAddToPlaylist();
  bindGlobalPlayBtns();
}

// 音乐库搜索功能
if (location.pathname.endsWith('library.html')) {
  renderMusicList();
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  if (form && input) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const keyword = input.value.trim().toLowerCase();
      if (!keyword) {
        renderMusicList();
        return;
      }
      const result = musicList.filter(m =>
        m.title.toLowerCase().includes(keyword) ||
        m.artist.toLowerCase().includes(keyword)
      );
      renderMusicListWithData(result);
    });
  }
}

// 支持渲染指定数据的音乐列表
function renderMusicListWithData(list, containerId = 'music-list') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = list.length === 0
    ? '<div style="text-align:center;color:#888;">未找到相关音乐</div>'
    : list.map(music => `
      <div class="card">
        <img src="${music.cover}" alt="${music.title}">
        <div class="card-title">${music.title}</div>
        <div class="card-desc">${music.artist}</div>
        <div class="card-btn-group">
          <button class="btn" data-play-id="${music.id}">播放</button>
          <button class="btn add-to-playlist" data-id="${music.id}">加入歌单</button>
        </div>
      </div>
    `).join('');
  bindAddToPlaylist();
  bindGlobalPlayBtns();
}

function bindAddToPlaylist() {
  document.querySelectorAll('.add-to-playlist').forEach(btn => {
    btn.onclick = function() {
      const id = parseInt(this.getAttribute('data-id'));
      let userPlaylist = JSON.parse(localStorage.getItem('userPlaylist') || '[]');
      if (!userPlaylist.includes(id)) {
        userPlaylist.push(id);
        localStorage.setItem('userPlaylist', JSON.stringify(userPlaylist));
        this.textContent = '已加入';
        this.disabled = true;
      }
    };
  });
}

// 页面自动渲染
if (location.pathname.endsWith('library.html')) {
  renderMusicList();
}
if (location.pathname.endsWith('playlist.html')) {
  renderPlaylistList();
}
if (location.pathname.endsWith('index.html')) {
  renderRecommend();
  renderHotPlaylist();
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('refreshRecommend');
    if (btn) btn.onclick = () => renderRecommend();
  });
}

window.musicList = musicList;
window.playlistList = playlistList;

function bindGlobalPlayBtns() {
  document.querySelectorAll('.btn[data-play-id]').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      const id = parseInt(this.getAttribute('data-play-id'));
      if (typeof playMusicById === 'function') playMusicById(id);
    };
  });
}

if (typeof renderPlayerBar === 'function') renderPlayerBar();
if (typeof bindGlobalPlayBtns === 'function') bindGlobalPlayBtns(); 