const HISTORY_PASSWORD_KEY = 'historyPassword';
const HISTORY_FAILS_KEY = 'historyFails';
const HISTORY_LOCK_KEY = 'historyLock';

function getHistory() {
  const history = localStorage.getItem('browsingHistory');
  return history ? JSON.parse(history) : [];
}

function addToHistory(url, title = '') {
  const history = getHistory();
  const timestamp = new Date().toISOString();

  if (history.length > 0 && history[0].url === url) return;

  history.unshift({ url, title: title || url, timestamp });
  if (history.length > 100) history.pop();

  localStorage.setItem('browsingHistory', JSON.stringify(history));
}

function clearHistory() {
  if (confirm('Are you sure you want to clear your browsing history?')) {
    localStorage.removeItem('browsingHistory');
    showHistory();
  }
}

function deleteHistoryItem(index) {
  const history = getHistory();
  history.splice(index, 1);
  localStorage.setItem('browsingHistory', JSON.stringify(history));
  showHistory();
}

function showHistory() {
  if (!localStorage.getItem(HISTORY_PASSWORD_KEY)) {
    const pass = prompt("Set a password for your history:");
    if (pass && pass.trim() !== '') {
      localStorage.setItem(HISTORY_PASSWORD_KEY, pass);
      alert("Password set successfully!");
    } else return;
  }

  const now = Date.now();
  const lockUntil = parseInt(localStorage.getItem(HISTORY_LOCK_KEY)) || 0;
  if (now < lockUntil) {
    alert(`Locked until ${new Date(lockUntil).toLocaleTimeString()}`);
    return;
  }

  openPasswordModal();
}

function openPasswordModal() {
  const modal = document.getElementById('historyPasswordModal');
  const input = document.getElementById('historyPasswordInput');
  const msg = document.getElementById('historyPasswordMessage');
  modal.classList.add('show');
  input.value = '';
  msg.textContent = '';
  input.focus();

  document.getElementById('historyPasswordConfirmBtn').onclick = () => checkPassword(input.value);
  document.getElementById('historyPasswordCancelBtn').onclick = () => modal.classList.remove('show');
}

function checkPassword(pass) {
  const modal = document.getElementById('historyPasswordModal');
  const msg = document.getElementById('historyPasswordMessage');
  const now = Date.now();
  let fails = parseInt(localStorage.getItem(HISTORY_FAILS_KEY)) || 0;

  if (pass === localStorage.getItem(HISTORY_PASSWORD_KEY)) {
    localStorage.setItem(HISTORY_FAILS_KEY, 0);
    modal.classList.remove('show');
    displayHistory();
  } else {
    fails++;
    localStorage.setItem(HISTORY_FAILS_KEY, fails);
    msg.textContent = `Wrong password. Attempt ${fails}/3.`;
    if (fails >= 3) {
      const lockTime = now + 5 * 60 * 1000 + (fails - 3) * 5 * 60 * 1000;
      localStorage.setItem(HISTORY_LOCK_KEY, lockTime);
      modal.classList.remove('show');
      alert(`Too many failed attempts. Locked for ${Math.ceil((lockTime - now)/60000)} minutes.`);
    }
  }
}

function displayHistory() {
  const modal = document.getElementById('historyModal');
  const list = document.getElementById('historyList');
  list.innerHTML = '';

  const history = getHistory();
  if (history.length === 0) {
    list.innerHTML = '<div class="history-empty">no browsing history yet</div>';
  } else {
    history.forEach((item, index) => {
      const date = new Date(item.timestamp);
      const timeStr = date.toLocaleString();
      const el = document.createElement('div');
      el.className = 'history-item';
      el.innerHTML = `
        <div class="history-item-content" onclick="loadHistoryUrl('${item.url.replace(/'/g, "\\'")}')">
          <div class="history-item-title">${item.title}</div>
          <div class="history-item-url">${item.url}</div>
          <div class="history-item-time">${timeStr}</div>
        </div>
        <button class="history-item-delete" onclick="deleteHistoryItem(${index})">×</button>
      `;
      list.appendChild(el);
    });
  }

  modal.classList.add('show');
}

function hideHistory() {
  document.getElementById('historyModal').classList.remove('show');
}

function loadHistoryUrl(url) {
  hideHistory();
  loadNewPage(url);
}
