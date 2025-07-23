document.addEventListener('DOMContentLoaded', function() {
  // 注册表单
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.onsubmit = function(e) {
      e.preventDefault();
      const username = this.username.value.trim();
      const password = this.password.value;
      const nickname = this.nickname.value.trim();
      // 校验必填
      if (!username || !password || !nickname) {
        alert('请填写所有必填项！');
        return;
      }
      // 校验密码规则
      const pwdReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@?.]).{13,}$/;
      if (!pwdReg.test(password)) {
        alert('密码不少于13位，需包含字母、数字和特殊符号（@、？、.）');
        return;
      }
      // 检查用户名是否已存在
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.username === username)) {
        alert('用户名已存在，请更换！');
        return;
      }
      // 头像处理（可选）
      let avatar = '';
      const avatarInput = this.avatar;
      if (avatarInput && avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          avatar = e.target.result;
          saveUser();
        };
        reader.readAsDataURL(avatarInput.files[0]);
        return;
      }
      saveUser();
      function saveUser() {
        users.push({ username, password, nickname, avatar });
        localStorage.setItem('users', JSON.stringify(users));
        alert('注册成功，请登录使用吧~');
        window.location.href = 'login.html';
      }
    };
  }
  // 登录表单
  const loginForm = document.getElementById('loginForm');
  const rememberMe = document.getElementById('rememberMe');
  if (loginForm && rememberMe) {
    // 自动填充记住的用户名和密码
    const saved = JSON.parse(localStorage.getItem('rememberMe') || '{}');
    if (saved.username && saved.password) {
      loginForm.username.value = saved.username;
      loginForm.password.value = saved.password;
      rememberMe.checked = true;
    }
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const username = this.username.value.trim();
      const password = this.password.value;
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        alert('用户名或密码错误！');
        return;
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      // 记住密码逻辑
      if (rememberMe.checked) {
        localStorage.setItem('rememberMe', JSON.stringify({username, password}));
      } else {
        localStorage.removeItem('rememberMe');
      }
      alert('欢迎进入音乐世界，快来听音乐吧~');
      window.location.href = 'index.html';
    };
  }
}); 