// Boss战玩家数据结构示例
const players = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `罪人${i + 1}号`,
  team: Math.floor(i / 3) + 1,
  level: 1,
  breakthrough: 0, // 0~3，4破
  promotion: 1, // 晋升点
  weapon: false, // 是否获得专属武器
  ego: false, // 是否获得E.G.O
  skills: [
    { name: '1技能', count: 3, used: 0 },
    { name: '2技能', count: 2, used: 0 },
    { name: '3技能(大招)', count: 1, used: 0, unlocked: false },
    { name: 'E.G.O(隐藏技能)', count: 1, used: 0, unlocked: false }
  ]
}));

function renderBossPlayers() {
  const div = document.getElementById('bossPlayers');
  div.innerHTML = '';
  players.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `<b>${p.name}</b> Lv.${p.level} <br>队伍: ${p.team}<br>晋升点: ${p.promotion} <br>突破: ${p.breakthrough}破 <br>${p.weapon ? '专属武器✔️<br>' : ''}${p.ego ? 'E.G.O✔️<br>' : ''}`;
    card.innerHTML += '<div>技能卡：';
    p.skills.forEach((s, i) => {
      if (i === 2 && !s.unlocked) return; // 大招未解锁不显示
      if (i === 3 && !s.unlocked) {
        card.innerHTML += `<div style="color:#888">E.G.O(隐藏技能)：未解锁</div>`;
        return;
      }
      card.innerHTML += `<div>${s.name} ×${s.count}（已用${s.used}）</div>`;
    });
    card.innerHTML += '</div>';
    div.appendChild(card);
  });
}

function closeBossModal() {
  document.getElementById('bossModal').classList.add('hidden');
}

// 福利事件发放
function grantWelfare(playerIdx, eventIdx) {
  const p = players[playerIdx];
  if (eventIdx === 0) {
    p.level = 30;
  } else if (eventIdx === 1) {
    p.weapon = true;
  } else if (eventIdx === 2) {
    p.promotion += 1;
  } else if (eventIdx === 3) {
    p.skills[3].unlocked = true;
    p.ego = true;
  }
  renderBossPlayers();
}

// 解除限制（突破）
function breakthrough(playerIdx) {
  const p = players[playerIdx];
  if (p.promotion > 0 && p.breakthrough < 3) {
    p.promotion -= 1;
    p.breakthrough += 1;
    if (p.breakthrough === 2) {
      p.skills[2].unlocked = true; // 解锁大招
    }
    renderBossPlayers();
  }
}

// 技能连携增强效果状态
const skillChainState = Array.from({ length: 12 }, () => ({ lastSkill: null, enhance2: false, enhance3: false, enhanceEGO: false }));
let enhanceRuleShown = false;

// 使用技能卡
function useSkill(playerIdx, skillIdx) {
  const p = players[playerIdx];
  const skill = p.skills[skillIdx];
  const chain = skillChainState[playerIdx];
  if (skill.count > skill.used) {
    // 连携增强逻辑
    if (chain.lastSkill === 0 && skillIdx === 1) {
      chain.enhance2 = true; // 1→2增强2技能
    } else {
      chain.enhance2 = false;
    }
    if (chain.lastSkill === 1 && skillIdx === 2) {
      chain.enhance3 = true; // 2→3增强3技能
    } else {
      chain.enhance3 = false;
    }
    if (chain.lastSkill === 2 && skillIdx === 3) {
      chain.enhanceEGO = true; // 3→EGO增强EGO
    } else {
      chain.enhanceEGO = false;
    }
    chain.lastSkill = skillIdx;

    skill.used += 1;
    // 检查EGO解锁条件（6张技能卡各用一次后解锁EGO）
    if (
      !p.ego &&
      p.skills[0].used >= 1 &&
      p.skills[1].used >= 1 &&
      p.skills[2].unlocked && p.skills[2].used >= 1
    ) {
      grantWelfare(playerIdx, 3); // 解锁EGO
    }
    renderBossPlayers();
  }
}


// 开局弹窗提示增强规则
function showEnhanceRuleOnce() {
  if (!enhanceRuleShown) {
    enhanceRuleShown = true;
    document.getElementById('bossModalText').innerText =
      '技能连携规则：\n1→2技能、2→3技能、3→E.G.O时，后续技能卡描述数值增加一半，仅本次有效。';
    document.getElementById('bossModalActions').innerHTML = '';
    document.getElementById('bossModal').classList.remove('hidden');
  }
}

// 页面加载时自动弹窗规则
window.addEventListener('DOMContentLoaded', showEnhanceRuleOnce);
// 像素风格技能卡片演示
function renderPixelCardDemo() {
  const demoDiv = document.getElementById('pixelCardDemo');
  demoDiv.innerHTML = '';
  const cards = [
    {
      title: 'Whip',
      icon: '🦴',
      desc: '对敌人造成基础伤害',
      footer: '1技能'
    },
    {
      title: 'King Bible',
      icon: '📘',
      desc: '击退敌人，有几率暴击',
      footer: '2技能'
    },
    {
      title: 'Ultimate',
      icon: '💥',
      desc: '大招：强力范围伤害',
      footer: '3技能(大招)'
    },
    {
      title: 'E.G.O',
      icon: '👁️',
      desc: '隐藏技能：无视伤害并造成额外一击（使用有代价）',
      footer: 'E.G.O(隐藏技能)'
    }
  ];
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  cards.forEach(card => {
    const el = document.createElement('div');
    el.className = 'pixel-card';
    el.innerHTML = `
      <div class="card-title">${card.title}</div>
      <div class="card-icon">${card.icon}</div>
      <div class="card-desc">${card.desc}</div>
      <div class="card-footer">${card.footer}</div>`;
    wrap.appendChild(el);
  });
  demoDiv.appendChild(wrap);
}

renderPixelCardDemo();
  demoDiv.appendChild(wrap);
}

renderPixelCardDemo();
