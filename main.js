// 玩家数据
const players = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `罪人${i + 1}号`,
  team: Math.floor(i / 3) + 1,
  step: 0,
  finished: false
}));

let currentPlayerIdx = 0;
const totalSteps = 55;
const primeSteps = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];

function renderPlayers() {
  const playersDiv = document.getElementById('players');
  playersDiv.innerHTML = '';
  players.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'player-card' + (idx === currentPlayerIdx ? ' active' : '');
    card.innerHTML = `<b>${p.name}</b><br>队伍: ${p.team}<br>步数: ${p.step}${p.finished ? ' <span style="color:green">已到终点</span>' : ''}`;
    playersDiv.appendChild(card);
  });
}

function showEventModal(text, actions = []) {
  document.getElementById('eventText').innerText = text;
  const actionsDiv = document.getElementById('eventActions');
  actionsDiv.innerHTML = '';
  actions.forEach(({ label, handler }) => {
    const btn = document.createElement('button');
    btn.innerText = label;
    btn.onclick = handler;
    actionsDiv.appendChild(btn);
  });
  document.getElementById('eventModal').classList.remove('hidden');
}

function closeEventModal() {
  document.getElementById('eventModal').classList.add('hidden');
}

function nextPlayer() {
  let nextIdx = currentPlayerIdx;
  do {
    nextIdx = (nextIdx + 1) % players.length;
  } while (players[nextIdx].finished && nextIdx !== currentPlayerIdx);
  currentPlayerIdx = nextIdx;
  renderPlayers();
  updateCurrentPlayerText();
}

function updateCurrentPlayerText() {
  const p = players[currentPlayerIdx];
  document.getElementById('currentPlayer').innerText = `当前: ${p.name} (队伍${p.team})`;
}

function rollDice() {
  const p = players[currentPlayerIdx];
  if (p.finished) {
    nextPlayer();
    return;
  }
  const dice = Math.floor(Math.random() * 6) + 1;
  let nextStep = p.step + dice;
  // 17步特殊事件
  if (p.step < 17 && nextStep >= 17) {
    showEventModal('你到达第17步，可选择是否飞行到29步', [
      {
        label: '飞行到29步',
        handler: () => {
          p.step = 29;
          checkPrimeEvent(p);
          closeEventModal();
          checkFinish(p);
          nextPlayer();
        }
      },
      {
        label: '不飞行',
        handler: () => {
          p.step = nextStep;
          checkPrimeEvent(p);
          closeEventModal();
          checkFinish(p);
          nextPlayer();
        }
      }
    ]);
    return;
  }
  p.step = Math.min(nextStep, totalSteps);
  checkPrimeEvent(p);
  checkFinish(p);
  nextPlayer();
}

function checkPrimeEvent(p) {
  if (primeSteps.includes(p.step)) {
    let text = '';
    if ([2, 3, 5, 7].includes(p.step)) {
      text = `第${p.step}步：性能升级事件（请补充文本）`;
    } else {
      text = `第${p.step}步：空事件牌（后续补充）`;
    }
    showEventModal(text);
  }
}

function checkFinish(p) {
  if (p.step >= totalSteps) {
    p.finished = true;
    showEventModal(`${p.name} 已到达终点！`);
  }
}

document.getElementById('rollBtn').onclick = rollDice;

// 初始化
renderPlayers();
updateCurrentPlayerText();
