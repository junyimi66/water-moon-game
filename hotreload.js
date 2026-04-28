// 热修复脚本：自动刷新页面以便实时查看修改效果
setInterval(() => {
  fetch(location.href, {cache: 'no-store'}).then(r => {
    if (!window.__lastHotReload) window.__lastHotReload = Date.now();
    const now = Date.now();
    // 每隔2秒检测页面是否有新内容（可扩展为轮询文件变更）
    if (now - window.__lastHotReload > 10000) {
      location.reload();
    }
  });
}, 2000);
